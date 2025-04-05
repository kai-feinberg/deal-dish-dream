
import { OPENROUTER_API_KEY } from '@/lib/openrouter';
import { Recipe, DealItem } from '@/types';

interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  cuisine: string;
  dealItems: {
    name: string;
    price: number;
    originalPrice: number;
  }[];
}

export const generateRecipeFromImage = async (
  imageData: string,
  customPrompt?: string
): Promise<Recipe | null> => {
  try {
    const basePrompt = "Generate a recipe based on the deals in this image. Identify grocery items on sale and create a recipe.";
    const prompt = customPrompt 
      ? `${basePrompt} ${customPrompt}` 
      : basePrompt;

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
            content: "You are a helpful assistant that creates recipes based on grocery deal images. Return only JSON with no explanations or other text. Always include dealItems array with name, price, and originalPrice for each item identified in the image."
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
      console.error("OpenRouter API error:", errorText);
      throw new Error("Failed to generate recipe");
    }

    const data = await response.json();
    console.log("OpenRouter API response:", data);
    
    let recipeData: RecipeResponse;
    try {
      recipeData = JSON.parse(data.choices[0].message.content) as RecipeResponse;
    } catch (error) {
      console.error("Error parsing recipe data:", error);
      console.log("Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse recipe data");
    }
    
    // Ensure dealItems exists or provide a default empty array
    const dealItems = recipeData.dealItems || [];
    
    // Calculate total savings
    const savings = dealItems.reduce(
      (total, item) => total + (item.originalPrice - item.price),
      0
    );

    return {
      id: crypto.randomUUID(),
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      cookingTime: recipeData.cookingTime,
      difficultyLevel: recipeData.difficultyLevel,
      cuisine: recipeData.cuisine,
      savings,
      dealItems,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error generating recipe:", error);
    return null;
  }
};
