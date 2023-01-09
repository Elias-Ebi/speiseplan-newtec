import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Temporal } from '@js-temporal/polyfill';
import { Meal } from './meal.entity';
import { OrderMonth } from './order-month.entity';
import PlainDate = Temporal.PlainDate;

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  date: PlainDate;

  @ManyToOne(() => OrderMonth)
  orderMonth: OrderMonth;

  @ManyToOne(() => Meal)
  meal: Meal;

  @Column()
  guestName: string;

  @Column()
  total: number;

  @Column()
  isBanditplate: boolean;
}
