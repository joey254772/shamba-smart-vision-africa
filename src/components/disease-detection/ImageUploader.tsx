
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ImageUploader = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call for disease detection
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete",
        description: "Image successfully analyzed for crop diseases.",
      });
      
      // Here we would typically dispatch an action to store results
      // or navigate to a results page
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div
          className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-muted/50 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {preview ? (
            <div className="space-y-4 w-full">
              <div className="relative aspect-video w-full max-w-md mx-auto overflow-hidden rounded-lg">
                <img
                  src={preview}
                  alt="Plant preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Click or drag to change image
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-6">
              <div className="rounded-full bg-agriculture-primary/10 p-3 mb-4">
                <Image className="h-8 w-8 text-agriculture-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Upload Plant Image</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">
                Take a clear photo of your plant leaves or stems. <br />
                AI will analyze and detect any disease.
              </p>
              <div className="flex gap-2">
                <Button
                  className="bg-agriculture-primary hover:bg-agriculture-primary/90"
                  size="sm"
                >
                  Select Image
                </Button>
                <Button
                  className="bg-agriculture-secondary hover:bg-agriculture-secondary/90"
                  size="sm"
                >
                  Take Photo
                </Button>
              </div>
            </div>
          )}
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mt-6 flex justify-center">
            <Button
              className="bg-agriculture-primary hover:bg-agriculture-primary/90 w-full max-w-xs"
              disabled={isAnalyzing}
              onClick={handleSubmit}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Image...
                </>
              ) : (
                "Analyze for Diseases"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUploader;
