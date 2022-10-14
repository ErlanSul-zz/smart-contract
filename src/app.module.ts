import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { OrdersBookModule } from './orders-book/orders-book.module';
import { EthersModule, GOERLI_NETWORK } from 'nestjs-ethers';
import { OrdersBookEntity } from './orders-book/orders-book.entity';

export const configService = new ConfigService('conf-local.env');

@Module({
  imports: [
    EthersModule.forRoot({
      network: GOERLI_NETWORK,
      infura: {
        projectId: configService.infuraId,
        projectSecret: configService.infuraSecret,
      },
      useDefaultProvider: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      name: configService.databaseConnectionName,
      host: configService.databaseHost,
      port: configService.databasePort,
      username: configService.databaseUser,
      password: configService.databasePassword,
      database: configService.databaseName,
      synchronize: configService.databaseSynchronize,
      logging: configService.databaseLogging,
      extra: {
        connectionTimeoutMillis: configService.databaseConnectionTimeout,
        idleTimeoutMillis: 2000,
        max: 10,
      },
      entities: [OrdersBookEntity],
    }),
    OrdersBookModule,
  ],
  controllers: [],
})
export class AppModule {}
