import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Recipe } from '@/types';
import { fetchUserRecipes } from '@/services/recipeService';

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  addRecipes: (newRecipes: Recipe[]) => void;
  clearRecipes: () => void;
  isLoading: boolean;
  error: string | null;
  refetchRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedRecipes = await fetchUserRecipes();
      setRecipes(fetchedRecipes);
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => [recipe, ...prevRecipes]);
  };

  const addRecipes = (newRecipes: Recipe[]) => {
    setRecipes(prevRecipes => [...newRecipes, ...prevRecipes]);
  };

  const clearRecipes = () => {
    setRecipes([]);
  };

  const refetchRecipes = async () => {
    await fetchRecipes();
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        addRecipe,
        addRecipes,
        clearRecipes,
        isLoading,
        error,
        refetchRecipes
      }}
    >
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
