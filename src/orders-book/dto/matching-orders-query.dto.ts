import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class MatchingOrdersQueryDto {
  @Expose()
  @IsString()
  tokenA: string;

  @Expose()
  @IsString()
  tokenB: string;

  @Expose()
  @IsString()
  amountA: string;

  @Expose()
  @IsString()
  amountB: string;
}
