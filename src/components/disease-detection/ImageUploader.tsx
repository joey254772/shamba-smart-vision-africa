
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onAnalyze: () => Promise<void>;
  isLoading: boolean;
}

const ImageUploader = ({ onImageSelect, selectedImage, onAnalyze, isLoading }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onImageSelect(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast({
        title: "No Image Selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    await onAnalyze();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onImageSelect(droppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(droppedFile);
    }
  };

  // Update preview when selectedImage changes
  React.useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setPreview(null);
    }
  }, [selectedImage]);

  return (
    <Card className="dashboard-card">
      <CardContent className="pt-6">
        <div
          className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-4 sm:p-8 cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation"
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
                Tap to change image
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4 sm:px-6">
              <div className="rounded-full bg-agriculture-primary/10 p-3 mb-4">
                <Image className="h-6 w-6 sm:h-8 sm:w-8 text-agriculture-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1 text-center">Upload Plant Image</h3>
              <p className="text-sm text-center text-muted-foreground mb-6 max-w-xs">
                Take a clear photo of your plant leaves or stems. AI will analyze and detect any disease.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <Button
                  className="bg-agriculture-primary hover:bg-agriculture-primary/90 flex-1"
                  size="sm"
                >
                  Select Image
                </Button>
                <Button
                  className="bg-agriculture-secondary hover:bg-agriculture-secondary/90 flex-1"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Trigger camera on mobile devices
                    const input = document.getElementById("file-upload") as HTMLInputElement;
                    if (input) {
                      input.capture = "environment";
                      input.click();
                    }
                  }}
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
            capture="environment"
            onChange={handleFileChange}
          />
        </div>

        {preview && (
          <div className="mt-6 flex justify-center">
            <Button
              className="bg-agriculture-primary hover:bg-agriculture-primary/90 w-full max-w-xs"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
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
