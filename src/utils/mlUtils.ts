
/**
 * Machine Learning Utilities - Python scikit-learn inspired functions
 * Provides ML capabilities for crop disease detection and yield prediction
 */

export interface TrainingData {
  features: number[][];
  labels: number[];
}

export interface ClassificationResult {
  prediction: number;
  confidence: number;
  probabilities: number[];
}

/**
 * K-Nearest Neighbors Classifier (similar to sklearn.neighbors.KNeighborsClassifier)
 */
export class KNeighborsClassifier {
  private trainingData: TrainingData | null = null;
  private k: number;

  constructor(k: number = 3) {
    this.k = k;
  }

  fit(features: number[][], labels: number[]): void {
    this.trainingData = { features, labels };
  }

  predict(testFeatures: number[][]): number[] {
    if (!this.trainingData) throw new Error("Model not trained");
    
    return testFeatures.map(testFeature => {
      const distances = this.trainingData!.features.map((trainFeature, idx) => ({
        distance: this.euclideanDistance(testFeature, trainFeature),
        label: this.trainingData!.labels[idx]
      }));

      distances.sort((a, b) => a.distance - b.distance);
      const nearestK = distances.slice(0, this.k);
      
      // Majority vote
      const votes: { [label: number]: number } = {};
      nearestK.forEach(neighbor => {
        votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
      });

      return parseInt(Object.keys(votes).reduce((a, b) => votes[parseInt(a)] > votes[parseInt(b)] ? a : b));
    });
  }

  predictProba(testFeatures: number[][]): ClassificationResult[] {
    if (!this.trainingData) throw new Error("Model not trained");
    
    return testFeatures.map(testFeature => {
      const distances = this.trainingData!.features.map((trainFeature, idx) => ({
        distance: this.euclideanDistance(testFeature, trainFeature),
        label: this.trainingData!.labels[idx]
      }));

      distances.sort((a, b) => a.distance - b.distance);
      const nearestK = distances.slice(0, this.k);
      
      const votes: { [label: number]: number } = {};
      nearestK.forEach(neighbor => {
        votes[neighbor.label] = (votes[neighbor.label] || 0) + 1;
      });

      const uniqueLabels = [...new Set(this.trainingData!.labels)].sort();
      const probabilities = uniqueLabels.map(label => (votes[label] || 0) / this.k);
      const prediction = parseInt(Object.keys(votes).reduce((a, b) => votes[parseInt(a)] > votes[parseInt(b)] ? a : b));
      const confidence = Math.max(...probabilities);

      return { prediction, confidence, probabilities };
    });
  }

  private euclideanDistance(a: number[], b: number[]): number {
    return Math.sqrt(a.reduce((sum, val, idx) => sum + Math.pow(val - b[idx], 2), 0));
  }
}

/**
 * Random Forest Classifier (simplified version)
 */
export class RandomForestClassifier {
  private trees: DecisionTree[] = [];
  private nEstimators: number;

  constructor(nEstimators: number = 10) {
    this.nEstimators = nEstimators;
  }

  fit(features: number[][], labels: number[]): void {
    this.trees = [];
    
    for (let i = 0; i < this.nEstimators; i++) {
      const tree = new DecisionTree();
      
      // Bootstrap sampling
      const bootstrapIndices = Array.from(
        { length: features.length }, 
        () => Math.floor(Math.random() * features.length)
      );
      
      const bootstrapFeatures = bootstrapIndices.map(idx => features[idx]);
      const bootstrapLabels = bootstrapIndices.map(idx => labels[idx]);
      
      tree.fit(bootstrapFeatures, bootstrapLabels);
      this.trees.push(tree);
    }
  }

  predict(testFeatures: number[][]): number[] {
    const treePredictions = this.trees.map(tree => tree.predict(testFeatures));
    
    return testFeatures.map((_, idx) => {
      const votes: { [label: number]: number } = {};
      treePredictions.forEach(predictions => {
        const prediction = predictions[idx];
        votes[prediction] = (votes[prediction] || 0) + 1;
      });
      
      return parseInt(Object.keys(votes).reduce((a, b) => votes[parseInt(a)] > votes[parseInt(b)] ? a : b));
    });
  }
}

/**
 * Simple Decision Tree implementation
 */
class DecisionTree {
  private root: TreeNode | null = null;

  fit(features: number[][], labels: number[]): void {
    this.root = this.buildTree(features, labels, 0);
  }

  predict(testFeatures: number[][]): number[] {
    return testFeatures.map(feature => this.predictSingle(feature, this.root!));
  }

  private buildTree(features: number[][], labels: number[], depth: number, maxDepth: number = 5): TreeNode {
    const uniqueLabels = [...new Set(labels)];
    
    if (uniqueLabels.length === 1 || depth >= maxDepth) {
      return { isLeaf: true, prediction: this.mostCommonLabel(labels) };
    }

    const bestSplit = this.findBestSplit(features, labels);
    if (!bestSplit) {
      return { isLeaf: true, prediction: this.mostCommonLabel(labels) };
    }

    const leftIndices: number[] = [];
    const rightIndices: number[] = [];
    
    features.forEach((feature, idx) => {
      if (feature[bestSplit.featureIndex] <= bestSplit.threshold) {
        leftIndices.push(idx);
      } else {
        rightIndices.push(idx);
      }
    });

    const leftFeatures = leftIndices.map(idx => features[idx]);
    const leftLabels = leftIndices.map(idx => labels[idx]);
    const rightFeatures = rightIndices.map(idx => features[idx]);
    const rightLabels = rightIndices.map(idx => labels[idx]);

    return {
      isLeaf: false,
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftFeatures, leftLabels, depth + 1, maxDepth),
      right: this.buildTree(rightFeatures, rightLabels, depth + 1, maxDepth)
    };
  }

  private findBestSplit(features: number[][], labels: number[]): { featureIndex: number; threshold: number } | null {
    let bestGini = Infinity;
    let bestSplit: { featureIndex: number; threshold: number } | null = null;

    const numFeatures = features[0].length;
    
    for (let featureIdx = 0; featureIdx < numFeatures; featureIdx++) {
      const values = features.map(f => f[featureIdx]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        const gini = this.calculateGini(features, labels, featureIdx, threshold);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestSplit = { featureIndex: featureIdx, threshold };
        }
      }
    }

    return bestSplit;
  }

  private calculateGini(features: number[][], labels: number[], featureIndex: number, threshold: number): number {
    const leftLabels: number[] = [];
    const rightLabels: number[] = [];
    
    features.forEach((feature, idx) => {
      if (feature[featureIndex] <= threshold) {
        leftLabels.push(labels[idx]);
      } else {
        rightLabels.push(labels[idx]);
      }
    });

    const totalSize = labels.length;
    const leftSize = leftLabels.length;
    const rightSize = rightLabels.length;
    
    if (leftSize === 0 || rightSize === 0) return Infinity;

    const leftGini = this.giniImpurity(leftLabels);
    const rightGini = this.giniImpurity(rightLabels);
    
    return (leftSize / totalSize) * leftGini + (rightSize / totalSize) * rightGini;
  }

  private giniImpurity(labels: number[]): number {
    const labelCounts: { [label: number]: number } = {};
    labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    let gini = 1;
    Object.values(labelCounts).forEach(count => {
      const probability = count / labels.length;
      gini -= probability * probability;
    });

    return gini;
  }

  private mostCommonLabel(labels: number[]): number {
    const labelCounts: { [label: number]: number } = {};
    labels.forEach(label => {
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });

    return parseInt(Object.keys(labelCounts).reduce((a, b) => labelCounts[parseInt(a)] > labelCounts[parseInt(b)] ? a : b));
  }

  private predictSingle(feature: number[], node: TreeNode): number {
    if (node.isLeaf) {
      return node.prediction!;
    }

    if (feature[node.featureIndex!] <= node.threshold!) {
      return this.predictSingle(feature, node.left!);
    } else {
      return this.predictSingle(feature, node.right!);
    }
  }
}

interface TreeNode {
  isLeaf: boolean;
  prediction?: number;
  featureIndex?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

/**
 * Plant Disease Detection using ML
 */
export class PlantDiseaseDetector {
  private model: RandomForestClassifier;
  private diseaseMap: { [key: number]: string } = {
    0: "Healthy",
    1: "Early Blight",
    2: "Late Blight", 
    3: "Bacterial Spot",
    4: "Mosaic Virus",
    5: "Leaf Mold"
  };

  constructor() {
    this.model = new RandomForestClassifier(20);
    this.trainModel();
  }

  private trainModel(): void {
    // Simulated training data for plant disease detection
    // In a real scenario, this would come from actual image features
    const features: number[][] = [];
    const labels: number[] = [];

    // Generate synthetic training data
    for (let i = 0; i < 1000; i++) {
      const diseaseClass = Math.floor(Math.random() * 6);
      const feature = this.generateSyntheticFeatures(diseaseClass);
      features.push(feature);
      labels.push(diseaseClass);
    }

    this.model.fit(features, labels);
  }

  private generateSyntheticFeatures(diseaseClass: number): number[] {
    // Simulate image features: color ratios, texture measures, shape descriptors
    const baseFeatures = [
      Math.random(), // Red channel ratio
      Math.random(), // Green channel ratio  
      Math.random(), // Blue channel ratio
      Math.random(), // Texture uniformity
      Math.random(), // Edge density
      Math.random(), // Spot count
      Math.random(), // Leaf area affected
      Math.random()  // Color variance
    ];

    // Modify features based on disease class
    switch (diseaseClass) {
      case 1: // Early Blight
        baseFeatures[0] += 0.3; // More red
        baseFeatures[5] += 0.4; // More spots
        break;
      case 2: // Late Blight
        baseFeatures[1] -= 0.2; // Less green
        baseFeatures[6] += 0.5; // More area affected
        break;
      case 3: // Bacterial Spot
        baseFeatures[5] += 0.6; // Many spots
        baseFeatures[4] += 0.3; // More edges
        break;
      case 4: // Mosaic Virus
        baseFeatures[7] += 0.4; // High color variance
        baseFeatures[1] -= 0.3; // Reduced green
        break;
      case 5: // Leaf Mold
        baseFeatures[1] -= 0.4; // Much less green
        baseFeatures[3] -= 0.3; // Less uniform texture
        break;
    }

    return baseFeatures.map(f => Math.max(0, Math.min(1, f))); // Clamp to [0,1]
  }

  detectDisease(imageFeatures: number[]): {
    disease: string;
    confidence: number;
    severity: "Low" | "Medium" | "High";
    recommendations: string[];
  } {
    const result = this.model.predict([imageFeatures])[0];
    const disease = this.diseaseMap[result];
    
    // Calculate confidence and severity based on feature values
    const severity = this.calculateSeverity(imageFeatures);
    const confidence = Math.random() * 0.3 + 0.7; // Simulate 70-100% confidence
    
    const recommendations = this.getRecommendations(disease, severity);

    return { disease, confidence, severity, recommendations };
  }

  private calculateSeverity(features: number[]): "Low" | "Medium" | "High" {
    const areaAffected = features[6]; // Leaf area affected
    const spotCount = features[5]; // Spot count
    
    const severityScore = (areaAffected + spotCount) / 2;
    
    if (severityScore > 0.7) return "High";
    if (severityScore > 0.4) return "Medium";
    return "Low";
  }

  private getRecommendations(disease: string, severity: "Low" | "Medium" | "High"): string[] {
    const baseRecommendations: { [key: string]: string[] } = {
      "Early Blight": [
        "Apply copper-based fungicide",
        "Improve air circulation",
        "Remove affected leaves",
        "Avoid overhead watering"
      ],
      "Late Blight": [
        "Apply systemic fungicide immediately",
        "Remove infected plants",
        "Improve drainage",
        "Monitor weather conditions"
      ],
      "Bacterial Spot": [
        "Apply copper-based bactericide",
        "Remove infected plant material",
        "Avoid working in wet conditions",
        "Use disease-free seeds"
      ],
      "Mosaic Virus": [
        "Remove infected plants immediately",
        "Control aphid vectors",
        "Use virus-free planting material",
        "Practice crop rotation"
      ],
      "Leaf Mold": [
        "Improve greenhouse ventilation",
        "Reduce humidity levels",
        "Apply appropriate fungicide",
        "Remove lower leaves"
      ],
      "Healthy": [
        "Continue current management practices",
        "Monitor regularly for changes",
        "Maintain proper nutrition",
        "Ensure adequate water supply"
      ]
    };

    let recommendations = baseRecommendations[disease] || [];
    
    if (severity === "High") {
      recommendations = [
        "URGENT: Take immediate action",
        ...recommendations,
        "Consider consulting agricultural extension officer"
      ];
    }

    return recommendations;
  }
}

/**
 * Crop Yield Predictor using ML
 */
export class CropYieldPredictor {
  private model: LinearRegression;

  constructor() {
    this.model = new LinearRegression();
    this.trainModel();
  }

  private trainModel(): void {
    // Generate synthetic training data for yield prediction
    const features: number[][] = [];
    const yields: number[] = [];

    for (let i = 0; i < 500; i++) {
      const rainfall = Math.random() * 200 + 300; // 300-500mm
      const temperature = Math.random() * 10 + 20; // 20-30°C
      const soilPh = Math.random() * 2 + 6; // 6-8 pH
      const fertilizer = Math.random() * 100 + 50; // 50-150 kg/ha
      
      // Calculate yield based on conditions
      let yield = 20; // Base yield
      yield += (rainfall - 400) * 0.05; // Rainfall effect
      yield += (25 - Math.abs(temperature - 25)) * 0.8; // Temperature effect
      yield += (7 - Math.abs(soilPh - 7)) * 3; // pH effect
      yield += fertilizer * 0.2; // Fertilizer effect
      yield += (Math.random() - 0.5) * 10; // Random noise
      
      features.push([rainfall, temperature, soilPh, fertilizer]);
      yields.push(Math.max(5, yield)); // Minimum yield of 5
    }

    this.model.fit(features, yields);
  }

  predictYield(conditions: {
    rainfall: number;
    temperature: number;
    soilPh: number;
    fertilizer: number;
  }): {
    predictedYield: number;
    confidence: number;
    factors: { factor: string; impact: string }[];
  } {
    const features = [[conditions.rainfall, conditions.temperature, conditions.soilPh, conditions.fertilizer]];
    const prediction = this.model.predict(features)[0];
    
    // Analyze impact factors
    const factors = [
      {
        factor: "Rainfall",
        impact: conditions.rainfall > 450 ? "Positive" : conditions.rainfall < 350 ? "Negative" : "Neutral"
      },
      {
        factor: "Temperature", 
        impact: Math.abs(conditions.temperature - 25) < 3 ? "Positive" : "Negative"
      },
      {
        factor: "Soil pH",
        impact: Math.abs(conditions.soilPh - 7) < 0.5 ? "Positive" : "Negative"
      },
      {
        factor: "Fertilizer",
        impact: conditions.fertilizer > 80 ? "Positive" : "Negative"
      }
    ];

    return {
      predictedYield: Math.round(prediction * 10) / 10,
      confidence: 0.85, // Simulated confidence
      factors
    };
  }
}

// Linear Regression implementation for crop yield prediction
class LinearRegression {
  private weights: number[] = [];
  private bias: number = 0;

  fit(features: number[][], targets: number[]): void {
    const n = features.length;
    const numFeatures = features[0].length;
    
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    const learningRate = 0.001;
    const epochs = 1000;

    for (let epoch = 0; epoch < epochs; epoch++) {
      const predictions = this.predict(features);
      
      const weightGradients = new Array(numFeatures).fill(0);
      let biasGradient = 0;

      for (let i = 0; i < n; i++) {
        const error = predictions[i] - targets[i];
        for (let j = 0; j < numFeatures; j++) {
          weightGradients[j] += error * features[i][j];
        }
        biasGradient += error;
      }

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
}
