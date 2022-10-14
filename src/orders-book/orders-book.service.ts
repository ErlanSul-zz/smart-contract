import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersBookEntity } from './orders-book.entity';
import {
  BaseProvider,
  Contract,
  EthersContract,
  InjectEthersProvider,
  Wallet,
} from 'nestjs-ethers';
import { abi } from './constants/constants';
import { OrdersBookDto } from './dto/orders-book.dto';
import { EventFilter } from '@ethersproject/contracts';
import { Brackets, MoreThan, Repository } from 'typeorm';
import { MatchingOrdersInterface } from './interfaces/matching-orders.interface';
import { CancelOrderInterface } from './interfaces/cancel-order.interface';
import { Event } from '@ethersproject/contracts/src.ts';
import { MatchingOrdersQueryDto } from './dto/matching-orders-query.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { configService } from '../app.module';

@Injectable()
export class OrdersBookService implements OnApplicationBootstrap {
  contract: Contract;

  constructor(
    @InjectRepository(OrdersBookEntity)
    private readonly ordersBookRepository: Repository<OrdersBookEntity>,
    private readonly ethers: EthersContract,
    @InjectEthersProvider()
    private readonly ethersProvider: BaseProvider,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const wallet: Wallet = new Wallet(
      configService.walletKey,
      this.ethersProvider,
    );

    this.contract = this.ethers.create(
      configService.contractAddress,
      abi,
      wallet,
    );
    const filterCreated = this.contract.filters.OrderCreated();
    const filterMatched = this.contract.filters.OrderMatched();
    const filterCancelled = this.contract.filters.OrderCancelled();

    await this.checkEvents(filterCreated, this.createOrder.bind(this));
    await this.checkEvents(filterMatched, this.matchOrder.bind(this));
    await this.checkEvents(filterCancelled, this.cancelOrder.bind(this));
  }

  async checkEvents(
    filter: EventFilter,
    processFunc: (Event: Event) => void,
  ): Promise<void> {
    const events = await this.contract.queryFilter(filter);

    for (const contractEvent of events) {
      processFunc(contractEvent);
    }
    this.contract.on(filter, (...data) => processFunc(data[data.length - 1]));
  }

  async getMatchingOrders(
    query: MatchingOrdersQueryDto,
  ): Promise<OrdersBookEntity[]> {
    const where = {
      token_a: query.tokenB.toLowerCase(),
      token_b: query.tokenA.toLowerCase(),
      amount_a: MoreThan(query.amountA),
      amount_b: MoreThan(query.amountB),
      isActive: true,
    };

    return await this.ordersBookRepository.findBy(where);
  }

  async getOrders(ordersQuery: OrdersQueryDto): Promise<OrdersBookEntity[]> {
    let queryBuilder =
      this.ordersBookRepository.createQueryBuilder('orders_book');

    if (ordersQuery.user) {
      queryBuilder = queryBuilder.where(
        `orders_book.user = '${ordersQuery.user}'`,
      );
    }

    if (ordersQuery.tokenA && ordersQuery.tokenB) {
      queryBuilder = queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`orders_book.tokenA = '${ordersQuery.tokenA}'`).orWhere(
            `orders_book.tokenB = '${ordersQuery.tokenB}'`,
          );
        }),
      );
    } else {
      if (ordersQuery.tokenA) {
        queryBuilder = queryBuilder.andWhere(
          `orders_book.tokenB = '${ordersQuery.tokenA}'`,
        );
      }
      if (ordersQuery.tokenB) {
        queryBuilder = queryBuilder.andWhere(
          `orders_book.tokenB = '${ordersQuery.tokenB}'`,
        );
      }
    }

    return await queryBuilder.andWhere({ isActive: true }).getMany();
  }

  private async createOrder(orderData: {
    blockNumber: string;
    args: OrdersBookDto;
  }): Promise<void> {
    const args = orderData.args;
    const order = new OrdersBookEntity({
      transactionId: String(args.id),
      tokenA: args.tokenA,
      tokenB: args.tokenB,
      amountA: String(args.amountA),
      amountLeftToFill: String(args.amountA),
      amountB: String(args.amountB),
      user: args.user,
      isMarket: args.isMarket,
      blockNumber: Number(orderData.blockNumber),
      isActive: true,
    });

    const OrdersBookModel = await this.ordersBookRepository.findOneBy({
      blockNumber: order.blockNumber,
    });

    if (OrdersBookModel === null) {
      await this.ordersBookRepository.save(order);
    }
  }

  async matchOrder(orderData: MatchingOrdersInterface): Promise<void> {
    const args = orderData.args;
    const OrdersBookModel = await this.ordersBookRepository.findOneBy({
      transactionId: String(args.id),
      isActive: true,
    });

    if (OrdersBookModel !== null) {
      await this.ordersBookRepository.save({
        id: OrdersBookModel.id,
        isActive: Number(args.amountLeftToFill) !== 0,
        amountLeftToFill: String(args.amountLeftToFill),
      });
    }
  }

  async cancelOrder(orderData: CancelOrderInterface): Promise<void> {
    const args = orderData.args;
    const order = await this.ordersBookRepository.findOneBy({
      transactionId: String(args.id),
    });
    if (order !== null && order.isActive) {
      await this.ordersBookRepository.save({
        id: order.id,
        isActive: false,
      });
    }
  }
}
