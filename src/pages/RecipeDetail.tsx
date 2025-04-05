import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, ChefHat, DollarSign, Share2, Printer, Heart, RefreshCcw } from 'lucide-react';
import { getRecipeById } from '@/services/recipeService';
import { Recipe } from '@/types';

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  const fetchRecipe = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const fetchedRecipe = await getRecipeById(id);

      if (!fetchedRecipe) {
        setError('Recipe not found');
        return;
      }

      setRecipe(fetchedRecipe);
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Failed to load recipe. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <ChefHat className="h-12 w-12 animate-pulse mb-4" />
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link to="/recipes" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
          <p className="text-red-500 mb-4">{error || 'Recipe not found'}</p>
          {error && (
            <Button onClick={fetchRecipe} variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleShareClick = () => {
    // In a real app, this would use the Web Share API if available
    toast({
      title: "Share feature",
      description: "Recipe sharing functionality would be implemented here.",
    });
  };

  const handlePrintClick = () => {
    // In a real app, this would open the print dialog
    toast({
      title: "Print feature",
      description: "Recipe printing functionality would be implemented here.",
    });
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Recipe removed from your favorites" : "Recipe added to your favorites",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 pb-16">
      <div className="mb-6">
        <Link to="/recipes" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="aspect-video bg-muted rounded-lg mb-6 relative flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-muted-foreground opacity-50" />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(recipe.difficultyLevel)}`}>
              {recipe.difficultyLevel.charAt(0).toUpperCase() + recipe.difficultyLevel.slice(1)}
            </span>
            <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {recipe.cuisine}
            </span>
            <div className="flex items-center text-muted-foreground ml-auto">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{recipe.cookingTime} mins</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

          <div className="flex items-center text-recipe-orange mb-6">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="font-medium text-lg">{recipe.dealItems.length} items on sale</span>
          </div>

          <div className="flex space-x-3 mb-8">
            <Button variant="outline" size="sm" onClick={handleShareClick}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintClick}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFavoriteClick}
              className={isFavorite ? "bg-recipe-peach text-recipe-orange border-recipe-orange" : ""}
            >
              <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-recipe-orange" : ""}`} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
          </div>

          <Tabs defaultValue="ingredients">
            <TabsList className="w-full">
              <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions" className="flex-1">Instructions</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="pt-6">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  // Check if this ingredient contains any of the deal items
                  const isDealItem = recipe.dealItems.some(dealItem =>
                    ingredient.toLowerCase().includes(dealItem.name.toLowerCase())
                  );

                  return (
                    <li
                      key={index}
                      className={`flex items-start ${isDealItem ? 'text-recipe-orange font-medium' : ''}`}
                    >
                      <span className={`inline-block h-2 w-2 rounded-full mt-2 mr-3 ${isDealItem ? 'bg-recipe-orange' : 'bg-muted-foreground'
                        }`}></span>
                      {ingredient}
                      {isDealItem && (
                        <span className="ml-2 text-xs bg-recipe-orange/10 px-2 py-0.5 rounded text-recipe-orange">
                          On Sale
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </TabsContent>

            <TabsContent value="instructions" className="pt-6">
              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-recipe-orange text-white font-medium mr-3 shrink-0">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-1/3">
          <Card className="p-5">
            <h3 className="font-semibold text-lg mb-4">Deal Items Used</h3>

            <div className="space-y-3 mb-6">
              {recipe.dealItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-recipe-orange" />
                  <span className="text-recipe-orange">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Recipe Generated From</h3>
            <p className="text-muted-foreground">
              This recipe was generated from your weekly deals on {new Date(recipe.createdAt).toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
