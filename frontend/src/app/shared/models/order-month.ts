import { Order } from './order';
import { User } from './user';

export interface OrderMonth {
  id: string;
  total: number;
  user: User;
  month: number;
  orders: Order[];
  isPaid: boolean;
}
