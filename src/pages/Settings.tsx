
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || !user) {
      toast({
        title: "Error",
        description: "Please enter a valid API key.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Use RPC to save the key
      const { error } = await supabase.rpc('upsert_api_key', {
        p_user_id: user.id,
        p_provider: 'openrouter',
        p_api_key: apiKey
      });

      if (error) {
        // Fallback to direct insert/update if RPC doesn't exist yet
        const { error: fallbackError } = await supabase.from('user_api_keys')
          .upsert({
            user_id: user.id,
            provider: 'openrouter',
            api_key: apiKey,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,provider'
          });
          
        if (fallbackError) throw fallbackError;
      }

      toast({
        title: "API Key saved",
        description: "Your OpenRouter API key has been saved successfully.",
      });
      
      // Clear input after successful save
      setApiKey("");
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
            <p className="text-sm text-muted-foreground mt-1">
              Required for generating AI-powered recipes from your grocery deals
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 p-4 rounded-b-lg">
          <div className="flex items-start space-x-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4 mt-0.5" />
            <p>
              Your API keys are securely stored and used only to generate recipes based on your deal images.{" "}
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
