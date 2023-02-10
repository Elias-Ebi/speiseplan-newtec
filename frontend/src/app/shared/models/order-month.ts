import { Order } from "./order";
import { Profile } from "./profile";

export interface OrderMonth {
  id: string;
  profile: Profile;
  month: number;
  year: number;
  orders: Order[];
  total: number;
  paid: boolean;
}
