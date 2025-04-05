import { Recipe, DealItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const PLACEHOLDER_IMAGE = '/chef.webp';

interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dealItems: {
    name: string;
  }[];
}

export const generateRecipeFromImage = async (
  imageData: string,
  customPrompt?: string
): Promise<Recipe | null> => {
  try {
    const basePrompt = `Generate a recipe that features items on sale from this image, but feel free to include additional ingredients. The recipe should highlight the deal items while creating a complete, delicious dish. Keep instructions simple and avoid specific temperatures or cooking times - instead refer to package instructions where applicable.

For example:
- If there's chicken breast on sale, you might create a "Herb-Crusted Chicken Parmesan" that uses regular pantry items
- If there's bell peppers on sale, you could suggest a "Colorful Stir-Fry" that combines them with other vegetables and protein
- If there's pasta on sale, you might create a "Creamy Pasta Primavera" that showcases the pasta while adding fresh vegetables

Example response format:
{
  "title": "Herb-Crusted Chicken Parmesan",
  "ingredients": [
    "2 chicken breasts (on sale)",
    "1 cup breadcrumbs",
    "1/2 cup grated parmesan",
    "2 eggs",
    "1 tsp dried oregano",
    "1 tsp dried basil",
    "2 cups marinara sauce",
    "1 cup mozzarella cheese"
  ],
  "instructions": [
    "Season chicken according to preference",
    "Beat eggs in a shallow dish",
    "Mix breadcrumbs, parmesan, and herbs in another dish",
    "Dip chicken in eggs, then coat with breadcrumb mixture",
    "Cook chicken according to package instructions until golden and cooked through",
    "Top with marinara and mozzarella and heat until cheese melts"
  ],
  "cookingTime": 45,
  "difficultyLevel": "medium",
  "cuisine": "Italian",
  "dealItems": [
    { "name": "chicken breast" }
  ]
}

Another example:
{
  "title": "Colorful Mediterranean Pasta Salad",
  "ingredients": [
    "1 lb rotini pasta (on sale)",
    "2 bell peppers (on sale)",
    "1 cucumber",
    "1 cup cherry tomatoes",
    "1/2 red onion",
    "1 cup feta cheese",
    "1/2 cup olive oil",
    "3 tbsp red wine vinegar"
  ],
  "instructions": [
    "Cook pasta according to package directions",
    "While pasta cooks, dice peppers, cucumber, tomatoes, and onion",
    "Whisk together olive oil and vinegar for dressing",
    "Drain pasta and let cool slightly",
    "Combine all ingredients in a large bowl",
    "Crumble feta cheese on top and toss gently",
    "Chill before serving"
  ],
  "cookingTime": 30,
  "difficultyLevel": "easy",
  "cuisine": "Mediterranean",
  "dealItems": [
    { "name": "rotini pasta" },
    { "name": "bell peppers" }
  ]
}`;
    
    const prompt = customPrompt 
      ? `${basePrompt} ${customPrompt}` 
      : basePrompt;

    console.log("Generating recipe with OpenRouter API...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant that creates recipes based on grocery deal images. Return only JSON with no explanations or other text. Include dealItems array with just the name of each item identified as being on sale in the image.

Example response format:
{
  "title": "Herb-Crusted Chicken Parmesan",
  "ingredients": [
    "2 chicken breasts (on sale)",
    "1 cup breadcrumbs",
    "1/2 cup grated parmesan",
    "2 eggs",
    "1 tsp dried oregano",
    "1 tsp dried basil",
    "2 cups marinara sauce",
    "1 cup mozzarella cheese"
  ],
  "instructions": [
    "Season chicken according to preference",
    "Beat eggs in a shallow dish",
    "Mix breadcrumbs, parmesan, and herbs in another dish",
    "Dip chicken in eggs, then coat with breadcrumb mixture",
    "Cook chicken according to package instructions until golden and cooked through",
    "Top with marinara and mozzarella and heat until cheese melts"
  ],
  "cookingTime": 45,
  "difficultyLevel": "medium",
  "cuisine": "Italian",
  "dealItems": [
    { "name": "chicken breast" }
  ]
}

Another example:
{
  "title": "Colorful Mediterranean Pasta Salad",
  "ingredients": [
    "1 lb rotini pasta (on sale)",
    "2 bell peppers (on sale)",
    "1 cucumber",
    "1 cup cherry tomatoes",
    "1/2 red onion",
    "1 cup feta cheese",
    "1/2 cup olive oil",
    "3 tbsp red wine vinegar"
  ],
  "instructions": [
    "Cook pasta according to package directions",
    "While pasta cooks, dice peppers, cucumber, tomatoes, and onion",
    "Whisk together olive oil and vinegar for dressing",
    "Drain pasta and let cool slightly",
    "Combine all ingredients in a large bowl",
    "Crumble feta cheese on top and toss gently",
    "Chill before serving"
  ],
  "cookingTime": 30,
  "difficultyLevel": "easy",
  "cuisine": "Mediterranean",
  "dealItems": [
    { "name": "rotini pasta" },
    { "name": "bell peppers" }
  ]
}`
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageData } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to generate recipe: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenRouter API response received:", {
      status: response.status,
      model: data.model,
      responseLength: JSON.stringify(data).length
    });
    
    let recipeData: RecipeResponse;
    try {
      recipeData = JSON.parse(data.choices[0].message.content) as RecipeResponse;
    } catch (error) {
      console.error("Error parsing recipe data:", {
        error,
        rawContent: data.choices[0].message.content,
        contentType: typeof data.choices[0].message.content
      });
      throw new Error("Failed to parse recipe data");
    }
    
    // Ensure dealItems exists or provide a default empty array
    const dealItems = recipeData.dealItems || [];

    const recipe = {
      id: crypto.randomUUID(),
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      cookingTime: recipeData.cookingTime,
      difficultyLevel: recipeData.difficultyLevel,
      cuisine: recipeData.cuisine,
      dealItems: dealItems.map(item => ({ name: item.name })),
      createdAt: new Date().toISOString()
    };

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to store recipes');
    }

    // Create the recipe object that exactly matches the database schema
    const recipeToStore = {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cooking_time: recipe.cookingTime,
      difficulty_level: recipe.difficultyLevel,
      cuisine: recipe.cuisine,
      deal_items: recipe.dealItems,
      user_id: user.id
      // Note: created_at will be set by the database default
    };

    // Store the recipe in Supabase
    const { data: storedRecipe, error } = await supabase
      .from('recipes')
      .insert(recipeToStore)
      .select('id, title, ingredients, instructions, cooking_time, difficulty_level, cuisine, deal_items, created_at')
      .single();

    if (error) {
      console.error('Error storing recipe in Supabase:', {
        error,
        recipe: recipeToStore
      });
      throw new Error('Failed to store recipe');
    }

    console.log('Successfully stored recipe in Supabase:', {
      id: storedRecipe.id,
      title: storedRecipe.title
    });

    // Return the recipe with our application's structure
    return {
      id: storedRecipe.id,
      title: storedRecipe.title,
      ingredients: storedRecipe.ingredients,
      instructions: storedRecipe.instructions,
      cookingTime: storedRecipe.cooking_time,
      difficultyLevel: storedRecipe.difficulty_level as 'easy' | 'medium' | 'hard',
      cuisine: storedRecipe.cuisine,
      dealItems: storedRecipe.deal_items,
      imageUrl: PLACEHOLDER_IMAGE,
      createdAt: storedRecipe.created_at
    };
  } catch (error) {
    console.error("Error in recipe generation:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return null;
  }
};
