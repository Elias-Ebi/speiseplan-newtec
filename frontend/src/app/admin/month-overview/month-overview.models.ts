import { Profile } from "../../shared/models/profile";
import { Order } from "../../shared/models/order";
import { Temporal } from "@js-temporal/polyfill";
import { MatTableDataSource } from "@angular/material/table";
import { OrderMonth } from "../../shared/models/order-month";
import PlainYearMonth = Temporal.PlainYearMonth;

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

export interface MonthOverviewMonth {
  yearMonth: PlainYearMonth;
  orderMonths: MonthOverviewOrderMonth[];
  dataSource: MatTableDataSource<OrderMonth>;
  searchTerm: string;
}
