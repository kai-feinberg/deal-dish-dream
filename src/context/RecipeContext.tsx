
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Recipe } from '@/types';
import { mockRecipes } from '@/data/mockRecipes';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  addRecipes: (newRecipes: Recipe[]) => void;
  clearRecipes: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => [recipe, ...prevRecipes]);
  };

  const addRecipes = (newRecipes: Recipe[]) => {
    setRecipes(prevRecipes => [...newRecipes, ...prevRecipes]);
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, addRecipes, clearRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
