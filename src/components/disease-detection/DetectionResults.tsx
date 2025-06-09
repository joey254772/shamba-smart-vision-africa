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
  ExternalLink
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
      title: "Redirecting",
      description: "Opening treatment guide for your detected disease",
    });
  };

  const handleReportToCommunity = () => {
    navigate("/community");
    toast({
      title: "Community Reports",
      description: "Share your findings with the farming community",
    });
  };

  const handleFindSupplier = () => {
    setSupplierDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
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

  if (!results) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-6 sm:py-8">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-sm text-muted-foreground px-4">
              Upload an image to get started with AI disease detection
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Leaf className="h-5 w-5 mr-2 text-agriculture-primary" />
            Detection Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border rounded-lg p-3 sm:p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-base sm:text-lg font-semibold">{results.disease}</h3>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 self-start sm:self-auto">
                  {results.severity?.toUpperCase()} RISK
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Confidence Level</span>
                  <span className="font-medium">{results.confidence}%</span>
                </div>
                <Progress 
                  value={results.confidence} 
                  className="w-full h-2"
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Recommendations:</strong>
                  <ul className="mt-2 space-y-1">
                    {results.recommendations?.map((rec: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm">• {rec}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>

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
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>Best treatment: Now</span>
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
            <h4 className="font-medium text-agriculture-primary mb-2 text-sm sm:text-base">AI Recommendation Summary</h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Based on the analysis, immediate treatment is recommended for detected diseases. 
              Monitor your crops closely and consider preventive measures for neighboring plants.
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
