import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meal } from './meal.entity';
import { OrderMonth } from './order-month.entity';
import { Profile } from './profile.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile)
  profile: Profile;

  @Column({ type: 'date' })
  date: string;

  @ManyToOne(() => OrderMonth, (orderMonth) => orderMonth.orders)
  orderMonth: OrderMonth;

  @ManyToOne(() => Meal)
  meal: Meal;

  @Column()
  guestName: string;

  @Column({ default: false })
  isBanditplate: boolean;
}
