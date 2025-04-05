
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import OnboardingPage from "./pages/Onboarding";
import UploadPage from "./pages/Upload";
import RecipesPage from "./pages/Recipes";
import RecipeDetailPage from "./pages/RecipeDetail";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Protected from "./components/Protected";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
              <Route path="/settings" element={
                <Protected>
                  <SettingsPage />
                </Protected>
              } />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
