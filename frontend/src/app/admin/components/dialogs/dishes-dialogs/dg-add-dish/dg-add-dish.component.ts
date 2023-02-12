import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/shared/services/api.service';
import { MealTemplate } from 'src/app/shared/models/mealtemplate';

interface Category {
  value: string;
  view: string;
}

@Component({
  selector: 'app-dg-add-dish',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dg-add-dish.component.html',
  styleUrls: ['./dg-add-dish.component.scss'],
})
export class DgAddDishComponent {
  MAX_LENGTH: number = 70;

  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { name: string; description: string; categoryId: string },
    private matDialogRef: MatDialogRef<DgAddDishComponent>,
    private api: ApiService
  ) {}

  getCategoryView(val: string): string | any {
    let result: string = '';

    this.categories.forEach((c) => {
      if (c.value === val) {
        result = c.view;
      }
    });
    return result;
  }

  getCategoryValue(view: string): string | any {
    let result: string = '';

    this.categories.forEach((c) => {
      if (c.view === view) {
        result = c.value;
      }
    });
    return result;
  }

  onClickCancel() {
    this.matDialogRef.close();
  }

  onClickCreate() {
    let mealTemplate: MealTemplate = {
      name: this.data.name,
      description: this.data.description,
      categoryId: this.data.categoryId,
    };
    this.api.putMealTemplate(mealTemplate);
    this.matDialogRef.close(this.data);
  }
}
