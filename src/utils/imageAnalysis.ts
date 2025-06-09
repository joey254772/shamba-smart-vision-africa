
export interface ImageAnalysisResult {
  disease: string;
  confidence: number;
  crop: string;
  severity: string;
  recommendations: string[];
  analysisDetails: {
    colorAnalysis: {
      healthyGreen: number;
      diseaseIndicators: number;
      overallHealth: string;
    };
    riskFactors: string[];
    treatmentUrgency: string;
    detectedSymptoms: string[];
    leafCondition: string;
  };
}

export const analyzeImageForDisease = async (imageFile: File): Promise<ImageAnalysisResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData?.data;
        
        if (!data) {
          resolve(getDefaultHealthyResult());
          return;
        }

        // Enhanced analysis for disease detection
        const analysis = performAdvancedImageAnalysis(data, canvas.width, canvas.height);
        const result = interpretAnalysisResults(analysis);
        
        resolve(result);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });
};

interface PixelAnalysis {
  greenPixels: number;
  brownPixels: number;
  yellowPixels: number;
  blackSpots: number;
  whiteSpots: number;
  redPixels: number;
  totalPixels: number;
  averageBrightness: number;
  colorVariance: number;
  edgeDetection: number;
  symmetryScore: number;
}

const performAdvancedImageAnalysis = (data: Uint8ClampedArray, width: number, height: number): PixelAnalysis => {
  let greenPixels = 0;
  let brownPixels = 0;
  let yellowPixels = 0;
  let blackSpots = 0;
  let whiteSpots = 0;
  let redPixels = 0;
  let totalPixels = 0;
  let brightnessSum = 0;
  let edgePixels = 0;
  
  const colorVariations: number[] = [];
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    totalPixels++;
    const brightness = (r + g + b) / 3;
    brightnessSum += brightness;
    colorVariations.push(brightness);
    
    // Enhanced color detection for specific disease patterns
    if (g > r && g > b && g > 80) {
      greenPixels++;
    } else if (r > 100 && g < 80 && b < 60) {
      brownPixels++;
    } else if (r > 150 && g > 150 && b < 100) {
      yellowPixels++;
    } else if (r < 50 && g < 50 && b < 50) {
      blackSpots++;
    } else if (r > 200 && g > 200 && b > 200) {
      whiteSpots++;
    } else if (r > g && r > b && r > 120) {
      redPixels++;
    }
    
    // Simple edge detection
    if (i > width * 4 && i < data.length - width * 4) {
      const prevRowSame = Math.abs(brightness - (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3);
      const nextRowSame = Math.abs(brightness - (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3);
      
      if (prevRowSame > 30 || nextRowSame > 30) {
        edgePixels++;
      }
    }
  }
  
  const averageBrightness = brightnessSum / totalPixels;
  
  // Calculate color variance
  const variance = colorVariations.reduce((sum, val) => sum + Math.pow(val - averageBrightness, 2), 0) / totalPixels;
  
  return {
    greenPixels,
    brownPixels,
    yellowPixels,
    blackSpots,
    whiteSpots,
    redPixels,
    totalPixels,
    averageBrightness,
    colorVariance: variance,
    edgeDetection: edgePixels / totalPixels,
    symmetryScore: calculateSymmetry(data, width, height)
  };
};

const calculateSymmetry = (data: Uint8ClampedArray, width: number, height: number): number => {
  let symmetryScore = 0;
  const centerX = Math.floor(width / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < centerX; x++) {
      const leftIndex = (y * width + x) * 4;
      const rightIndex = (y * width + (width - 1 - x)) * 4;
      
      if (leftIndex < data.length && rightIndex < data.length) {
        const leftBrightness = (data[leftIndex] + data[leftIndex + 1] + data[leftIndex + 2]) / 3;
        const rightBrightness = (data[rightIndex] + data[rightIndex + 1] + data[rightIndex + 2]) / 3;
        
        symmetryScore += Math.abs(leftBrightness - rightBrightness);
      }
    }
  }
  
  return symmetryScore / (centerX * height);
};

const interpretAnalysisResults = (analysis: PixelAnalysis): ImageAnalysisResult => {
  const {
    greenPixels,
    brownPixels,
    yellowPixels,
    blackSpots,
    whiteSpots,
    redPixels,
    totalPixels,
    averageBrightness,
    colorVariance,
    edgeDetection,
    symmetryScore
  } = analysis;
  
  const greenRatio = greenPixels / totalPixels;
  const brownRatio = brownPixels / totalPixels;
  const yellowRatio = yellowPixels / totalPixels;
  const blackRatio = blackSpots / totalPixels;
  const whiteRatio = whiteSpots / totalPixels;
  const redRatio = redPixels / totalPixels;
  
  const detectedSymptoms: string[] = [];
  const riskFactors: string[] = [];
  
  // Leaf Gall Disease Detection
  if (whiteRatio > 0.08 && edgeDetection > 0.15 && colorVariance > 800) {
    detectedSymptoms.push("White/pale irregular growths", "Leaf deformation", "Abnormal tissue growth");
    return {
      disease: "Leaf Gall Disease",
      confidence: Math.min(85 + (whiteRatio * 100) + (edgeDetection * 50), 96),
      crop: "Various crops",
      severity: whiteRatio > 0.15 ? "High" : "Moderate",
      recommendations: [
        "Remove and destroy affected leaves immediately",
        "Apply copper-based fungicide spray",
        "Improve air circulation around plants",
        "Avoid overhead watering",
        "Monitor for bacterial infection",
        "Contact KALRO for specific treatment protocols"
      ],
      analysisDetails: {
        colorAnalysis: {
          healthyGreen: Math.round(greenRatio * 100),
          diseaseIndicators: Math.round((whiteRatio + redRatio) * 100),
          overallHealth: greenRatio > 0.4 ? "Fair" : "Poor"
        },
        riskFactors: ["High humidity", "Poor air circulation", "Bacterial infection", "Insect damage"],
        treatmentUrgency: whiteRatio > 0.15 ? "Immediate" : "Within 24 hours",
        detectedSymptoms,
        leafCondition: "Severe gall formation detected"
      }
    };
  }
  
  // Crown Gall Detection
  if (redRatio > 0.12 && brownRatio > 0.1 && edgeDetection > 0.12) {
    detectedSymptoms.push("Reddish-brown growths", "Swollen tissue", "Tumor-like formations");
    return {
      disease: "Crown Gall (Agrobacterium tumefaciens)",
      confidence: Math.min(82 + (redRatio * 80) + (brownRatio * 60), 94),
      crop: "Fruit trees/Vegetables",
      severity: redRatio > 0.2 ? "High" : "Moderate",
      recommendations: [
        "Remove affected plants completely",
        "Disinfect tools with 70% alcohol",
        "Avoid wounding plants during cultivation",
        "Use resistant rootstock varieties",
        "Improve soil drainage",
        "Contact agricultural extension services"
      ],
      analysisDetails: {
        colorAnalysis: {
          healthyGreen: Math.round(greenRatio * 100),
          diseaseIndicators: Math.round((redRatio + brownRatio) * 100),
          overallHealth: greenRatio > 0.3 ? "Fair" : "Poor"
        },
        riskFactors: ["Soil-borne bacteria", "Plant wounds", "Poor drainage", "Contaminated tools"],
        treatmentUrgency: "Immediate - highly contagious",
        detectedSymptoms,
        leafCondition: "Bacterial gall infection detected"
      }
    };
  }
  
  // Enhanced detection for other diseases based on improved analysis
  if (brownRatio > 0.15 && yellowRatio > 0.08) {
    detectedSymptoms.push("Brown spots with yellow halos", "Leaf browning", "Tissue death");
    return {
      disease: "Late Blight (Phytophthora infestans)",
      confidence: Math.min(88 + (brownRatio * 80), 96),
      crop: "Potato/Tomato",
      severity: brownRatio > 0.25 ? "High" : "Moderate",
      recommendations: [
        "Apply systemic fungicide immediately",
        "Remove and destroy affected plant parts",
        "Improve drainage and air circulation",
        "Avoid overhead watering",
        "Apply preventive copper sprays in humid conditions"
      ],
      analysisDetails: {
        colorAnalysis: {
          healthyGreen: Math.round(greenRatio * 100),
          diseaseIndicators: Math.round((brownRatio + yellowRatio) * 100),
          overallHealth: greenRatio > 0.4 ? "Fair" : "Poor"
        },
        riskFactors: ["High humidity", "Cool temperatures", "Poor drainage", "Dense planting"],
        treatmentUrgency: brownRatio > 0.25 ? "Immediate" : "Within 24-48 hours",
        detectedSymptoms,
        leafCondition: "Advanced fungal infection"
      }
    };
  }
  
  if (blackRatio > 0.08 && colorVariance > 600) {
    detectedSymptoms.push("Small black spots", "Circular lesions", "Leaf spotting");
    return {
      disease: "Bacterial Spot (Xanthomonas)",
      confidence: Math.min(85 + (blackRatio * 100), 93),
      crop: "Tomato/Pepper",
      severity: blackRatio > 0.15 ? "High" : "Moderate",
      recommendations: [
        "Apply copper-based bactericide",
        "Remove infected plant debris immediately",
        "Avoid working with wet plants",
        "Improve field drainage",
        "Use certified disease-free seeds"
      ],
      analysisDetails: {
        colorAnalysis: {
          healthyGreen: Math.round(greenRatio * 100),
          diseaseIndicators: Math.round(blackRatio * 100),
          overallHealth: greenRatio > 0.5 ? "Fair" : "Poor"
        },
        riskFactors: ["Warm wet conditions", "Overhead irrigation", "Plant wounds", "Contaminated tools"],
        treatmentUrgency: "Within 24-48 hours",
        detectedSymptoms,
        leafCondition: "Bacterial infection present"
      }
    };
  }
  
  // If high green ratio and good symmetry, likely healthy
  if (greenRatio > 0.6 && symmetryScore < 20 && colorVariance < 400) {
    return getHealthyResult(greenRatio);
  }
  
  // Default to early stage disease if abnormal patterns detected
  if (colorVariance > 500 || edgeDetection > 0.1) {
    detectedSymptoms.push("Color variations", "Irregular patterns", "Possible early symptoms");
    return {
      disease: "Early Disease Stage (Unspecified)",
      confidence: Math.min(70 + (colorVariance / 20), 85),
      crop: "General",
      severity: "Low to Moderate",
      recommendations: [
        "Monitor plant closely for symptom development",
        "Ensure proper plant nutrition",
        "Maintain good agricultural practices",
        "Improve air circulation",
        "Contact agricultural extension for identification"
      ],
      analysisDetails: {
        colorAnalysis: {
          healthyGreen: Math.round(greenRatio * 100),
          diseaseIndicators: Math.round((1 - greenRatio) * 100),
          overallHealth: greenRatio > 0.5 ? "Fair" : "Poor"
        },
        riskFactors: ["Environmental stress", "Poor plant health", "Early infection"],
        treatmentUrgency: "Monitor closely - preventive action recommended",
        detectedSymptoms,
        leafCondition: "Abnormal patterns detected"
      }
    };
  }
  
  return getHealthyResult(greenRatio);
};

const getHealthyResult = (greenRatio: number): ImageAnalysisResult => {
  return {
    disease: "Healthy Plant",
    confidence: Math.min(85 + (greenRatio * 30), 98),
    crop: "General",
    severity: "None",
    recommendations: [
      "Continue regular monitoring",
      "Maintain good agricultural practices",
      "Ensure proper nutrition and watering",
      "Apply preventive measures during high-risk periods"
    ],
    analysisDetails: {
      colorAnalysis: {
        healthyGreen: Math.round(greenRatio * 100),
        diseaseIndicators: Math.round((1 - greenRatio) * 100),
        overallHealth: "Good"
      },
      riskFactors: ["Environmental changes", "Seasonal variations"],
      treatmentUrgency: "Routine monitoring sufficient",
      detectedSymptoms: ["Healthy green coloration", "Normal leaf structure"],
      leafCondition: "Healthy leaf tissue"
    }
  };
};

const getDefaultHealthyResult = (): ImageAnalysisResult => {
  return {
    disease: "Analysis Error",
    confidence: 0,
    crop: "Unknown",
    severity: "Unknown",
    recommendations: ["Please try again with a clearer image", "Ensure good lighting conditions"],
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
  };
};
