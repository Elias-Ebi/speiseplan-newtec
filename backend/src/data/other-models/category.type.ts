export interface Category {
  id: string;
  name: string;
  icon: string;
}

const meat = {
  id: '44c615e8-80e4-40c9-b026-70f96cd21dcd',
  name: 'Meat',
  icon: 'assets/food_icons/meat_icon.png'
};

const vegetarian = {
  id: '6f8b2947-4784-4c61-b973-705b314ef4f6',
  name: 'Vegetarian',
  icon: 'assets/food_icons/vegetarian_icon.png'
};

const vegan = {
  id: 'af03df2a-0d22-4e7d-8a12-9269ecd318af',
  name: 'Vegan',
  icon: 'assets/food_icons/vegan_icon.png'
};

const salad = {
  id: '85d77591-0b55-4df4-93b0-03c00bcb14b9',
  name: 'Salad',
  icon: 'assets/food_icons/salad_icon.png'
};


const categoryMap: Map<string, Category> = new Map<string, Category>([
  [meat.id, meat],
  [vegetarian.id, vegetarian],
  [vegan.id, vegan],
  [salad.id, salad]
]);

export function categoryExists(categoryId: string): boolean {
  return categoryMap.has(categoryId);
}
