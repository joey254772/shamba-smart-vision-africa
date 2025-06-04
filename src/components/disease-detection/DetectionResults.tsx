
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Leaf, 
  Droplets, 
  ThermometerSun,
  Calendar,
  MapPin
} from "lucide-react";

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  treatment: string;
  prevention: string;
}

interface DetectionResultsProps {
  results: DetectionResult[];
  isLoading: boolean;
}

const DetectionResults = ({ results, isLoading }: DetectionResultsProps) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-agriculture-primary" />
            Analyzing Image...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <Progress value={65} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Our AI is examining your crop image for signs of disease...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Healthy Crop Detected!</h3>
            <p className="text-muted-foreground">
              No diseases detected in your crop image. Your plants appear to be healthy.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="h-5 w-5 mr-2 text-agriculture-primary" />
            Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSeverityIcon(result.severity)}
                    <h3 className="text-lg font-semibold">{result.disease}</h3>
                  </div>
                  <Badge className={getSeverityColor(result.severity)}>
                    {result.severity.toUpperCase()} RISK
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Confidence Level</span>
                    <span className="font-medium">{result.confidence}%</span>
                  </div>
                  <Progress 
                    value={result.confidence} 
                    className="w-full h-2"
                  />
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Treatment:</strong> {result.treatment}
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">Prevention Tips</h4>
                  <p className="text-sm text-blue-800">{result.prevention}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ThermometerSun className="h-4 w-4" />
                    <span>Weather Impact: Moderate</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span>Humidity: 75%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Best treatment: Now</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" className="bg-agriculture-primary hover:bg-agriculture-primary/90">
                    Get Treatment Guide
                  </Button>
                  <Button size="sm" variant="outline">
                    Report to Community
                  </Button>
                  <Button size="sm" variant="outline">
                    <MapPin className="h-4 w-4 mr-1" />
                    Find Local Supplier
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-agriculture-primary/10 rounded-lg">
            <h4 className="font-medium text-agriculture-primary mb-2">AI Recommendation Summary</h4>
            <p className="text-sm text-muted-foreground">
              Based on the analysis, immediate treatment is recommended for detected diseases. 
              Monitor your crops closely and consider preventive measures for neighboring plants.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionResults;
