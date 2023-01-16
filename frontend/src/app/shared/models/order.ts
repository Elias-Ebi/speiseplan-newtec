import { Temporal } from '@js-temporal/polyfill';
import { User } from './user';

export interface Order {
  id: string;
  total: number;
  user: User;
  date: Temporal.PlainDate;
  isGuestOrder: boolean;
  guestName: string | undefined;
  isOrderOffered: boolean;
}
