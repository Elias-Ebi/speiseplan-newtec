import { Pipe, PipeTransform } from '@angular/core';
import { Temporal } from "@js-temporal/polyfill";

@Pipe({
  name: 'monthYearName',
  standalone: true
})
export class MonthYearNamePipe implements PipeTransform {

  transform(date: Temporal.PlainDate): string {
    return date.toLocaleString('default', {month: 'long'}) +'  ' +date.year.toString();
  }

}
