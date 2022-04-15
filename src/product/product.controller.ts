import {
  CreateProductRequestDto,
  FindOneRequestDto,
  DecreaseStockRequestDto,
} from './product.dto';
import { ProductService } from './product.service';
import { Controller } from '@nestjs/common';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
} from './product.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'CreateProduct')
  private createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    return this.service.createProduct(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'FindOne')
  private findOne(payload: FindOneRequestDto): Promise<FindOneResponse> {
    return this.service.findOne(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'DecreaseStock')
  private decreaseStock(
    payload: DecreaseStockRequestDto,
  ): Promise<DecreaseStockResponse> {
    return this.service.decreaseStock(payload);
  }
}
