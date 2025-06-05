
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
    
    // Simulate AI analysis with Kenyan crop diseases
    setTimeout(() => {
      const diseases = [
        { disease: "Coffee Berry Disease", confidence: 92.3, crop: "Coffee" },
        { disease: "Maize Streak Virus", confidence: 88.7, crop: "Maize" },
        { disease: "Banana Xanthomonas Wilt", confidence: 85.4, crop: "Banana" },
        { disease: "Tea Blister Blight", confidence: 91.2, crop: "Tea" }
      ];
      
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      
      setResults({
        disease: randomDisease.disease,
        confidence: randomDisease.confidence,
        severity: randomDisease.confidence > 90 ? "High" : "Moderate",
        crop: randomDisease.crop,
        recommendations: [
          "Contact your local agricultural extension officer",
          "Apply recommended fungicide for " + randomDisease.crop,
          "Isolate affected plants to prevent spread",
          "Monitor neighboring plants closely",
          "Report to Kenya Plant Health Inspectorate Service (KEPHIS)"
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
            Upload a photo of your crop to detect diseases common in Kenya
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
