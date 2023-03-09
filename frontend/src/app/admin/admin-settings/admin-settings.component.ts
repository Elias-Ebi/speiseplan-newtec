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

    constructor(private api: ApiService, private currencyPipe: CurrencyPipe) {
      this.currentDefaultValues = null;
    }

    async ngOnInit() {
      this.currentDefaultValues = await this.api.getDefaultValues();
    }

    transformTotal(total: any) {
      try {

        this.formattedTotal = this.currencyPipe.transform(this.formattedTotal, '$');
      } catch(error) {
        this.formattedTotal = '';
      }
      total.target.value = this.formattedTotal;
    }
}
