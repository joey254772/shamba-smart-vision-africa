
/**
 * Machine Learning Utilities for Kenyan Agriculture
 * Python-like ML implementations using TypeScript
 */

export interface CropData {
  id: string;
  name: string;
  region: string;
  plantingDate: string;
  harvestDate: string;
  cropYield: number; // renamed from yield
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
 * Matrix operations similar to NumPy
 */
export class Matrix {
  data: number[][];
  rows: number;
  cols: number;

  constructor(data: number[][]) {
    this.data = data;
    this.rows = data.length;
    this.cols = data[0]?.length || 0;
  }

  static zeros(rows: number, cols: number): Matrix {
    const data = Array(rows).fill(null).map(() => Array(cols).fill(0));
    return new Matrix(data);
  }

  static ones(rows: number, cols: number): Matrix {
    const data = Array(rows).fill(null).map(() => Array(cols).fill(1));
    return new Matrix(data);
  }

  static random(rows: number, cols: number): Matrix {
    const data = Array(rows).fill(null).map(() => 
      Array(cols).fill(0).map(() => Math.random())
    );
    return new Matrix(data);
  }

  multiply(other: Matrix): Matrix {
    if (this.cols !== other.rows) {
      throw new Error("Matrix dimensions don't match for multiplication");
    }
    
    const result = Matrix.zeros(this.rows, other.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < other.cols; j++) {
        for (let k = 0; k < this.cols; k++) {
          result.data[i][j] += this.data[i][k] * other.data[k][j];
        }
      }
    }
    return result;
  }

  transpose(): Matrix {
    const result = Matrix.zeros(this.cols, this.rows);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[j][i] = this.data[i][j];
      }
    }
    return result;
  }

  add(other: Matrix): Matrix {
    const result = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = this.data[i][j] + other.data[i][j];
      }
    }
    return result;
  }

  subtract(other: Matrix): Matrix {
    const result = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = this.data[i][j] - other.data[i][j];
      }
    }
    return result;
  }

  scale(scalar: number): Matrix {
    const result = Matrix.zeros(this.rows, this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.data[i][j] = this.data[i][j] * scalar;
      }
    }
    return result;
  }
}

/**
 * Linear Regression Implementation (Similar to scikit-learn)
 */
export class LinearRegression {
  weights: Matrix;
  bias: number;
  fitted: boolean;

  constructor() {
    this.weights = new Matrix([]);
    this.bias = 0;
    this.fitted = false;
  }

  fit(X: Matrix, y: number[]): void {
    // Add bias column to X
    const XWithBias = this.addBiasColumn(X);
    
    // Normal equation: θ = (X^T * X)^(-1) * X^T * y
    const XT = XWithBias.transpose();
    const XTX = XT.multiply(XWithBias);
    const XTXInv = this.pseudoInverse(XTX);
    const yMatrix = new Matrix(y.map(val => [val]));
    const theta = XTXInv.multiply(XT).multiply(yMatrix);
    
    this.bias = theta.data[0][0];
    this.weights = new Matrix(theta.data.slice(1));
    this.fitted = true;
  }

  predict(X: Matrix): number[] {
    if (!this.fitted) {
      throw new Error("Model must be fitted before prediction");
    }
    
    const predictions: number[] = [];
    for (let i = 0; i < X.rows; i++) {
      let prediction = this.bias;
      for (let j = 0; j < X.cols; j++) {
        prediction += X.data[i][j] * this.weights.data[j][0];
      }
      predictions.push(prediction);
    }
    return predictions;
  }

  score(X: Matrix, y: number[]): number {
    const predictions = this.predict(X);
    const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    let totalSumSquares = 0;
    let residualSumSquares = 0;
    
    for (let i = 0; i < y.length; i++) {
      totalSumSquares += Math.pow(y[i] - yMean, 2);
      residualSumSquares += Math.pow(y[i] - predictions[i], 2);
    }
    
    return 1 - (residualSumSquares / totalSumSquares);
  }

  private addBiasColumn(X: Matrix): Matrix {
    const XWithBias = Matrix.zeros(X.rows, X.cols + 1);
    for (let i = 0; i < X.rows; i++) {
      XWithBias.data[i][0] = 1; // bias column
      for (let j = 0; j < X.cols; j++) {
        XWithBias.data[i][j + 1] = X.data[i][j];
      }
    }
    return XWithBias;
  }

  private pseudoInverse(matrix: Matrix): Matrix {
    // Simplified pseudo-inverse using Gauss-Jordan elimination
    const n = matrix.rows;
    const augmented = Matrix.zeros(n, 2 * n);
    
    // Create augmented matrix [A|I]
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        augmented.data[i][j] = matrix.data[i][j];
        augmented.data[i][j + n] = i === j ? 1 : 0;
      }
    }
    
    // Gauss-Jordan elimination
    for (let i = 0; i < n; i++) {
      // Make diagonal element 1
      const pivot = augmented.data[i][i];
      if (Math.abs(pivot) < 1e-10) continue;
      
      for (let j = 0; j < 2 * n; j++) {
        augmented.data[i][j] /= pivot;
      }
      
      // Make other elements in column 0
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented.data[k][i];
          for (let j = 0; j < 2 * n; j++) {
            augmented.data[k][j] -= factor * augmented.data[i][j];
          }
        }
      }
    }
    
    // Extract inverse matrix
    const inverse = Matrix.zeros(n, n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inverse.data[i][j] = augmented.data[i][j + n];
      }
    }
    
    return inverse;
  }
}

/**
 * Decision Tree Classifier
 */
export class DecisionTreeClassifier {
  tree: any;
  fitted: boolean;

  constructor() {
    this.tree = null;
    this.fitted = false;
  }

  fit(X: Matrix, y: string[]): void {
    this.tree = this.buildTree(X, y);
    this.fitted = true;
  }

  predict(X: Matrix): string[] {
    if (!this.fitted) {
      throw new Error("Model must be fitted before prediction");
    }
    
    const predictions: string[] = [];
    for (let i = 0; i < X.rows; i++) {
      const sample = X.data[i];
      predictions.push(this.predictSample(sample, this.tree));
    }
    return predictions;
  }

  private buildTree(X: Matrix, y: string[]): any {
    // Check if all labels are the same
    const uniqueLabels = [...new Set(y)];
    if (uniqueLabels.length === 1) {
      return { type: 'leaf', label: uniqueLabels[0] };
    }
    
    // Find best split
    const bestSplit = this.findBestSplit(X, y);
    if (!bestSplit) {
      // Return most common label
      const labelCounts = this.countLabels(y);
      const mostCommon = Object.keys(labelCounts).reduce((a, b) => 
        labelCounts[a] > labelCounts[b] ? a : b
      );
      return { type: 'leaf', label: mostCommon };
    }
    
    // Split data
    const { leftIndices, rightIndices } = this.splitData(X, bestSplit);
    const leftX = new Matrix(leftIndices.map(i => X.data[i]));
    const leftY = leftIndices.map(i => y[i]);
    const rightX = new Matrix(rightIndices.map(i => X.data[i]));
    const rightY = rightIndices.map(i => y[i]);
    
    return {
      type: 'node',
      feature: bestSplit.feature,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftX, leftY),
      right: this.buildTree(rightX, rightY)
    };
  }

  private findBestSplit(X: Matrix, y: string[]): any {
    let bestGini = Infinity;
    let bestSplit = null;
    
    for (let feature = 0; feature < X.cols; feature++) {
      const values = X.data.map(row => row[feature]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const gini = this.calculateGini(X, y, feature, threshold);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestSplit = { feature, threshold };
        }
      }
    }
    
    return bestSplit;
  }

  private calculateGini(X: Matrix, y: string[], feature: number, threshold: number): number {
    const { leftIndices, rightIndices } = this.splitData(X, { feature, threshold });
    
    if (leftIndices.length === 0 || rightIndices.length === 0) {
      return Infinity;
    }
    
    const leftY = leftIndices.map(i => y[i]);
    const rightY = rightIndices.map(i => y[i]);
    
    const leftGini = this.giniImpurity(leftY);
    const rightGini = this.giniImpurity(rightY);
    
    const totalSamples = y.length;
    const weightedGini = (leftY.length / totalSamples) * leftGini + 
                        (rightY.length / totalSamples) * rightGini;
    
    return weightedGini;
  }

  private splitData(X: Matrix, split: { feature: number, threshold: number }): 
    { leftIndices: number[], rightIndices: number[] } {
    const leftIndices: number[] = [];
    const rightIndices: number[] = [];
    
    for (let i = 0; i < X.rows; i++) {
      if (X.data[i][split.feature] <= split.threshold) {
        leftIndices.push(i);
      } else {
        rightIndices.push(i);
      }
    }
    
    return { leftIndices, rightIndices };
  }

  private giniImpurity(labels: string[]): number {
    const labelCounts = this.countLabels(labels);
    const total = labels.length;
    
    let gini = 1;
    for (const count of Object.values(labelCounts)) {
      const probability = count / total;
      gini -= probability * probability;
    }
    
    return gini;
  }

  private countLabels(labels: string[]): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    for (const label of labels) {
      counts[label] = (counts[label] || 0) + 1;
    }
    return counts;
  }

  private predictSample(sample: number[], node: any): string {
    if (node.type === 'leaf') {
      return node.label;
    }
    
    if (sample[node.feature] <= node.threshold) {
      return this.predictSample(sample, node.left);
    } else {
      return this.predictSample(sample, node.right);
    }
  }
}

/**
 * Kenyan Agriculture ML Utilities
 */
export class KenyanAgricultureML {
  static prepareCropData(crops: CropData[]): { features: Matrix, targets: number[] } {
    const features: number[][] = [];
    const targets: number[] = [];
    
    for (const crop of crops) {
      const plantingMonth = new Date(crop.plantingDate).getMonth();
      const harvestMonth = new Date(crop.harvestDate).getMonth();
      const growthPeriod = harvestMonth - plantingMonth;
      
      features.push([
        crop.rainfall,
        crop.temperature,
        crop.soilPh,
        plantingMonth,
        growthPeriod,
        crop.pesticides.length,
        crop.diseases.length
      ]);
      
      targets.push(crop.cropYield);
    }
    
    return {
      features: new Matrix(features),
      targets
    };
  }

  static predictCropYield(
    rainfall: number,
    temperature: number,
    soilPh: number,
    plantingMonth: number,
    growthPeriod: number,
    pesticideCount: number,
    diseaseCount: number,
    model: LinearRegression
  ): number {
    const features = new Matrix([[
      rainfall, temperature, soilPh, plantingMonth, 
      growthPeriod, pesticideCount, diseaseCount
    ]]);
    
    return model.predict(features)[0];
  }

  static classifyDiseaseRisk(
    humidity: number,
    temperature: number,
    rainfall: number,
    soilMoisture: number
  ): string {
    // Simple rule-based classification for disease risk
    let riskScore = 0;
    
    if (humidity > 80) riskScore += 2;
    else if (humidity > 60) riskScore += 1;
    
    if (temperature > 25 && temperature < 30) riskScore += 2;
    else if (temperature > 30) riskScore += 1;
    
    if (rainfall > 100) riskScore += 2;
    else if (rainfall > 50) riskScore += 1;
    
    if (soilMoisture > 80) riskScore += 1;
    
    if (riskScore >= 6) return "High Risk";
    else if (riskScore >= 3) return "Medium Risk";
    else return "Low Risk";
  }

  static recommendTreatment(
    diseaseType: string,
    severity: string,
    cropType: string
  ): string[] {
    const treatments: { [key: string]: string[] } = {
      "Early Blight": [
        "Apply copper-based fungicide",
        "Improve air circulation",
        "Remove infected plant debris",
        "Use drip irrigation to avoid leaf wetness"
      ],
      "Late Blight": [
        "Apply systemic fungicide",
        "Destroy infected plants immediately",
        "Avoid overhead watering",
        "Apply preventive copper sprays"
      ],
      "Bacterial Wilt": [
        "Remove and destroy infected plants",
        "Improve soil drainage",
        "Rotate with non-host crops",
        "Use resistant varieties"
      ],
      "Powdery Mildew": [
        "Apply sulfur-based fungicide",
        "Increase plant spacing",
        "Prune for better air circulation",
        "Apply neem oil spray"
      ]
    };
    
    return treatments[diseaseType] || [
      "Consult local agricultural extension officer",
      "Improve general plant health",
      "Monitor closely for symptom development"
    ];
  }
}

// Sample data for testing
export const sampleKenyanCrops: CropData[] = [
  {
    id: "1",
    name: "Maize",
    region: "Central Kenya",
    plantingDate: "2024-03-15",
    harvestDate: "2024-08-15",
    cropYield: 45.2,
    rainfall: 850,
    temperature: 24,
    soilPh: 6.2,
    fertilizer: "NPK 17:17:17",
    pesticides: ["Bt spray", "Neem oil"],
    diseases: ["Early Blight"]
  },
  {
    id: "2",
    name: "Coffee",
    region: "Central Kenya",
    plantingDate: "2024-04-01",
    harvestDate: "2024-12-01",
    cropYield: 12.8,
    rainfall: 1200,
    temperature: 20,
    soilPh: 5.8,
    fertilizer: "Organic compost",
    pesticides: ["Copper spray"],
    diseases: []
  },
  {
    id: "3",
    name: "Beans",
    region: "Eastern Kenya",
    plantingDate: "2024-02-20",
    harvestDate: "2024-06-20",
    cropYield: 18.5,
    rainfall: 600,
    temperature: 26,
    soilPh: 6.5,
    fertilizer: "DAP",
    pesticides: ["Organic pyrethrum"],
    diseases: ["Bacterial Wilt"]
  }
];

export default KenyanAgricultureML;
