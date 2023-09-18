import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  desc: string;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;

  @OneToMany(() => Product, (product) => product.collection)
  products: Product[];
}
