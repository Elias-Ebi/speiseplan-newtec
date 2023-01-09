import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Order } from './order.entity';

@Entity()
export class OrderMonth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  month: number;

  @Column()
  year: number;

  @OneToMany(() => Order, (order) => order.orderMonth)
  orders: Order[];

  @Column()
  total: number;

  @Column()
  paid: boolean;
}
