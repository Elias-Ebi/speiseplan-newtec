import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { OrderService } from 'src/app/shared/services/order-service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import {MatListModule} from '@angular/material/list'; 
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator'; 
import { MatTableModule } from '@angular/material/table'  
import {MatTableDataSource} from '@angular/material/table';
import { MatButtonModule } from "@angular/material/button";
import { trigger, style, animate, transition } from '@angular/animations';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav'; 
import {MatInputModule} from '@angular/material/input'; 
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatNativeDateModule} from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditOrderDialogComponent } from './edit-order-dialog/edit-order-dialog.component';
import { CancelOrderDialogComponent } from './cancel-order-dialog/cancel-order-dialog.component';
import * as _ from "lodash";

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    EuroPipe, 
    WeekdayNamePipe, 
    MatTabsModule, 
    MonthNamePipe, 
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
      style({ height: '0' }),
        animate(250, style({ height: '*' }))
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
      style({ height: '*' }),
      animate(250, style({ height: 0 }))
      ])
    ])
  ]
})

export class OrderManagementComponent {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  editMultipleOrders = false;
  useDateInterval = false;
  isFilterOpen = false;
  
  displayedColumns: string[] = ['date', 'buyer', 'meals', 'guest', 'action-single'];
  dataSource = new MatTableDataSource<any>(this.orderService.orders);

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  buyerFilter = '';
  guestFilter = '';
  mealFilter = '';

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  
  
  constructor(protected orderService: OrderService, private dialog: MatDialog) {
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openEditDialog(element: any) {
    let orderToEdit = _.cloneDeep(element)
    orderToEdit.date = orderToEdit.date.toString();
    this.dialog.open(EditOrderDialogComponent, {
      data: orderToEdit
    });
  }

  openCancelDialog(element: any) {
    this.dialog.open(CancelOrderDialogComponent, {
      data: element
    });
  }

  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    this.drawer.toggle()
  }

  toggleEditMode(){
    this.editMultipleOrders = !this.editMultipleOrders
    if(this.editMultipleOrders) {
      this.displayedColumns = ['date', 'buyer', 'meals', 'guest', 'action-multiple']; 
    } else {
      this.displayedColumns = ['date', 'buyer', 'meals', 'guest', 'action-single']; 
    }
  }

  toggleDateIntervalMode() {
    this.useDateInterval = !this.useDateInterval;
  }

  filterOrdersByMenu(event: Event){
    this.dataSource.filterPredicate = 
    (data: any, filter: string) => data.meals.indexOf(filter) != -1;
    
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }

  filterOrdersByBuyer(event: Event){
    this.dataSource.filterPredicate = 
    (data: any, filter: string) => data.buyer.indexOf(filter) != -1;
    
    const filterValue = (event.target as HTMLInputElement).value;
    console.log('filtervalue ', filterValue)
    this.dataSource.filter = filterValue;
  }

  filterOrdersByGuest(event: Event){
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
}
