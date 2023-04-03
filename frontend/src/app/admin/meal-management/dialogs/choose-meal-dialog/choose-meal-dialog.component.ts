import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MealTemplate } from 'src/app/shared/models/meal-template';
import { ApiService } from 'src/app/shared/services/api.service';
import {
  Category,
  CategoryService,
} from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-choose-dish-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './choose-meal-dialog.component.html',
  styleUrls: ['./choose-meal-dialog.component.scss'],
})
export class ChooseMealDialogComponent implements OnInit {
  displayedData: string[] = ['title', 'description', 'category', 'action'];
  dataSource: MatTableDataSource<MealTemplate>;
  dishes: MealTemplate[];

  clickedRows = new Set<MealTemplate>();

  categories: Category[];

  MAX_DESC_LENGTH = 100;
  MAX_MEAL_LENGTH = 20;

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { name: string; description: string; categoryId: string },
    private matDialogRef: MatDialogRef<ChooseMealDialogComponent>,
    private api: ApiService,
    private categoryService: CategoryService
  ) {
    this.dishes = [];
    this.categories = this.categoryService.getAllCategories();
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit() {
    this.dishes = await this.api.getMealTemplate();
    this.dataSource = new MatTableDataSource(this.dishes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCategoryName(id: string): string | undefined {
    return this.categoryService.getCategory(id)?.name;
  }

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: any) {
    const filterValue = event.value;

    if (!event.value) {
      this.dataSource.filter = '';
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickCancel() {
    this.matDialogRef.close();
  }

  onClickApply(clicked: Set<MealTemplate>) {
    let mealTemplate: MealTemplate = clicked.keys().next().value;
    this.matDialogRef.close(mealTemplate);
  }

  selectRow(row: any) {
    if (this.clickedRows.has(row)) {
      this.clickedRows.clear();
    } else if (this.clickedRows.size === 0) {
      this.clickedRows.add(row);
    } else {
      this.clickedRows.clear();
      this.clickedRows.add(row);
    }
  }

  async onClickDelete(row: any) {
    await this.api.deleteMealTemplate(row.id);
    this.dishes = await this.api.getMealTemplate();
    this.dataSource = new MatTableDataSource(this.dishes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  minimalize(description: string, max_length: number): string {
    return description.length > max_length
      ? description.substring(0, max_length - 4) + ' ...'
      : description;
  }

  extend(description: string, max_length: number): string {
    let normalizedDescription = '';
    if (description.length > max_length) {
      if (description.includes(" ")) {
        normalizedDescription = description.replace(" ", "\n");
      } else {
        for (let i = 0; i < description.length; i++) {
          if (i % max_length === 0 && i != 0) {
            normalizedDescription += description[i] + "\n";
          } else {
            normalizedDescription += description[i];
          }
        }
      }
    } else {
      normalizedDescription = description;
    }
    return normalizedDescription;
  }

  toggleShowMore(element: any): boolean {
    return (element.showMore = !element.showMore);
  }
}
