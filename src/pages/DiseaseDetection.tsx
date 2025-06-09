
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import ImageUploader from "@/components/disease-detection/ImageUploader";
import DetectionResults from "@/components/disease-detection/DetectionResults";
import { analyzeImageForDisease, type ImageAnalysisResult } from "@/utils/imageAnalysis";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [results, setResults] = useState<ImageAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    console.log('Starting enhanced disease analysis...');
    
    try {
      const analysisResults = await analyzeImageForDisease(selectedImage);
      console.log('Analysis completed:', analysisResults);
      setResults(analysisResults);
    } catch (error) {
      console.error('Analysis failed:', error);
      setResults({
        disease: "Analysis Error",
        confidence: 0,
        severity: "Unknown",
        crop: "Unknown",
        recommendations: ["Please try again with a clearer image", "Ensure good lighting conditions", "Contact support if issue persists"],
        analysisDetails: {
          colorAnalysis: {
            healthyGreen: 0,
            diseaseIndicators: 0,
            overallHealth: "Cannot determine"
          },
          riskFactors: ["Poor image quality"],
          treatmentUrgency: "Retake photo",
          detectedSymptoms: ["Unable to analyze"],
          leafCondition: "Image analysis failed"
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-agriculture-primary">AI Disease Detection</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Advanced AI analysis for accurate crop disease identification in Kenya
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
