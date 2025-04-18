
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Image, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { generateRecipeFromImage } from '@/services/openRouterService';
import { useRecipes } from '@/context/RecipeContext';
import { Progress } from '@/components/ui/progress';

const UploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addRecipe } = useRecipes();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    
    // Generate previews
    selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!e.dataTransfer.files?.length) return;
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    setFiles((prev) => [...prev, ...imageFiles]);
    
    // Generate previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async () => {
    if (files.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one deal image to continue.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process each image to generate recipes
      for (let i = 0; i < previews.length; i++) {
        setCurrentImageIndex(i);
        setIsProcessing(true);
        setProcessingProgress(0);
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setProcessingProgress(prev => {
            const newProgress = prev + 10;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 1000);
        
        const generatedRecipe = await generateRecipeFromImage(previews[i], customPrompt);
        
        clearInterval(progressInterval);
        setProcessingProgress(100);
        
        if (generatedRecipe) {
          addRecipe(generatedRecipe);
          toast({
            title: "Recipe generated!",
            description: `"${generatedRecipe.title}" has been created based on your deals.`,
          });
          
          // Wait a moment to show 100% progress before moving to next image
          await new Promise(resolve => setTimeout(resolve, 500));
        } else {
          toast({
            title: "Failed to generate recipe",
            description: "We couldn't generate a recipe from this image. Please try another image.",
            variant: "destructive",
          });
        }
      }
      
      // Once all recipes are generated, navigate to recipes page
      navigate("/recipes");
    } catch (error) {
      console.error("Error processing images:", error);
      toast({
        title: "Error processing images",
        description: "There was a problem generating recipes from your images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };
  
  const getProcessingStatusText = () => {
    if (!isProcessing) return "";
    return `Processing image ${currentImageIndex + 1} of ${previews.length}...`;
  };
  
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Deal Images</h1>
          <p className="text-muted-foreground mt-2">
            Upload screenshots of weekly deals from grocery stores and we'll generate recipes for you.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Select Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={triggerFileInput}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                disabled={isUploading || isProcessing}
              />
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Image className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Upload deal images</h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
              </div>
            </div>
            
            {previews.length > 0 && (
              <div className="mt-6">
                <Label className="block mb-2">Selected Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Deal ${index + 1}`}
                        className="rounded-md object-cover w-full h-full"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isUploading || isProcessing}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Label htmlFor="custom-prompt" className="block mb-2">
                Custom Recipe Request (Optional)
              </Label>
              <Textarea
                id="custom-prompt"
                placeholder="E.g., I'd like a Chinese stir-fry recipe using this week's vegetable deals"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[100px]"
                disabled={isUploading || isProcessing}
              />
            </div>
            
            {isProcessing && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{getProcessingStatusText()}</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => navigate("/recipes")}
              disabled={isUploading || isProcessing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isUploading || isProcessing || previews.length === 0}
              className="relative"
            >
              {(isUploading || isProcessing) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? "Uploading..." : isProcessing ? "Generating Recipe..." : "Generate Recipes"}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-accent rounded-lg p-4">
          <p className="text-sm text-accent-foreground">
            <strong>Tip:</strong> For best results, ensure the deal prices and product names are clearly visible in your screenshots.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
