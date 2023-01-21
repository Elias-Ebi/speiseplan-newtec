import { Temporal } from '@js-temporal/polyfill';
import { Category } from './category';

export interface Meal {
  id: string;
  name: string;
  description: string;
  category: Category;
  total: number;
  date: string;
  orderCount: number;
}
