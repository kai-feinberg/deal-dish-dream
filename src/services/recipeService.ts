import { Recipe } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/64748b?text=Recipe+Image';

export const fetchUserRecipes = async (): Promise<Recipe[]> => {
  try {
    console.log('Fetching user recipes from Supabase...');
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, title, ingredients, instructions, cooking_time, difficulty_level, cuisine, deal_items, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recipes:', {
        error,
        message: error.message
      });
      throw error;
    }

    console.log(`Successfully fetched ${recipes.length} recipes`);

    // Transform the data to match our Recipe type
    return recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      difficultyLevel: recipe.difficulty_level,
      cuisine: recipe.cuisine,
      dealItems: recipe.deal_items,
      imageUrl: PLACEHOLDER_IMAGE,
      createdAt: recipe.created_at
    }));
  } catch (error) {
    console.error('Error in fetchUserRecipes:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    console.log(`Fetching recipe with id ${id}...`);
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('id, title, ingredients, instructions, cooking_time, difficulty_level, cuisine, deal_items, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`No recipe found with id ${id}`);
        return null;
      }
      console.error('Error fetching recipe:', {
        error,
        message: error.message
      });
      throw error;
    }

    if (!recipe) {
      return null;
    }

    console.log(`Successfully fetched recipe: ${recipe.title}`);

    // Transform the data to match our Recipe type
    return {
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      difficultyLevel: recipe.difficulty_level,
      cuisine: recipe.cuisine,
      dealItems: recipe.deal_items,
      imageUrl: PLACEHOLDER_IMAGE,
      createdAt: recipe.created_at
    };
  } catch (error) {
    console.error('Error in getRecipeById:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}; 