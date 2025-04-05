
export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: string[];
}

export interface DealItem {
  name: string;
  price: number;
  originalPrice?: number;
  store?: string;
  category?: string;
  unit?: string;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  cuisine: string;
  savings: number;
  dealItems: DealItem[];
  imageUrl?: string;
  createdAt: string;
}
