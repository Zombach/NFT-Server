import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ExtraInformationCustomer } from './extraInformationCustomer.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'numeric' })
  totalAmount: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToOne(() => ExtraInformationCustomer, (customer) => customer.order)
  customerInformation?: ExtraInformationCustomer;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
