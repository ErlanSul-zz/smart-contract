import { Module } from '@nestjs/common';
import { OrdersBookService } from './orders-book.service';
import { OrdersBookController } from './orders-book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersBookEntity } from './orders-book.entity';

@Module({
  providers: [OrdersBookService],
  controllers: [OrdersBookController],
  imports: [TypeOrmModule.forFeature([OrdersBookEntity])],
})
export class OrdersBookModule {}
