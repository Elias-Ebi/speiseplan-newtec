import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import {Order} from 'src/app/shared/models/order';
import {DateService} from "../../shared/services/date.service";
import {ApiService} from "../../shared/services/api.service";
import {Profile} from "../../shared/models/profile";
import PlainDate = Temporal.PlainDate;
import {MatDialog} from "@angular/material/dialog";
import {OverviewInformDialogComponent} from "./overview-inform-dialog/overview-inform-dialog.component";
import {MatTreeModule} from "@angular/material/tree";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Styles, UserOptions } from 'jspdf-autotable';


interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => jsPDF;
}
import {MatListModule} from "@angular/material/list";
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, EuroPipe, WeekdayNamePipe, MatButtonModule, MatExpansionModule, MatTreeModule, MatListModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, Order[][]>();
  weekdays = this.dateService.getNextFiveWeekDays();


  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private dateService: DateService,
    private categoryService: CategoryService) {
  }

  async ngOnInit(): Promise<void> {
    this.weekdays = this.dateService.getNextFiveWeekDays();
    await this.loadWeek();
  }

  async loadWeek(): Promise<void> {
    const week = new Map<PlainDate, Order[]>();
    const requests = this.weekdays.map(day => this.apiService.getAllOrdersOnDate(day));
    const results = await Promise.all(requests);
    for (let i = 0; i < this.weekdays.length; i++) {
      week.set(this.weekdays[i], results[i]);
    }

    for (const day of this.weekdays) {
      const temp = week.get(day)!.reduce((acc, item) => {
        const group = item.meal.name;
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
      }, {} as { [key: string]: any[] });
      // is type [[order]], the orders inside the inner arrays have the same corresponding meal.name
      let mealgroups: Order[][] = Object.values(temp);
      this.dataMap.set(day, mealgroups);
    }
  }

  onClickInform(event: MouseEvent, mealOrders: Order[]) {
    //to prevent button-click expanding the expansion panel
    event.stopPropagation();
    const dialogRef = this.dialog.open(OverviewInformDialogComponent, {
      data: {
        meals: mealOrders
      }
    });

    dialogRef.afterClosed().subscribe(async (data: { sendMessage: boolean, selectedUsers: Order[] }) => {
      if (data.sendMessage) {
        try {
          const filteredOrders: string[] = data.selectedUsers.map((order: Order) => order.id);
          const ordersCanceled = await this.apiService.deleteMultipleOrdersByIdAndInform(filteredOrders);
          await this.loadWeek();
        } catch (error) {
        }
      }
    });

  }

  exportAsPDF(day: PlainDate) {
    const indentationLeft = 30;
    const fontSize = 10;
    const mediumfontSize = 11;
    const lineHeight = 15;
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    const title = 'Tagesübersicht  -  ' + day.toLocaleString();
    doc.setProperties({title: 'tagesuebersicht' + day.toString()})
    doc.text(title, indentationLeft, 50);
    doc.setDrawColor(86,86,86);
    doc.line(indentationLeft, 65, 415, 65);

    const text = 'An diesem Tag wurden folgende Bestellungen aufgegeben:';

    doc.setFontSize(fontSize);
    doc.text(text, indentationLeft, 80);

    const dayData = this.dataMap.get(day);
    let finalY = 80;
    let dishesByCategory: any[][] = [];
    const numberOfCategories = this.categoryService.getAllCategories().length

    for(let i = 0; i < numberOfCategories; i++){
      dishesByCategory.push([])
    }

    dayData?.forEach(d => {
      const currentCategory = this.categoryService.getCategory(d[0].meal.categoryId);
      if (currentCategory) {
        dishesByCategory[currentCategory.orderIndex].push(d)
      } else {
        throw new Error('Invalid category');
      }
    })
    
    // ----------------------- all dishes by category ----------------------- //
    dishesByCategory.forEach((category)=> { 
      if (category.length === 0) {
        // skip if there are no dishes in this category
        return;
      }
      doc.setFontSize(mediumfontSize);
      const categoryName = this.categoryService.getCategory((category[0][0].meal.categoryId))?.name;
      doc.text('Kategorie: ' + categoryName, indentationLeft, finalY + 25);
      doc.setDrawColor(192,192,192);
      doc.line(indentationLeft, finalY + 30, 415, finalY + 30);
      finalY = finalY + 10;
      // ----------------------- all dishes of one category ----------------------- //
      category.forEach((dish: Order[]) => { 

        let body: string[][] = []
        // fill table entries for current meal
        // ----------------------- all orders for on dish ----------------------- //
        dish.forEach((entry) => { 
          let buyer = entry.guestName? (entry.guestName+ ' (Gast von ' +  entry.profile.name + ')') : entry.profile.name;
          body.push(['', buyer,  '' ])
        })
        
        // draw table
        doc.autoTable({
          columnStyles: {
            0: {cellWidth: 150} as Partial<Styles>,
            1: {cellWidth: 150} as Partial<Styles>
          },
          theme: 'plain',
          startY: finalY + 20,
          head: [[dish[0].meal.name, 'Besteller' ]],
          body: body,
        })
        finalY = (doc as any).lastAutoTable.finalY;
      });
    })

    this.openPrintDialog(doc);
  }

  public openPrintDialog(pdf: jsPDFWithPlugin): void {
    const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank', 'fullscreen=yes');
  }

}
