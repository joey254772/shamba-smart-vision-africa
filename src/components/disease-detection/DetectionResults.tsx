
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Leaf, 
  Droplets, 
  ThermometerSun,
  Calendar,
  MapPin,
  Phone,
  ExternalLink,
  Activity,
  Shield,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface DetectionResultsProps {
  results: any;
  isLoading: boolean;
}

const DetectionResults = ({ results, isLoading }: DetectionResultsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);

  // Mock suppliers data for Kenya
  const suppliers = [
    {
      name: "Kenya Agro Supplies Ltd",
      location: "Nairobi",
      phone: "+254 700 123 456",
      speciality: "Fungicides & Pesticides",
      distance: "2.5 km"
    },
    {
      name: "Farmers Choice Agro",
      location: "Nakuru",
      phone: "+254 722 987 654",
      speciality: "Organic Solutions",
      distance: "5.1 km"
    },
    {
      name: "East Africa Seeds Co.",
      location: "Eldoret",
      phone: "+254 733 456 789",
      speciality: "Seeds & Fertilizers",
      distance: "8.3 km"
    }
  ];

  const handleGetTreatmentGuide = () => {
    navigate("/treatment-guide");
    toast({
      title: "Treatment Guide",
      description: "Opening detailed treatment protocols for " + results?.disease,
    });
  };

  const handleReportToCommunity = () => {
    navigate("/community");
    toast({
      title: "Community Alert",
      description: "Sharing disease report with local farming community",
    });
  };

  const handleFindSupplier = () => {
    setSupplierDialogOpen(true);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      case "none": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Activity className="h-5 w-5 mr-2 text-agriculture-primary animate-pulse" />
            Advanced AI Analysis in Progress...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Color Pattern Analysis</span>
                <span>Processing...</span>
              </div>
              <Progress value={25} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Disease Pattern Recognition</span>
                <span>Analyzing...</span>
              </div>
              <Progress value={60} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Treatment Recommendation</span>
                <span>Generating...</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
            <p className="text-sm text-muted-foreground">
              Our enhanced AI is performing comprehensive analysis of your crop image...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-6 sm:py-8">
            <Leaf className="h-10 w-10 sm:h-12 sm:w-12 text-agriculture-primary mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Ready for Analysis</h3>
            <p className="text-sm text-muted-foreground px-4">
              Upload a clear, well-lit image of your crop for accurate disease detection
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isHealthy = results.disease === "Healthy Plant";

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Shield className="h-5 w-5 mr-2 text-agriculture-primary" />
            Enhanced Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-lg p-3 sm:p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  {isHealthy ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <h3 className="text-base sm:text-lg font-semibold">{results.disease}</h3>
                </div>
                <Badge className={getSeverityColor(results.severity)}>
                  {results.severity?.toUpperCase()} {results.severity !== "None" ? "RISK" : ""}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Analysis Confidence</span>
                  <span className={`font-medium ${getConfidenceColor(results.confidence)}`}>
                    {results.confidence?.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={results.confidence} 
                  className="w-full h-3"
                />
                <p className="text-xs text-muted-foreground">
                  {results.confidence >= 85 ? "High confidence detection" : 
                   results.confidence >= 70 ? "Moderate confidence - consider additional analysis" :
                   "Low confidence - please retake image with better lighting"}
                </p>
              </div>

              {results.analysisDetails && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <h4 className="font-medium text-sm">Analysis Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Healthy Tissue: </span>
                      <span className="font-medium">{results.analysisDetails.colorAnalysis?.healthyGreen}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Disease Signs: </span>
                      <span className="font-medium">{results.analysisDetails.colorAnalysis?.diseaseIndicators}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Overall Health: </span>
                      <span className="font-medium">{results.analysisDetails.colorAnalysis?.overallHealth}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Treatment Urgency: </span>
                      <span className="font-medium">{results.analysisDetails.treatmentUrgency}</span>
                    </div>
                  </div>
                </div>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Expert Recommendations:</strong>
                  <ul className="mt-2 space-y-1">
                    {results.recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm">• {rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

              {results.analysisDetails?.riskFactors && (
                <div className="border-l-4 border-yellow-400 pl-3">
                  <h4 className="font-medium text-sm text-yellow-800 mb-1">Risk Factors</h4>
                  <ul className="text-xs space-y-1">
                    {results.analysisDetails.riskFactors.map((factor: string, index: number) => (
                      <li key={index} className="text-yellow-700">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-2">
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <ThermometerSun className="h-4 w-4 flex-shrink-0" />
                  <span>Weather Impact: Moderate</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Droplets className="h-4 w-4 flex-shrink-0" />
                  <span>Humidity: 75%</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span>Action needed: {results.analysisDetails?.treatmentUrgency || "Soon"}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="bg-agriculture-primary hover:bg-agriculture-primary/90 flex-1"
                  onClick={handleGetTreatmentGuide}
                >
                  Get Treatment Guide
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleReportToCommunity}
                >
                  Report to Community
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleFindSupplier}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Find Supplier
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 sm:p-4 bg-agriculture-primary/10 rounded-lg">
            <h4 className="font-medium text-agriculture-primary mb-2 text-sm sm:text-base">
              AI Analysis Summary
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isHealthy ? 
                "Your crop appears healthy! Continue with regular monitoring and preventive care practices." :
                `Detected ${results.disease} with ${results.confidence?.toFixed(1)}% confidence. ${results.analysisDetails?.treatmentUrgency} action recommended. Follow the treatment guide for best results.`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Dialog */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-agriculture-primary" />
              Nearby Agricultural Suppliers
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {suppliers.map((supplier, index) => (
              <Card key={index} className="p-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{supplier.name}</h4>
                    <Badge variant="outline" className="text-xs">{supplier.distance}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{supplier.speciality}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{supplier.location}</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => setSupplierDialogOpen(false)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View All Suppliers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetectionResults;
