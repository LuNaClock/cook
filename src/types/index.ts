export type Category = 'main' | 'side' | 'soup' | 'other';
export type MainSubCategory = 'noodles' | 'rice' | 'donburi' | 'meat' | 'fish' | 'other';
export type Unit = 'small' | 'large' | 'gram' | 'liter' | 'pinch' | 'appropriate' | 'none' | 'piece';

export interface Ingredient {
  name: string;
  amount: string;
  unit: Unit;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  notes: string;
  category: Category;
  subCategory?: MainSubCategory;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}