
import {Profile} from "../entitites/profile.entity";
import {Order} from "../entitites/order.entity";

export interface MonthOverviewOrderMonth {
  id: string;
  profile: Profile;
  yearMonth: string;
  month: number;
  year: number;
  orders: Order[];
  total: number;
  paid: boolean;
}


