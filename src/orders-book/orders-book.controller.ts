import {
  Controller,
  Get,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersBookService } from './orders-book.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MatchingOrdersQueryDto } from './dto/matching-orders-query.dto';
import { OrdersBookEntity } from './orders-book.entity';
import { OrdersQueryDto } from './dto/orders-query.dto';

@Controller('orders-book')
@ApiTags('orders-book')
export class OrdersBookController {
  constructor(private readonly ordersBookService: OrdersBookService) {}

  @ApiOperation({ summary: 'getOrders' })
  @ApiParam({
    name: 'user',
    type: 'string',
    required: false,
    description: 'User created order',
  })
  @ApiParam({
    name: 'tokenB',
    type: 'string',
    required: false,
    description: 'Token to sell address',
  })
  @ApiParam({
    name: 'tokenA',
    type: 'string',
    required: false,
    description: 'Token to buy address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [OrdersBookEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('getOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getOrders(
    @Query() ordersQuery: OrdersQueryDto,
  ): Promise<OrdersBookEntity[]> {
    return await this.ordersBookService.getOrders(ordersQuery);
  }

  @ApiOperation({ summary: 'getMatchingOrders' })
  @ApiParam({
    name: 'isMarket',
    type: 'boolean',
    required: true,
    description: 'Is order is market or limit',
  })
  @ApiParam({
    name: 'amountB',
    type: 'number',
    required: true,
    description: 'Tokens to sell amount',
  })
  @ApiParam({
    name: 'amountA',
    type: 'number',
    required: true,
    description: 'Tokens to buy amount',
  })
  @ApiParam({
    name: 'tokenB',
    type: 'string',
    required: true,
    description: 'Token to sell address',
  })
  @ApiParam({
    name: 'tokenA',
    type: 'string',
    required: true,
    description: 'Token to buy address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
    type: [OrdersBookEntity],
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get('getMatchingOrders')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMatchingOrders(
    @Query() matchingOrdersQueryDto: MatchingOrdersQueryDto,
  ): Promise<OrdersBookEntity[]> {
    return await this.ordersBookService.getMatchingOrders(
      matchingOrdersQueryDto,
    );
  }
}
