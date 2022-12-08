import { Pipe, PipeTransform } from '@angular/core';
import { Temporal } from "@js-temporal/polyfill";

@Pipe({
  name: 'weekdayName',
  standalone: true
})
export class WeekdayNamePipe implements PipeTransform {

  transform(date: Temporal.PlainDate): string {
    return date.toLocaleString('default', {weekday: 'long'});
  }

}
