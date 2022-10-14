import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsString, IsNumber } from 'class-validator';

@Exclude()
export class OrdersBookDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  transactionId: string;

  @Expose()
  @IsString()
  user: string;

  @Expose()
  @IsString()
  tokenA: string;

  @Expose()
  @IsString()
  tokenB: string;

  @Expose()
  amountA: string;

  @Expose()
  amountB: string;

  @Expose()
  amountLeftToFill: string;

  @Expose()
  @IsBoolean()
  isMarket: boolean;

  @Expose()
  @IsNumber()
  blockNumber: number;

  @Expose()
  @IsBoolean()
  isActive: boolean;
}
