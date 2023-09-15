import { Entity, Column, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('extraInformationCustomers')
export class ExtraInformationCustomer {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  company?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  country?: string;

  @OneToOne(() => Order, (order) => order.customerInformation)
  order: Order;
}
