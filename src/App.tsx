
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import IndexPage from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Protected from '@/components/Protected';
import Recipes from '@/pages/Recipes';
import Upload from '@/pages/Upload';
import RecipeDetail from '@/pages/RecipeDetail';
import Onboarding from '@/pages/Onboarding';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<IndexPage />} />
              <Route path="onboarding" element={<Protected><Onboarding /></Protected>} />
              <Route path="recipes" element={<Protected><Recipes /></Protected>} />
              <Route path="recipes/:id" element={<Protected><RecipeDetail /></Protected>} />
              <Route path="upload" element={<Protected><Upload /></Protected>} />
              <Route path="profile" element={<Protected><Profile /></Protected>} />
              <Route path="settings" element={<Protected><Settings /></Protected>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
