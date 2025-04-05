
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import OnboardingPage from "./pages/Onboarding";
import UploadPage from "./pages/Upload";
import RecipesPage from "./pages/Recipes";
import RecipeDetailPage from "./pages/RecipeDetail";
import ProfilePage from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Protected from "./components/Protected";

// You'll need to get this from Clerk's dashboard
const PUBLISHABLE_KEY = ""; // Needs to be filled by the user

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={
                <Protected>
                  <OnboardingPage />
                </Protected>
              } />
              <Route path="/upload" element={
                <Protected>
                  <UploadPage />
                </Protected>
              } />
              <Route path="/recipes" element={
                <Protected>
                  <RecipesPage />
                </Protected>
              } />
              <Route path="/recipes/:id" element={
                <Protected>
                  <RecipeDetailPage />
                </Protected>
              } />
              <Route path="/profile" element={
                <Protected>
                  <ProfilePage />
                </Protected>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
