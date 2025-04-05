
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("openrouter-api-key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Save API key to localStorage
      localStorage.setItem("openrouter-api-key", apiKey);

      toast({
        title: "API Key saved",
        description: "Your OpenRouter API key has been saved successfully.",
      });
      
    } catch (error: any) {
      toast({
        title: "Error saving API key",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem("openrouter-api-key");
    setApiKey("");
    toast({
      title: "API Key cleared",
      description: "Your OpenRouter API key has been removed.",
    });
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure API keys for DealDish to generate recipes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="openrouter-key"
                type="password"
                placeholder="Enter your OpenRouter API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleSaveApiKey} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearApiKey}
                className="text-xs"
              >
                Clear Key
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Required for generating AI-powered recipes from your grocery deals
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4 mt-0.5" />
            <p>
              Your API key is stored locally on your device and used only to generate recipes based on your deal images.{" "}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                Get an OpenRouter API key
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
