import { Injectable } from '@angular/core';

export interface Category {
  id: string;
  name: string;
  label: string;
  icon: string;
  orderIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private meat = {
    id: '44c615e8-80e4-40c9-b026-70f96cd21dcd',
    name: 'Meat',
    label: 'Fleisch',
    icon: 'assets/food_icons/meat_icon.png',
    orderIndex: 0
  };
  private vegetarian = {
    id: '6f8b2947-4784-4c61-b973-705b314ef4f6',
    name: 'Vegetarian',
    label: 'Vegetarisch',
    icon: 'assets/food_icons/vegetarian_icon.png',
    orderIndex: 1
  };
  private vegan = {
    id: 'af03df2a-0d22-4e7d-8a12-9269ecd318af',
    name: 'Vegan',
    label: 'Vegan',
    icon: 'assets/food_icons/vegan_icon.png',
    orderIndex: 2
  };
  private salad = {
    id: '85d77591-0b55-4df4-93b0-03c00bcb14b9',
    name: 'Salad',
    label:'Salat',
    icon: 'assets/food_icons/salad_icon.png',
    orderIndex: 3
  };

  private categoryMap: Map<string, Category>;

  constructor() {
    this.categoryMap = new Map<string, Category>([
      [this.meat.id, this.meat],
      [this.vegetarian.id, this.vegetarian],
      [this.vegan.id, this.vegan],
      [this.salad.id, this.salad]
    ]);
  }

  getCategory(categoryID: string): Category | undefined {
    return this.categoryMap.get(categoryID);
  }

  getAllCategories(): Category[] {
    return [this.meat, this.vegetarian, this.vegan, this.salad];
  }
}
