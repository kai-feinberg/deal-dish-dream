# Deal Dish Dream 🍽️

## About the Application

Deal Dish Dream is an innovative application that transforms grocery shopping deals into delicious recipes. By leveraging advanced AI technology, it helps users:

- Make the most of their grocery store deals
- Reduce food waste by planning meals around sale items
- Save money while creating delicious, home-cooked meals
- Discover new recipes tailored to available ingredients
- Build a personalized recipe collection

## Why We Built This

In today's economy, many people struggle with:
- Rising grocery costs
- Food waste from unplanned purchases
- Limited cooking inspiration
- Time-consuming meal planning

Deal Dish Dream addresses these challenges by automatically generating recipes based on store deals, helping users save money while expanding their culinary horizons. The application encourages sustainable shopping habits and reduces food waste by focusing recipes around items currently on sale.

## Technical Architecture

### Core Services

1. **OpenRouter Service** (`src/services/openRouterService.ts`)
   - Handles AI-powered recipe generation using Google's Gemini model
   - Processes images of grocery deals
   - Generates structured recipe data with ingredients, instructions, and cooking details
   - Identifies sale items and incorporates them into recipes

2. **Supabase Integration** (`src/integrations/supabase`)
   - User authentication and management
   - Recipe storage and retrieval
   - User preferences and settings
   - Real-time data synchronization

### Key Components

1. **Authentication System with Supabase**
   - Secure user login/signup
   - Profile management
   - Session handling

2. **Recipe Management**
   - Recipe generation from deal images
   - Recipe storage and organization
   - Personalized recipe collections
   - Recipe sharing capabilities

3. **Deal Processing**
   - Image processing for deal recognition
   - Deal item extraction and categorization
   - Smart recipe suggestions based on deals

## Benefits

1. **Financial Benefits**
   - Reduced grocery spending through deal-focused recipes
   - Better meal planning around sales
   - Minimized food waste

2. **Culinary Benefits**
   - Expanded recipe repertoire
   - Customized recipe suggestions
   - Simplified meal planning

3. **Time-Saving Benefits**
   - Automated recipe generation
   - Quick meal ideas based on available deals
   - Streamlined shopping process

4. **Environmental Impact**
   - Reduced food waste
   - More sustainable shopping habits
   - Optimized ingredient usage

## Getting Started

### Prerequisites
- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account for database access
- OpenRouter API key for AI functionality

### Installation

```sh
# Clone the repository
git clone https://github.com/kai-feinberg/deal-dish-dream

# Navigate to project directory
cd deal-dish-dream

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys and configuration

# Start development server
npm run dev
```

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn-ui
- **Build Tool**: Vite
- **Database**: Supabase
- **AI Integration**: OpenRouter API with Google's Gemini model
- **Authentication**: Supabase Auth
- **State Management**: React Context/Hooks
- **Development Tools**: Lovable, Cursor

## Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
