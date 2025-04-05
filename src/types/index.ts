export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: string[];
}

export interface DealItem {
  name: string;
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
  dealItems: DealItem[];
  imageUrl?: string;
  createdAt: string;
}
