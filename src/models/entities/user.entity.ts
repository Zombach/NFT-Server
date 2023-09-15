import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Collection } from './collection.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ length: 128 })
  name: string;

  @Column()
  @Unique('UNIQUE_EMAIL', ['email'])
  email: string;

  @Column()
  address?: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  description?: string;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
