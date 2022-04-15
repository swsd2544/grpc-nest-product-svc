import { StockDecreaseLogs } from './entity/stock-decrease-log.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Product } from './entity/product.entity';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StockDecreaseLogs])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
