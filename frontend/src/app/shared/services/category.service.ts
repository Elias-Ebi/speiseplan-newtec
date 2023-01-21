import { Injectable } from '@angular/core';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private meat = {
    id: '44c615e8-80e4-40c9-b026-70f96cd21dcd',
    name: 'Meat',
    icon: 'assets/food_icons/meat_icon.png'
  };
  private vegetarian = {
    id: '6f8b2947-4784-4c61-b973-705b314ef4f6',
    name: 'Vegetarian',
    icon: 'assets/food_icons/vegetarian_icon.png'
  };
  private vegan = {
    id: 'af03df2a-0d22-4e7d-8a12-9269ecd318af',
    name: 'Vegan',
    icon: 'assets/food_icons/vegan_icon.png'
  };
  private salad = {
    id: '85d77591-0b55-4df4-93b0-03c00bcb14b9',
    name: 'Salad',
    icon: 'assets/food_icons/salad_icon.png'
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

  getIconFromCategoryID(categoryID: string): string {
    const category = this.categoryMap.get(categoryID);
    return category?.icon || '';
  }
}
