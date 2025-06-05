
/**
 * Crop Data Processor - Python-like data processing utilities for Kenyan agriculture
 * This module provides functions similar to Python pandas/numpy for processing crop data
 */

export interface CropData {
  id: string;
  name: string;
  region: string;
  plantingDate: string;
  harvestDate: string;
  yield: number;
  rainfall: number;
  temperature: number;
  soilPh: number;
  fertilizer: string;
  pesticides: string[];
  diseases: string[];
}

export interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  region: string;
}

export interface SoilData {
  region: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
}

/**
 * Statistical functions similar to Python's numpy
 */
export class NumpyLike {
  static mean(array: number[]): number {
    return array.reduce((sum, val) => sum + val, 0) / array.length;
  }

  static median(array: number[]): number {
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  static std(array: number[]): number {
    const mean = this.mean(array);
    const variance = array.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / array.length;
    return Math.sqrt(variance);
  }

  static min(array: number[]): number {
    return Math.min(...array);
  }

  static max(array: number[]): number {
    return Math.max(...array);
  }

  static sum(array: number[]): number {
    return array.reduce((sum, val) => sum + val, 0);
  }

  static linspace(start: number, stop: number, num: number): number[] {
    const step = (stop - start) / (num - 1);
    return Array.from({ length: num }, (_, i) => start + step * i);
  }
}

/**
 * DataFrame-like operations similar to Python's pandas
 */
export class PandasLike {
  static groupBy<T>(array: T[], keyFn: (item: T) => string): { [key: string]: T[] } {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {} as { [key: string]: T[] });
  }

  static filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }

  static map<T, U>(array: T[], mapper: (item: T) => U): U[] {
    return array.map(mapper);
  }

  static sortBy<T>(array: T[], keyFn: (item: T) => number, ascending: boolean = true): T[] {
    return [...array].sort((a, b) => {
      const aVal = keyFn(a);
      const bVal = keyFn(b);
      return ascending ? aVal - bVal : bVal - aVal;
    });
  }

  static unique<T>(array: T[], keyFn: (item: T) => string): T[] {
    const seen = new Set<string>();
    return array.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

/**
 * Crop yield prediction using linear regression (similar to scikit-learn)
 */
export class LinearRegression {
  private weights: number[] = [];
  private bias: number = 0;

  fit(features: number[][], targets: number[]): void {
    // Simple linear regression implementation
    const n = features.length;
    const numFeatures = features[0].length;
    
    // Initialize weights
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    // Gradient descent
    const learningRate = 0.01;
    const epochs = 1000;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const predictions = this.predict(features);
      
      // Calculate gradients
      const weightGradients = new Array(numFeatures).fill(0);
      let biasGradient = 0;

      for (let i = 0; i < n; i++) {
        const error = predictions[i] - targets[i];
        for (let j = 0; j < numFeatures; j++) {
          weightGradients[j] += error * features[i][j];
        }
        biasGradient += error;
      }

      // Update weights
      for (let j = 0; j < numFeatures; j++) {
        this.weights[j] -= learningRate * weightGradients[j] / n;
      }
      this.bias -= learningRate * biasGradient / n;
    }
  }

  predict(features: number[][]): number[] {
    return features.map(feature => {
      const sum = feature.reduce((acc, val, idx) => acc + val * this.weights[idx], 0);
      return sum + this.bias;
    });
  }

  score(features: number[][], targets: number[]): number {
    const predictions = this.predict(features);
    const totalSumSquares = targets.reduce((sum, target) => {
      const mean = NumpyLike.mean(targets);
      return sum + Math.pow(target - mean, 2);
    }, 0);
    
    const residualSumSquares = predictions.reduce((sum, pred, idx) => {
      return sum + Math.pow(targets[idx] - pred, 2);
    }, 0);

    return 1 - (residualSumSquares / totalSumSquares);
  }
}

/**
 * Kenyan crop analysis utilities
 */
export class KenyanCropAnalyzer {
  static analyzeYieldByRegion(cropData: CropData[]): { [region: string]: number } {
    const groupedData = PandasLike.groupBy(cropData, (item) => item.region);
    const results: { [region: string]: number } = {};
    
    Object.entries(groupedData).forEach(([region, crops]) => {
      const yields = crops.map(crop => crop.yield);
      results[region] = NumpyLike.mean(yields);
    });
    
    return results;
  }

  static predictOptimalPlantingDate(weatherData: WeatherData[], cropType: string): string {
    // Simple heuristic for optimal planting based on rainfall and temperature
    const optimalTemp = cropType === "Maize" ? 25 : cropType === "Coffee" ? 20 : 22;
    const minRainfall = cropType === "Maize" ? 50 : cropType === "Coffee" ? 100 : 40;

    const suitableDates = PandasLike.filter(weatherData, (data) => 
      Math.abs(data.temperature - optimalTemp) < 5 && data.rainfall >= minRainfall
    );

    return suitableDates.length > 0 ? suitableDates[0].date : "No suitable date found";
  }

  static analyzeSoilHealth(soilData: SoilData[]): {
    averagePh: number;
    nutrientStatus: { nitrogen: string; phosphorus: string; potassium: string };
    recommendations: string[];
  } {
    const avgPh = NumpyLike.mean(soilData.map(s => s.ph));
    const avgN = NumpyLike.mean(soilData.map(s => s.nitrogen));
    const avgP = NumpyLike.mean(soilData.map(s => s.phosphorus));
    const avgK = NumpyLike.mean(soilData.map(s => s.potassium));

    const recommendations: string[] = [];
    
    if (avgPh < 6.0) recommendations.push("Apply lime to increase soil pH");
    if (avgPh > 7.5) recommendations.push("Apply sulfur to decrease soil pH");
    if (avgN < 20) recommendations.push("Apply nitrogen-rich fertilizer");
    if (avgP < 15) recommendations.push("Apply phosphorus fertilizer");
    if (avgK < 100) recommendations.push("Apply potassium fertilizer");

    return {
      averagePh: avgPh,
      nutrientStatus: {
        nitrogen: avgN < 20 ? "Low" : avgN > 40 ? "High" : "Adequate",
        phosphorus: avgP < 15 ? "Low" : avgP > 30 ? "High" : "Adequate",
        potassium: avgK < 100 ? "Low" : avgK > 200 ? "High" : "Adequate"
      },
      recommendations
    };
  }

  static detectDiseaseRisk(cropData: CropData[], weatherData: WeatherData[]): {
    riskLevel: "Low" | "Medium" | "High";
    conditions: string[];
    recommendations: string[];
  } {
    const avgHumidity = NumpyLike.mean(weatherData.map(w => w.humidity));
    const avgTemp = NumpyLike.mean(weatherData.map(w => w.temperature));
    const recentRainfall = NumpyLike.sum(weatherData.slice(-7).map(w => w.rainfall));

    let riskLevel: "Low" | "Medium" | "High" = "Low";
    const conditions: string[] = [];
    const recommendations: string[] = [];

    if (avgHumidity > 80) {
      conditions.push("High humidity levels");
      riskLevel = "Medium";
    }

    if (avgTemp > 25 && avgHumidity > 70) {
      conditions.push("Hot and humid conditions");
      riskLevel = "High";
    }

    if (recentRainfall > 100) {
      conditions.push("Excessive rainfall");
      riskLevel = riskLevel === "High" ? "High" : "Medium";
    }

    if (riskLevel === "High") {
      recommendations.push("Apply preventive fungicides");
      recommendations.push("Improve field drainage");
      recommendations.push("Increase air circulation");
    } else if (riskLevel === "Medium") {
      recommendations.push("Monitor crops closely");
      recommendations.push("Prepare fungicide treatment");
    }

    return { riskLevel, conditions, recommendations };
  }
}

// Sample data generators for testing
export class DataGenerator {
  static generateSampleCropData(count: number): CropData[] {
    const crops = ["Maize", "Coffee", "Beans", "Tomato", "Potato"];
    const regions = ["Central", "Eastern", "Western", "Rift Valley", "Coast"];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `crop_${i}`,
      name: crops[Math.floor(Math.random() * crops.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      plantingDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      harvestDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      yield: Math.random() * 50 + 10,
      rainfall: Math.random() * 200 + 50,
      temperature: Math.random() * 15 + 15,
      soilPh: Math.random() * 3 + 5,
      fertilizer: "NPK 17:17:17",
      pesticides: ["Neem oil", "Bt spray"],
      diseases: Math.random() > 0.7 ? ["Blight"] : []
    }));
  }

  static generateSampleWeatherData(days: number): WeatherData[] {
    const regions = ["Central", "Eastern", "Western", "Rift Valley", "Coast"];
    
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      return {
        date: date.toISOString().split('T')[0],
        temperature: Math.random() * 15 + 15,
        humidity: Math.random() * 40 + 40,
        rainfall: Math.random() * 20,
        windSpeed: Math.random() * 10 + 2,
        region: regions[Math.floor(Math.random() * regions.length)]
      };
    });
  }
}
