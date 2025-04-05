import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronRight, Clock, ChefHat, DollarSign, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Recipe } from '@/types';
import { useRecipes } from '@/context/RecipeContext';

// Access the OpenRouter API key from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const RecipesPage = () => {
  const { user } = useAuth();
  const { recipes, isLoading, error, refetchRecipes } = useRecipes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);

  useEffect(() => {
    // Filter recipes based on search term
    const filtered = recipes.filter(recipe =>
      (recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );
    setFilteredRecipes(filtered);
  }, [recipes, searchTerm]);

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <img src="/chef.webp" alt="Chef" className="h-12 w-12 animate-pulse mb-4" />
          <p>Loading your recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refetchRecipes} variant="outline" size="sm">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Recipes</h1>
          <p className="text-muted-foreground">
            Browse your saved recipes generated from weekly deals
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button asChild>
            <Link to="/upload">Generate New</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Recipes</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredRecipes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No recipes found. Try another search term."
                  : "No recipes yet. Generate your first recipe by uploading a deals image!"
                }
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <Link to="/upload">Get Started</Link>
                </Button>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/chef.webp" alt="Chef" className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      {recipe.difficultyLevel && (
                        <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(recipe.difficultyLevel)} mb-2`}>
                          {recipe.difficultyLevel.charAt(0).toUpperCase() + recipe.difficultyLevel.slice(1)}
                        </span>
                      )}
                      {recipe.cuisine && (
                        <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-2 mb-2">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">{recipe.cookingTime} mins</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center text-recipe-orange">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">
                      {recipe.dealItems.length} items on sale
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 ? ` and ${recipe.ingredients.length - 3} more...` : ''}
                  </p>
                  {recipe.dealItems.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {recipe.dealItems.map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-recipe-orange/10 text-recipe-orange text-xs"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link to={`/recipes/${recipe.id}`} className="flex items-center justify-between">
                      <span>View Recipe</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Filter view based on recent recipes would be populated here.</p>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Filter view based on favorite recipes would be populated here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipesPage;
