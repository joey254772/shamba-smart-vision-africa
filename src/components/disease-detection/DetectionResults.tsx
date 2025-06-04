
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DetectionResult {
  diseaseName: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
}

interface DetectionResultsProps {
  results?: DetectionResult[];
  loading?: boolean;
}

const DetectionResults = ({ results, loading }: DetectionResultsProps) => {
  // Placeholder data when no real results are available
  const placeholderResults: DetectionResult[] = [
    {
      diseaseName: "Tomato Late Blight",
      confidence: 89,
      severity: "high",
      description:
        "Late blight is a destructive disease affecting tomatoes. The pathogen (Phytophthora infestans) attacks leaves, stems, and fruits, causing rapid plant death in severe cases.",
    },
    {
      diseaseName: "Powdery Mildew",
      confidence: 7,
      severity: "low",
      description:
        "Powdery mildew appears as white powdery spots on leaves and stems. It's common in warm, dry climates with cool nights.",
    },
    {
      diseaseName: "Bacterial Spot",
      confidence: 4,
      severity: "low",
      description:
        "Bacterial spot causes small, dark lesions on leaves, stems, and fruits. It's spread by water and can survive in plant debris.",
    },
  ];

  const displayResults = results || placeholderResults;

  const getSeverityColor = (severity: DetectionResult["severity"]) => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-muted-foreground";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-red-500";
    if (confidence >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Detection Results</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-agriculture-primary/30 border-t-agriculture-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Analyzing image...</p>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {displayResults.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 border rounded-lg",
                    index === 0
                      ? "border-agriculture-danger/50 bg-agriculture-danger/5"
                      : "border-gray-200"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">
                      {result.diseaseName}
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Detected
                        </span>
                      )}
                    </h3>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        getSeverityColor(result.severity)
                      )}
                    >
                      {result.severity} severity
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence</span>
                      <span className="font-medium">{result.confidence}%</span>
                    </div>
                    <Progress
                      value={result.confidence}
                      className="h-2"
                      indicatorClassName={getConfidenceColor(result.confidence)}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {result.description}
                  </p>

                  {index === 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        View Treatment Options
                      </Button>
                      <Button
                        size="sm"
                        className="bg-agriculture-primary hover:bg-agriculture-primary/90 text-xs"
                      >
                        Get Expert Advice
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Prevention Tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Improve air circulation around plants</li>
                <li>• Water at the base of plants to keep foliage dry</li>
                <li>• Remove and destroy infected plant parts</li>
                <li>• Apply preventative fungicide before disease onset</li>
                <li>• Practice crop rotation to reduce pathogen buildup</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DetectionResults;
