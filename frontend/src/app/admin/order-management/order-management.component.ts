import { Component, OnInit, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EuroPipe } from '../../shared/pipes/euro.pipe';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRange, MatDatepickerModule, } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { Order } from 'src/app/shared/models/order';
import { FullDatePipe } from '../../shared/pipes/full-date.pipe';
import { Temporal } from '@js-temporal/polyfill';
import {
  CancelMultipleOrdersDialogComponent
} from './cancel-mulitiple-orders-dialog/cancel-mulitiple-orders-dialog.component';
import { OrderManagementTextFilter } from "./order-management.models";
import { sortByDate } from "../../user/shared/utils";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    EuroPipe,
    FullDatePipe,
    WeekdayNamePipe,
    MonthNamePipe,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  temporal = Temporal;
  orders: Order[] = [];
  editMultipleOrders = false;
  checkedOrders: Order[] = [];
  useDateInterval = false;
  displayedColumns: string[] = [
    'date',
    'buyer',
    'meals',
    'guest',
    'action-single',
  ];
  dataSource = new MatTableDataSource<Order>(this.orders);
  filter = {
    buyerFilter: '',
    guestFilter: '',
    mealFilter: '',
    dateFilter: {
      startDate: '',
      endDate: '',
    },
  };
  selectedDate: Date | undefined;
  selectedDateRange: DateRange<Date> | undefined;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.orders = await this.getOrders();
    this.dataSource.data = this.orders;
    this.dataSource.paginator = this.paginator;
  }

  openCancelDialog(element: any) {
    let dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      data: element, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.orders = await this.getOrders();
      this.dataSource.data = this.orders;
      await this.filterData();
    });
  }

  openCancelMultipleDialog() {
    let dialogRef = this.dialog.open(CancelMultipleOrdersDialogComponent, {
      data: this.checkedOrders, autoFocus: false
    });
    dialogRef.afterClosed().subscribe(async () => {
      this.checkedOrders = [];
      this.orders = await this.getOrders();
      this.dataSource.data = this.orders;
      await this.filterData();
    });
  }

  async toggleFilter() {
    await this.drawer.toggle();
  }

  toggleEditMode() {
    this.editMultipleOrders = !this.editMultipleOrders;
    if (this.editMultipleOrders) {
      this.displayedColumns[this.displayedColumns.length - 1] = 'action-multiple';
    } else {
      this.displayedColumns[this.displayedColumns.length - 1] = 'action-single';
      this.checkedOrders = [];
    }
  }

  async toggleDateIntervalMode() {
    this.useDateInterval = !this.useDateInterval;
    await this.removeDateFilter();
  }

  async selectedChange(m: any) {
    if (!this.selectedDateRange?.start || this.selectedDateRange?.end) {
      this.selectedDateRange = new DateRange<Date>(m, null);
    } else {
      const start = this.selectedDateRange.start;
      const end = m;
      if (end < start) {
        this.selectedDateRange = new DateRange<Date>(end, start);
      } else {
        this.selectedDateRange = new DateRange<Date>(start, end);
      }
    }
    if (this.selectedDateRange.start && this.selectedDateRange.end) {
      this.filter.dateFilter.startDate = this.transformDate(this.selectedDateRange.start);
      this.filter.dateFilter.endDate = this.transformDate(this.selectedDateRange.end);
      await this.filterData();
    }
  }

  async filterOrdersByDate() {
    this.filter.dateFilter.startDate = this.transformDate(this.selectedDate);
    await this.filterData();
  }

  async removeDateFilter() {
    this.filter.dateFilter.startDate = '';
    this.filter.dateFilter.endDate = '';
    this.selectedDate = undefined;
    this.selectedDateRange = undefined;
    await this.filterData();
  }

  async filterData() {
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      const buyer = data.profile.name.toLowerCase();
      const guestName = data.guestName?.toLowerCase() || '';
      const mealName = data.meal.name.toLowerCase();
      const date = data.date;

      const filters = filter.split('|')
      const buyerFilter = filters[0].trim().toLowerCase();
      const guestNameFilter = filters[1].trim().toLowerCase();
      const mealNameFilter = filters[2].trim().toLowerCase();
      const startDateFilter = filters[3].trim();
      const endDateFilter = filters[4].trim();

      let dateFilter = true;
      if (!this.useDateInterval && startDateFilter) {
        const selectedDate = PlainDate.from(startDateFilter);
        const orderDate = PlainDate.from(date);
        dateFilter = orderDate.equals(selectedDate);
      } else if (this.useDateInterval && startDateFilter && endDateFilter) {
        const startDate = PlainDate.from(startDateFilter);
        const endDate = PlainDate.from(endDateFilter);
        const orderDate = PlainDate.from(date);
        dateFilter = PlainDate.compare(orderDate, startDate) !== -1 && PlainDate.compare(orderDate, endDate) !== 1;
      }

      const textFilter = buyer.indexOf(buyerFilter) != -1
        && guestName.indexOf(guestNameFilter) != -1
        && mealName.indexOf(mealNameFilter) != -1;

      return textFilter && dateFilter;
    }

    this.dataSource.filter = this.buildFilterString();
  }

  async removeFilter(value: OrderManagementTextFilter) {
    this.filter[value] = '';
    await this.filterData();
  }

  checkOrders(checked: boolean, target: Order) {
    if (checked) {
      this.checkedOrders.push(target);
    } else {
      this.checkedOrders = this.checkedOrders.filter((order) => order !== target);
    }
  }

  private async getOrders() {
    const orders = await this.apiService.getAllChangeableOrders();
    return orders.sort((a, b) => sortByDate(PlainDate.from(a.date), PlainDate.from(b.date)));
  }

  private transformDate(date?: Date): string {
    if (!date) return '';
    return PlainDate.from({day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()}).toString();
  }

  private buildFilterString() {
    return this.filter.buyerFilter + '|' + this.filter.guestFilter + '|' + this.filter.mealFilter + '|' + this.filter.dateFilter.startDate + '|' + this.filter.dateFilter.endDate;
  }
}
