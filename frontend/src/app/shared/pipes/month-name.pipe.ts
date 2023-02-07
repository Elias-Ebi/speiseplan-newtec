import { Pipe, PipeTransform } from '@angular/core';
import { Temporal } from "@js-temporal/polyfill";

@Pipe({
  name: 'monthName',
  standalone: true
})
export class MonthNamePipe implements PipeTransform {

  transform(date: Temporal.PlainDate): string {
    return date.toLocaleString('default', {month: 'long'}) +'  ' +date.year.toString();
  }

}
