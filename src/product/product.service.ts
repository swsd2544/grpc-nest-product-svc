import { PrismaService } from './prisma.service';
import {
  FindOneRequestDto,
  CreateProductRequestDto,
  DecreaseStockRequestDto,
} from './product.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
} from './product.pb';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  public async findOne({ id }: FindOneRequestDto): Promise<FindOneResponse> {
    const product: Product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return {
        data: null,
        error: ['Product not found'],
        status: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: { ...product, price: Number(product.price) },
      error: null,
      status: HttpStatus.OK,
    };
  }

  public async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    const product: Product = await this.prisma.product.create({
      data: { ...payload },
    });

    return { id: product.id, error: null, status: HttpStatus.OK };
  }

  public async decreaseStock({
    id,
    orderId,
  }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    const product = await this.prisma.product.findUnique({
      select: { id: true, stock: true },
      where: { id },
    });

    if (!product) {
      return { error: ['Product not found'], status: HttpStatus.NOT_FOUND };
    } else if (product.stock <= 0) {
      return { error: ['Stock too low'], status: HttpStatus.CONFLICT };
    }

    const isAlreadyDecreased: number = await this.prisma.stockDecreaseLog.count(
      {
        where: { orderId },
      },
    );

    if (isAlreadyDecreased) {
      // Idempotence
      return {
        error: ['Stock already decreased'],
        status: HttpStatus.CONFLICT,
      };
    }

    await this.prisma.product.update({
      where: { id: product.id },
      data: { stock: product.stock - 1 },
    });
    await this.prisma.stockDecreaseLog.create({
      data: { orderId, productId: product.id },
    });

    return { error: null, status: HttpStatus.OK };
  }
}
