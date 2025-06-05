
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Leaf, Bug, Droplets, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const TreatmentGuide = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Treatment guides for common Kenyan agricultural issues
  const treatmentGuides = [
    {
      id: 1,
      title: "Maize Stem Borer Control",
      crop: "Maize",
      category: "Pest",
      severity: "High",
      symptoms: ["Holes in leaves", "Sawdust-like frass", "Wilting plants", "Broken stems"],
      treatment: {
        chemical: [
          "Apply Carbofuran 3G at planting (20-30kg/ha)",
          "Spray with Lambda-cyhalothrin during whorl stage",
          "Use Chlorpyrifos 480 EC if infestation is severe"
        ],
        organic: [
          "Release Trichogramma wasps as biological control",
          "Apply neem-based pesticides every 10-14 days",
          "Use wood ash mixed with water as spray",
          "Plant marigold as companion crop"
        ],
        cultural: [
          "Practice crop rotation with legumes",
          "Remove crop residues after harvest",
          "Plant early maturing varieties",
          "Maintain field hygiene"
        ]
      },
      prevention: [
        "Use certified seeds",
        "Plant at recommended time",
        "Apply balanced fertilizer",
        "Regular field monitoring"
      ],
      cost: "KES 3,000 - 8,000 per acre",
      timeline: "2-3 weeks for control"
    },
    {
      id: 2,
      title: "Coffee Berry Disease (CBD)",
      crop: "Coffee",
      category: "Disease",
      severity: "High",
      symptoms: ["Dark brown spots on berries", "Premature berry drop", "Sunken lesions", "Mummified berries"],
      treatment: {
        chemical: [
          "Spray copper-based fungicides (Copper oxychloride)",
          "Apply Metalaxyl + Mancozeb during flowering",
          "Use Azoxystrobin for severe infections",
          "Alternate fungicides to prevent resistance"
        ],
        organic: [
          "Apply compost tea regularly",
          "Use baking soda solution (1% concentration)",
          "Neem oil spray every 14 days",
          "Trichoderma-based bio-fungicides"
        ],
        cultural: [
          "Prune infected branches immediately",
          "Improve air circulation through proper spacing",
          "Remove fallen berries and leaves",
          "Avoid overhead irrigation"
        ]
      },
      prevention: [
        "Plant resistant varieties",
        "Proper pruning and spacing",
        "Drainage management",
        "Regular monitoring"
      ],
      cost: "KES 5,000 - 12,000 per acre",
      timeline: "4-6 weeks for recovery"
    },
    {
      id: 3,
      title: "Tomato Late Blight",
      crop: "Tomato",
      category: "Disease",
      severity: "Medium",
      symptoms: ["Water-soaked spots on leaves", "White fungal growth", "Brown patches on fruits", "Rapid plant death"],
      treatment: {
        chemical: [
          "Spray Metalaxyl-M + Chlorothalonil",
          "Apply Dimethomorph + Mancozeb",
          "Use Propamocarb in severe cases",
          "Preventive copper sprays"
        ],
        organic: [
          "Baking soda spray (2 tablespoons per liter)",
          "Milk spray (1:10 ratio with water)",
          "Compost tea application",
          "Bacillus subtilis bio-fungicide"
        ],
        cultural: [
          "Remove infected plants immediately",
          "Improve drainage and air circulation",
          "Avoid overhead watering",
          "Mulching to prevent soil splash"
        ]
      },
      prevention: [
        "Choose resistant varieties",
        "Proper plant spacing",
        "Drip irrigation system",
        "Regular field inspection"
      ],
      cost: "KES 4,000 - 9,000 per acre",
      timeline: "3-4 weeks for control"
    },
    {
      id: 4,
      title: "Bean Aphid Management",
      crop: "Beans",
      category: "Pest",
      severity: "Medium",
      symptoms: ["Curled leaves", "Sticky honeydew", "Yellowing plants", "Stunted growth"],
      treatment: {
        chemical: [
          "Spray Imidacloprid 200 SL",
          "Apply Acetamiprid 20 SP",
          "Use Thiamethoxam for severe infestations",
          "Soap spray with insecticide"
        ],
        organic: [
          "Neem oil spray every 7 days",
          "Soap water solution (2% concentration)",
          "Release ladybird beetles",
          "Garlic and chili pepper spray"
        ],
        cultural: [
          "Remove weeds that harbor aphids",
          "Practice crop rotation",
          "Plant companion crops like marigold",
          "Regular monitoring and early detection"
        ]
      },
      prevention: [
        "Use reflective mulch",
        "Plant barrier crops",
        "Maintain field hygiene",
        "Balanced fertilization"
      ],
      cost: "KES 2,500 - 6,000 per acre",
      timeline: "1-2 weeks for control"
    }
  ];

  const kenyanCrops = ["Maize", "Coffee", "Tea", "Beans", "Tomato", "Potato", "Rice", "Wheat"];

  const filteredGuides = treatmentGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === "all" || guide.crop === selectedCrop;
    const matchesCategory = selectedCategory === "all" || guide.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCrop && matchesCategory;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Treatment Guide</h1>
        <p className="text-muted-foreground">
          Comprehensive treatment guides for common crop issues in Kenya
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search treatments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
          <SelectTrigger>
            <SelectValue placeholder="Select crop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {kenyanCrops.map(crop => (
              <SelectItem key={crop} value={crop}>{crop}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="pest">Pest Control</SelectItem>
            <SelectItem value="disease">Disease Management</SelectItem>
            <SelectItem value="nutrient">Nutrient Deficiency</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {guide.category === "Pest" ? <Bug className="h-5 w-5" /> : <Leaf className="h-5 w-5" />}
                  {guide.title}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{guide.crop}</Badge>
                  <Badge className={getSeverityColor(guide.severity)}>
                    {guide.severity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="treatment" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                  <TabsTrigger value="treatment">Treatment</TabsTrigger>
                  <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="symptoms" className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Symptoms to Look For
                  </h4>
                  <ul className="space-y-1">
                    {guide.symptoms.map((symptom, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-agriculture-primary" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="treatment" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 text-red-600">Chemical Treatment</h4>
                      <ul className="space-y-1">
                        {guide.treatment.chemical.map((treatment, index) => (
                          <li key={index} className="text-sm">• {treatment}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-green-600">Organic Treatment</h4>
                      <ul className="space-y-1">
                        {guide.treatment.organic.map((treatment, index) => (
                          <li key={index} className="text-sm">• {treatment}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 text-blue-600">Cultural Practices</h4>
                      <ul className="space-y-1">
                        {guide.treatment.cultural.map((treatment, index) => (
                          <li key={index} className="text-sm">• {treatment}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="prevention" className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Prevention Methods
                  </h4>
                  <ul className="space-y-1">
                    {guide.prevention.map((method, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {method}
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert>
                      <Droplets className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Estimated Cost:</strong> {guide.cost}
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Calendar className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Treatment Timeline:</strong> {guide.timeline}
                      </AlertDescription>
                    </Alert>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default TreatmentGuide;
