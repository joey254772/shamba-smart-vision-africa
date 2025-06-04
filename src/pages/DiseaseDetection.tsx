
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ImageUploader from "@/components/disease-detection/ImageUploader";
import DetectionResults from "@/components/disease-detection/DetectionResults";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setResults({
        disease: "Early Blight",
        confidence: 89.5,
        severity: "Moderate",
        recommendations: [
          "Apply fungicide treatment immediately",
          "Improve air circulation around plants",
          "Remove affected leaves and dispose properly",
          "Monitor closely for spread to other plants"
        ]
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-agriculture-primary">AI Disease Detection</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload a photo of your crop to detect diseases and get treatment recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <ImageUploader 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
          
          <div>
            <DetectionResults 
              results={results}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DiseaseDetection;
