
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronRight, Clock, ChefHat, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Recipe } from '@/types';

// Mock data - would come from Supabase in real implementation
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Lemon Garlic Roasted Chicken with Spring Vegetables',
    ingredients: [
      'Whole chicken (on sale at Kroger)',
      'Fresh lemons',
      'Garlic bulb',
      'Rosemary sprigs',
      'Asparagus bundle (30% off)',
      'Baby potatoes (buy one get one)',
      'Olive oil',
      'Salt and pepper',
    ],
    instructions: [
      'Preheat oven to 425°F',
      'Prepare chicken with lemon, garlic, and herbs',
      'Add vegetables around the chicken',
      'Roast for 1 hour or until internal temperature reaches 165°F',
      'Let rest before serving',
    ],
    cookingTime: 70,
    difficultyLevel: 'medium',
    cuisine: 'American',
    savings: 8.75,
    dealItems: [
      { name: 'Whole Chicken', price: 6.99, originalPrice: 9.99 },
      { name: 'Asparagus Bundle', price: 2.99, originalPrice: 4.29 },
      { name: 'Baby Potatoes (2 bags)', price: 3.49, originalPrice: 6.98 },
    ],
    createdAt: '2023-04-01T12:00:00Z',
  },
  {
    id: '2',
    title: 'Mediterranean Pasta Primavera',
    ingredients: [
      'Whole grain pasta (30% off)',
      'Cherry tomatoes (on sale)',
      'Zucchini',
      'Bell peppers (buy one get one)',
      'Red onion',
      'Feta cheese (markdown special)',
      'Olive oil',
      'Balsamic vinegar',
      'Fresh basil',
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Sauté vegetables until tender',
      'Combine pasta and vegetables',
      'Add feta cheese and dressing',
      'Garnish with fresh basil',
    ],
    cookingTime: 30,
    difficultyLevel: 'easy',
    cuisine: 'Mediterranean',
    savings: 6.25,
    dealItems: [
      { name: 'Whole Grain Pasta', price: 1.99, originalPrice: 2.79 },
      { name: 'Cherry Tomatoes', price: 2.50, originalPrice: 3.99 },
      { name: 'Bell Peppers (2)', price: 2.99, originalPrice: 5.98 },
      { name: 'Feta Cheese', price: 3.49, originalPrice: 4.29 },
    ],
    createdAt: '2023-04-02T14:30:00Z',
  },
  {
    id: '3',
    title: 'Grilled Salmon with Mango Salsa',
    ingredients: [
      'Salmon fillets (weekly special)',
      'Fresh mangos (on sale)',
      'Red onion',
      'Jalapeño',
      'Cilantro',
      'Lime juice',
      'Avocado (reduced price)',
      'Brown rice',
    ],
    instructions: [
      'Prepare mango salsa with diced mango, onion, jalapeño, cilantro, and lime',
      'Season salmon fillets',
      'Grill salmon for 4-5 minutes per side',
      'Serve salmon over rice topped with mango salsa',
    ],
    cookingTime: 25,
    difficultyLevel: 'medium',
    cuisine: 'Fusion',
    savings: 9.50,
    dealItems: [
      { name: 'Salmon Fillets', price: 8.99, originalPrice: 14.99 },
      { name: 'Mangos (2)', price: 2.00, originalPrice: 3.98 },
      { name: 'Avocados', price: 1.25, originalPrice: 1.99 },
    ],
    createdAt: '2023-04-03T18:15:00Z',
  },
];

const RecipesPage = () => {
  const { user } = useUser();
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(recipes);
  
  useEffect(() => {
    // Filter recipes based on search term
    const filtered = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
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
              <p className="text-muted-foreground">No recipes found. Try another search or generate new recipes.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-muted">
                  {/* This would be the recipe image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChefHat className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getDifficultyColor(recipe.difficultyLevel)} mb-2`}>
                        {recipe.difficultyLevel.charAt(0).toUpperCase() + recipe.difficultyLevel.slice(1)}
                      </span>
                      <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground ml-2 mb-2">
                        {recipe.cuisine}
                      </span>
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
                    <span className="font-medium">${recipe.savings.toFixed(2)} savings</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 ? ` and ${recipe.ingredients.length - 3} more...` : ''}
                  </p>
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
