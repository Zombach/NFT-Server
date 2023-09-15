import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

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

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  country?: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
