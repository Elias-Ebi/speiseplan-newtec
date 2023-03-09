import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from 'src/app/shared/services/api.service';
import { DefaultValues } from 'src/app/shared/models/defaultvalues';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
  providers: [CurrencyPipe]
})
  export class AdminSettingsComponent implements OnInit {

    currentDefaultValues: DefaultValues | null;
    formattedTotal: any;
    maxLength = 3;

    constructor(private api: ApiService, private currencyPipe: CurrencyPipe) {
      this.currentDefaultValues = null;
    }

    async ngOnInit() {
      this.currentDefaultValues = await this.api.getDefaultValues();
    }

    transformTotal(total: any) {

      this.formattedTotal = this.currencyPipe.transform(this.formattedTotal, ' ');
      total.target.value = this.formattedTotal;
    }

    transform(total: any) {

      let totalValue = total.target.value;
      let totalValueString = total.target.value.toString();

      if(this.isFloat(totalValue)) {
        let parsedTotal = parseFloat(totalValue);
        console.log(parsedTotal.toFixed(2));
      } else if(totalValueString.length > 2) {
        if(!isNaN(totalValueString)) {
          const splitter = (index: number, str: string) => [str.slice(0, index), str.slice(index)];

          let splittedValue = splitter(totalValueString.length - 2, totalValueString);

          let value = splittedValue[0] + '.' + splittedValue[1];

          let valueFloat: number = Number.parseFloat(value);

          console.log(valueFloat);
        } else {
          let totalValueNormalized = "";
          for(let i = 0; i < totalValueString.length; i++) {
            if(!isNaN(totalValueString[i])) {
              totalValueNormalized += totalValueString[i];
            }
          }
          console.log(totalValueNormalized);
        }
      } else {

      }
    }

    isFloat(total: any) {
      let parsed = parseFloat(total);
      return ((typeof parsed==='number')&&(parsed%1!==0));
    }
}
