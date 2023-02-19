import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { OrderService } from 'src/app/shared/services/order-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatButtonModule } from "@angular/material/button";
import { animate, style, transition, trigger } from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRange, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import * as _ from "lodash";
import { ApiService } from 'src/app/shared/services/api.service';
import { Order } from 'src/app/shared/models/order';
import { FullDatePipe } from "../../shared/pipes/full-date.pipe";
import { Temporal } from '@js-temporal/polyfill';
import { CancelMultipleOrdersDialogComponent } from './cancel-mulitiple-orders-dialog/cancel-mulitiple-orders-dialog.component';

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
    MatDialogModule
  ],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({height: '0'}),
        animate(250, style({height: '*'}))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        style({height: '*'}),
        animate(250, style({height: 0}))
      ])
    ])
  ]
})

export class OrderManagementComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() selectedRangeValue: DateRange<Date> | undefined;
  @Output() selectedRangeValueChange = new EventEmitter<DateRange<Date>>();
  temporal = Temporal
  orders: Order[] = []
  editMultipleOrders = false;
  checkedOrders: Order[] = []
  useDateInterval = false;
  isFilterOpen = false;

  displayedColumns: string[] = ['date', 'buyer', 'meals', 'guest', 'action-single'];
  dataSource = new MatTableDataSource<any>(this.orders);

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  filter = {
    buyerFilter: '',
    guestFilter: '',
    mealFilter: '',
    dateFilter: {
      startDate: '',
      endDate: ''
    }
  }

  selectedDate: any
  range = {
    start: '',
    end: ''
  }

  




  /*
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
*/

  constructor(
    private apiService: ApiService, 
    //protected orderService: OrderService,
    private dialog: MatDialog, 
    private dateAdapter: DateAdapter<any>
    ) {
      this.dateAdapter.setLocale('de');
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async ngOnInit(): Promise<void> {
    this.orders = await this.apiService.getOpenOrdersAdmin();

    this.updateTable();
    //this.orders = openOrders;
  }

  openCancelDialog(element: any) {
    let dialogRef = this.dialog.open(CancelOrderDialogComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(async result => {
      this.orders = await this.apiService.getOpenOrdersAdmin();
      this.updateTable();
    }
    )
  }

  openCancelMultipleDialog() {
    let dialogRef = this.dialog.open(CancelMultipleOrdersDialogComponent, {
      data: this.checkedOrders
    });
    dialogRef.afterClosed().subscribe(async result => {
      this.orders = await this.apiService.getOpenOrdersAdmin();
      this.updateTable();
      this.checkedOrders = [];
    }
    )
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    this.drawer.toggle()
  }

  toggleEditMode() {
    this.editMultipleOrders = !this.editMultipleOrders
    if (this.editMultipleOrders) {
      this.displayedColumns = ['date', 'buyer', 'meals', 'guest', 'action-multiple'];
    } else {
      this.displayedColumns = ['date', 'buyer', 'meals', 'guest', 'action-single'];
      this.checkedOrders = [];
    }
  }

  toggleDateIntervalMode() {
    this.useDateInterval = !this.useDateInterval;
  }

  async filterOrdersByMenu(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.mealFilter = filterValue;
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }

  async removeFilterMenu(){
    this.filter.mealFilter = '';
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }
  
  async filterOrdersByBuyer(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.buyerFilter = filterValue;
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }





  async selectedChange(m: any) {
    if (!this.selectedRangeValue?.start || this.selectedRangeValue?.end) {
        this.selectedRangeValue = new DateRange<Date>(m, null);
    } else {
        const start = this.selectedRangeValue.start;
        const end = m;
        if (end < start) {
            this.selectedRangeValue = new DateRange<Date>(end, start);
        } else {
            this.selectedRangeValue = new DateRange<Date>(start, end);
        }
    }
    if( this.selectedRangeValue.start && this.selectedRangeValue.end) {
      
      /*
      this.filter.buyerFilter = filterValue;
      let filteredOrders = await this.apiService.applyFilter(this.filter);
      this.orders = filteredOrders;
      */
      this.filter.dateFilter.startDate = this.setDateFormat(this.selectedRangeValue.start);
      this.filter.dateFilter.endDate = this.setDateFormat(this.selectedRangeValue.end);
      this.orders = await this.apiService.applyFilter(this.filter);


      this.updateTable();
      this.selectedRangeValueChange.emit(this.selectedRangeValue);
    }
}

setDateFormat(date: Date): string {
      let month = (date.getMonth()+1).toString().padStart(2, '0');
      let day = date.getDate().toString().padStart(2, '0');
      return date.getFullYear() + '-' + month + '-' + day
}




  async filterOrdersByDate(event: MatDatepickerInputEvent<any, any>) {
    this.selectedDate = event
    this.filter.dateFilter.startDate = this.setDateFormat(this.selectedDate);

    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();

  }

  async removeFilterDate() {
    this.filter.dateFilter.startDate = '';
    this.filter.dateFilter.endDate = '';
    this.selectedDate = null;
    this.selectedRangeValue = undefined
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }


  async removeFilterBuyer(){
    this.filter.buyerFilter = '';
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }

  async filterOrdersByGuest(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter.guestFilter = filterValue;
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }

  async removeFilterGuest(){
    this.filter.guestFilter = '';
    let filteredOrders = await this.apiService.applyFilter(this.filter);
    this.orders = filteredOrders;
    this.updateTable();
  }


  updateTable() {
    this.dataSource = new MatTableDataSource<any>(this.orders);
    this.dataSource.paginator = this.paginator;
  }


  /*
  // frontend-filter, not working correctly yet
  filterOrdersByMenu(event: Event) {
    this.dataSource.filterPredicate =
      (data: any, filter: string) => data.meals.indexOf(filter) != -1;

    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }

  filterOrdersByBuyer(event: Event) {
    this.dataSource.filterPredicate =
      (data: any, filter: string) => data.buyer.indexOf(filter) != -1;

    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }

  filterOrdersByGuest(event: Event) {
    this.dataSource.filterPredicate =
      (data: any, filter: string) => data.guest.indexOf(filter) != -1;

    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }

  filterOrdersByDate(event: MatDatepickerInputEvent<any>) {
    this.dataSource.filterPredicate =
      (data: any, filter: string) => data.date.indexOf(filter) != -1;
    const filterValue = event.value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }
  */

  checkOrders(checked: boolean, target: Order) {
    if(checked){
      this.checkedOrders.push(target)
    } else {
      let idx = this.checkedOrders.findIndex(x => x === target);
      this.checkedOrders.splice(idx, 1)
    }

  }
}
