import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Sample preferences data
const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
  { id: "glutenFree", label: "Gluten-Free" },
];

const commonAllergies = [
  { id: "nuts", label: "Nuts" },
  { id: "dairy", label: "Dairy" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
  { id: "shellfish", label: "Shellfish" },
  { id: "wheat", label: "Wheat" },
];

const OnboardingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    allergies: [],
    preferences: [],
  });
  const [customPreference, setCustomPreference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const handleDietaryChange = (id: string) => {
    setPreferences((prev) => {
      const exists = prev.dietaryRestrictions.includes(id);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((item) => item !== id)
          : [...prev.dietaryRestrictions, id],
      };
    });
  };

  const handleAllergyChange = (id: string) => {
    setPreferences((prev) => {
      const exists = prev.allergies.includes(id);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((item) => item !== id)
          : [...prev.allergies, id],
      };
    });
  };

  const handleAddCustomPreference = () => {
    if (customPreference.trim()) {
      setPreferences((prev) => ({
        ...prev,
        preferences: [...prev.preferences, customPreference.trim()],
      }));
      setCustomPreference("");
    }
  };

  const removeCustomPreference = (index: number) => {
    setPreferences((prev) => ({
      ...prev,
      preferences: prev.preferences.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Update user preferences in Supabase
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .update({
          dietary_restrictions: preferences.dietaryRestrictions,
          allergies: preferences.allergies,
          preferences: preferences.preferences
        })
        .eq('user_id', user.id);

      if (preferencesError) {
        throw preferencesError;
      }
      
      // Update profile to mark onboarding as complete
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          has_completed_onboarding: true
        })
        .eq('id', user.id);
        
      if (profileError) {
        throw profileError;
      }
      
      toast({
        title: "Preferences saved!",
        description: "Your dietary preferences have been saved successfully.",
      });
      
      navigate("/upload");
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground mt-2">
            Tell us about your dietary preferences so we can suggest better recipes.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step >= 1 ? "bg-recipe-orange text-white" : "bg-muted text-muted-foreground"
            }`}>
              1
            </div>
            <div className={`h-1 w-8 ${step >= 2 ? "bg-recipe-orange" : "bg-muted"}`}></div>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step >= 2 ? "bg-recipe-orange text-white" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <div className={`h-1 w-8 ${step >= 3 ? "bg-recipe-orange" : "bg-muted"}`}></div>
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
              step >= 3 ? "bg-recipe-orange text-white" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Dietary Restrictions</CardTitle>
              <CardDescription>Select any dietary restrictions that apply to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {dietaryOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={preferences.dietaryRestrictions.includes(option.id)}
                      onCheckedChange={() => handleDietaryChange(option.id)}
                    />
                    <Label htmlFor={option.id}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNext} className="flex items-center">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>Select any allergies that apply to you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {commonAllergies.map((allergy) => (
                  <div key={allergy.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy.id}
                      checked={preferences.allergies.includes(allergy.id)}
                      onCheckedChange={() => handleAllergyChange(allergy.id)}
                    />
                    <Label htmlFor={allergy.id}>{allergy.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Food Preferences</CardTitle>
              <CardDescription>
                Add any specific preferences (e.g., no blue cheese, no olives)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="E.g., no blue cheese"
                  value={customPreference}
                  onChange={(e) => setCustomPreference(e.target.value)}
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddCustomPreference} variant="secondary">
                  Add
                </Button>
              </div>

              {preferences.preferences.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Your preferences:</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.preferences.map((pref, index) => (
                      <div
                        key={index}
                        className="bg-muted px-3 py-1 rounded-full flex items-center"
                      >
                        <span className="text-sm">{pref}</span>
                        <button
                          onClick={() => removeCustomPreference(index)}
                          className="ml-2 text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
