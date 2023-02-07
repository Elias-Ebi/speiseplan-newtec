import {Profile} from "./profile";
import {Order} from "./order";

export interface OrderMonth{
  id: string;
  profile: Profile;

  month: number;
  year: number;
  orders: Order[];
  total: number;
  paid: boolean;

}
