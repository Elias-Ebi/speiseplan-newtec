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
    private dateService: DateService) {
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
    const lineHeight = 15;
    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    const title = 'Tagesübersicht  -  ' + day.toLocaleString();
    doc.text(title, indentationLeft, 50);
    doc.setDrawColor(86,86,86);
    doc.line(indentationLeft, 65, 415, 65);

    const text = 'An diesem Tag wurden folgende Bestellungen aufgegeben:';

    doc.setFontSize(fontSize);
    doc.text(text, indentationLeft, 80);

    const dayData = this.dataMap.get(day);
    let body: string[][] = []
    let tableCounter = 0;
    let finalY = 80;
    dayData?.forEach(d => {
      let body: string[][] = []
      let tableSum = 0;
        // fill table entries for current meal
        d.forEach((entry) => {
          let buyer = entry.guestName? (entry.guestName+ ' (Gast von ' +  entry.profile.name + ')') : entry.profile.name;
          body.push(['', buyer,  '' + entry.meal.total.toFixed(2) + ' €' ])
          // add sum row
          tableSum = tableSum + entry.meal.total;
          tableCounter ++;
        })

        var options = {
          didParseCell: function(data: any) {
            if (data.column.index === data.table.columns.length - 1) {
              data.cell.styles = { align: "right" };
            }

            if (data.cell.raw === 'Summe:   ') {
              data.cell.styles = { halign: "right" };
            }
          },
        };

        // draw table
        doc.autoTable({
          columnStyles: {
            0: {columnWidth: 120} as Partial<Styles>,
            1: {columnWidth: 200} as Partial<Styles>,
            2: {columnWidth: 50} as Partial<Styles>
          },
          theme: 'plain',
          startY: finalY + 50, //80 + (tableCounter * lineHeight),
          head: [[d[0].meal.name, 'Besteller', 'Preis' ]],
          body: body,
          foot: [['', 'Summe:   ', tableSum.toFixed(2) + ' €']],
          didParseCell: options.didParseCell
        })
        finalY = (doc as any).lastAutoTable.finalY;
    });

    this.openPrintDialog(doc);
  }

  public openPrintDialog(pdf: any): void {
    const blob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank', 'fullscreen=yes');
  }

}
