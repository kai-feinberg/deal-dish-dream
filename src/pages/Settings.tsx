
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Key } from "lucide-react";

const Settings = () => {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            OpenRouter API configured for DealDish
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground mt-1">
            OpenRouter API key is pre-configured for generating AI-powered recipes
          </p>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4 mt-0.5" />
            <p>
              A default API key is configured for generating recipes based on your deal images.{" "}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Get your own OpenRouter key
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
