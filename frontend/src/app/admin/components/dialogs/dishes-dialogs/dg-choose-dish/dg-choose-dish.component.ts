import {
  Component,
  ViewChild,
  AfterViewInit,
  Inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DgAddDishComponent } from '../dg-add-dish/dg-add-dish.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MealTemplate } from 'src/app/shared/models/mealtemplate';
import { ApiService } from 'src/app/shared/services/api.service';

interface Category {
  value: string;
  view: string;
}

@Component({
  selector: 'app-dg-choose-dish',
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
  templateUrl: './dg-choose-dish.component.html',
  styleUrls: ['./dg-choose-dish.component.scss'],
})
export class DgChooseDishComponent implements AfterViewInit, OnInit {
  displayedData: string[] = ['title', 'description', 'category', 'action'];
  dataSource: MatTableDataSource<MealTemplate>;
  dishes: MealTemplate[];

  clickedRows = new Set<MealTemplate>();

  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { name: string; description: string; categoryId: string },
    private matDialogRef: MatDialogRef<DgChooseDishComponent>,
    public dialog: MatDialog,
    private api: ApiService
  ) {
    this.dishes = [];
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit() {
    this.dishes = await this.api.getMealTemplate();
    this.dataSource = new MatTableDataSource(this.dishes);
    this.dataSource.paginator = this.paginator;
  }

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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

    if(!event.value) {
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

  async onClickDelete(row: any) {
    await this.api.deleteMealTemplate(row.id);
    this.dishes = await this.api.getMealTemplate();
    this.dataSource = new MatTableDataSource(this.dishes);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
