import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Collection } from './collection.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column()
  img: string;

  @ManyToOne(() => Collection, (collection) => collection.products, {
    nullable: false,
  })
  collection: Collection;

  @ManyToOne(() => User, (user) => user.collections)
  user: User;
}
