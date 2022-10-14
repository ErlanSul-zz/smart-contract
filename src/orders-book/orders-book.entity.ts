import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'orders_book' })
export class OrdersBookEntity {
  @ApiProperty({ nullable: false })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: 'ID at smart contract', nullable: false })
  @Column({ name: 'transaction_id', type: 'varchar' })
  transactionId: string;

  @ApiProperty({ description: 'User', nullable: false })
  @Column({ name: 'user', type: 'varchar' })
  user: string;

  @ApiProperty({ description: 'Token to buy address', nullable: false })
  @Column({ name: 'token_a', type: 'varchar' })
  tokenA: string;

  @ApiProperty({ description: 'Token to sell address', nullable: false })
  @Column({ name: 'token_b', type: 'varchar' })
  tokenB: string;

  @ApiProperty({ description: 'Tokens to buy amount', nullable: false })
  @Column({ name: 'amount_a', type: 'varchar' })
  amountA: string;

  @ApiProperty({ description: 'Tokens to sell amount', nullable: false })
  @Column({ name: 'amount_b', type: 'varchar' })
  amountB: string;

  @ApiProperty({ description: 'Amount', nullable: false })
  @Column({ name: 'amount_left_to_fill', type: 'varchar' })
  amountLeftToFill: string;

  @ApiProperty({ description: 'Is market', nullable: false })
  @Column({ name: 'is_market', default: true })
  isMarket: boolean;

  @ApiProperty({ description: 'Is active', nullable: false })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ nullable: false })
  @Column({ name: 'block_number', type: 'integer' })
  blockNumber: number;

  constructor(order: Partial<OrdersBookEntity>) {
    Object.assign(this, order);
  }
}
