
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, AlertTriangle, Users, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommunityReports = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [newReport, setNewReport] = useState({
    title: "",
    description: "",
    location: "",
    cropType: "",
    severity: "",
    category: ""
  });

  // Mock data for community reports from Kenya
  const communityReports = [
    {
      id: 1,
      title: "Maize Stem Borer Outbreak",
      description: "Significant stem borer infestation affecting maize crops in Nakuru region. Early intervention recommended.",
      location: "Nakuru County",
      cropType: "Maize",
      severity: "High",
      category: "Pest",
      reportedBy: "John Kamau",
      date: "2024-01-15",
      likes: 23,
      comments: 8
    },
    {
      id: 2,
      title: "Coffee Berry Disease Alert",
      description: "CBD symptoms observed in coffee plantations. Fungicide application showing good results.",
      location: "Kiambu County",
      cropType: "Coffee",
      severity: "Medium",
      category: "Disease",
      reportedBy: "Mary Wanjiku",
      date: "2024-01-12",
      likes: 31,
      comments: 12
    },
    {
      id: 3,
      title: "Drought Stress in Beans",
      description: "Bean crops showing signs of water stress. Community irrigation project needed.",
      location: "Machakos County",
      cropType: "Beans",
      severity: "Medium",
      category: "Weather",
      reportedBy: "Peter Mutua",
      date: "2024-01-10",
      likes: 18,
      comments: 5
    },
    {
      id: 4,
      title: "Successful Organic Farming",
      description: "Great results with organic tomato farming using compost and bio-pesticides.",
      location: "Meru County",
      cropType: "Tomato",
      severity: "Low",
      category: "Success",
      reportedBy: "Grace Njeri",
      date: "2024-01-08",
      likes: 45,
      comments: 20
    }
  ];

  const kenyanCrops = ["Maize", "Coffee", "Tea", "Beans", "Tomato", "Potato", "Rice", "Wheat", "Sugarcane", "Banana"];
  const kenyanCounties = ["Nairobi", "Kiambu", "Nakuru", "Meru", "Machakos", "Kisumu", "Eldoret", "Mombasa"];

  const handleSubmitReport = () => {
    if (!newReport.title || !newReport.description || !newReport.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Submitted",
      description: "Your community report has been shared successfully",
    });

    setNewReport({
      title: "",
      description: "",
      location: "",
      cropType: "",
      severity: "",
      category: ""
    });
  };

  const filteredReports = filter === "all" 
    ? communityReports 
    : communityReports.filter(report => report.category.toLowerCase() === filter);

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
        <h1 className="text-2xl font-bold">Community Reports</h1>
        <p className="text-muted-foreground">
          Share and discover agricultural insights from farmers across Kenya
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pest">Pest Issues</SelectItem>
              <SelectItem value="disease">Diseases</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
              <SelectItem value="success">Success Stories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-agriculture-primary hover:bg-agriculture-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Share Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Community Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Report title"
                value={newReport.title}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
              />
              <Textarea
                placeholder="Describe what you've observed..."
                value={newReport.description}
                onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              />
              <Select value={newReport.location} onValueChange={(value) => setNewReport({...newReport, location: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {kenyanCounties.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newReport.cropType} onValueChange={(value) => setNewReport({...newReport, cropType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {kenyanCrops.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select value={newReport.severity} onValueChange={(value) => setNewReport({...newReport, severity: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={newReport.category} onValueChange={(value) => setNewReport({...newReport, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pest">Pest</SelectItem>
                    <SelectItem value="Disease">Disease</SelectItem>
                    <SelectItem value="Weather">Weather</SelectItem>
                    <SelectItem value="Success">Success</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmitReport} className="w-full">
                Share Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => (
          <Card key={report.id} className="dashboard-card">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{report.title}</h3>
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                    <Badge variant="outline">{report.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {report.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div>Crop: {report.cropType}</div>
                    <div>By: {report.reportedBy}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {report.likes} likes
                  </div>
                  <div>{report.comments} comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default CommunityReports;
