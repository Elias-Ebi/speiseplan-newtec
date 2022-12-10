import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from "@angular/common";

@Pipe({
  name: 'euro',
  standalone: true
})
export class EuroPipe implements PipeTransform {
  transform(value: number): string | null {
    return formatCurrency(
      value,
      'de-DE',
      getCurrencySymbol('EUR', 'wide'),
      'EUR',
      '.2-2',
    );
  }

}
