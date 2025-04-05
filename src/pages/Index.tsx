
import React, { useState, useEffect } from 'react';
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user, isLoaded, signIn, signUp, hasCompletedOnboarding } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (user) {
    // Redirect based on onboarding status or if just signed up
    if (justSignedUp || !hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/upload" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
    } catch (err) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await signUp(email, password, firstName, lastName);
      setJustSignedUp(true);
    } catch (err) {
      // Error is handled in the context
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <div className="text-center space-y-4 mb-6">
        <div className="flex flex-col items-center">
          <div className="bg-recipe-peach p-4 rounded-full mb-4">
            <ChefHat className="h-12 w-12 text-recipe-orange" />
          </div>
          <h1 className="text-4xl font-bold">DealDish</h1>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Generate personalized recipes from your weekly grocery deals. Save money and eat better!
        </p>
      </div>
      
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Enter your information to create a new account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Index;
