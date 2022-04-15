import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class StockDecreaseLogs extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  /**
   * Relation IDs
   */

  @Column({ type: 'integer' })
  public orderId!: number;

  /**
   * Many-To-One Relationship
   */

  @ManyToOne(() => Product, (product) => product.stockDecreaseLogs)
  public product: Product;
}
