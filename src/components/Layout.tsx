
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, ChefHat, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Layout: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-recipe-orange" />
            <span className="font-bold text-xl">DealDish</span>
          </Link>
          {!isMobile && (
            <nav className="hidden md:flex gap-6">
              <NavLink to="/" currentPath={location.pathname}>Home</NavLink>
              <NavLink to="/recipes" currentPath={location.pathname}>My Recipes</NavLink>
              <NavLink to="/profile" currentPath={location.pathname}>Profile</NavLink>
            </nav>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      
      {isMobile && (
        <nav className="fixed bottom-0 w-full border-t bg-background">
          <div className="flex justify-around items-center h-16">
            <NavIcon to="/" icon={<Home />} label="Home" isActive={location.pathname === "/"} />
            <NavIcon to="/upload" icon={<ChefHat />} label="Upload" isActive={location.pathname === "/upload"} />
            <NavIcon to="/recipes" icon={<History />} label="Recipes" isActive={location.pathname === "/recipes"} />
            <NavIcon to="/profile" icon={<User />} label="Profile" isActive={location.pathname === "/profile"} />
          </div>
        </nav>
      )}
    </div>
  );
};

interface NavLinkProps {
  to: string;
  currentPath: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, currentPath, children }) => {
  const isActive = currentPath === to;
  
  return (
    <Link
      to={to}
      className={cn(
        "transition-colors hover:text-recipe-orange font-medium",
        isActive ? "text-recipe-orange" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
};

interface NavIconProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavIcon: React.FC<NavIconProps> = ({ to, icon, label, isActive }) => (
  <Link to={to} className="flex flex-col items-center">
    <div className={cn(
      "p-1.5 rounded-full",
      isActive ? "text-recipe-orange" : "text-muted-foreground"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-xs",
      isActive ? "text-recipe-orange font-medium" : "text-muted-foreground"
    )}>
      {label}
    </span>
  </Link>
);

export default Layout;
