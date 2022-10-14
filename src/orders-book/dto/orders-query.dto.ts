import { Exclude, Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Default } from '../../common/decorators/transform.decorator';

@Exclude()
export class OrdersQueryDto {
  @Expose()
  @IsString()
  @IsOptional()
  tokenA?: string;

  @Expose()
  @IsString()
  @IsOptional()
  tokenB?: string;

  @Expose()
  @IsString()
  @IsOptional()
  user?: string;

  @Expose()
  @IsBoolean()
  @Default(false)
  @Transform(({ value }) => value === 'true')
  isActive: boolean;
}
