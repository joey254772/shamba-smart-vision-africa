
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Droplet, ThermometerSnowflake } from "lucide-react";
import SoilHealthWidget from "@/components/dashboard/SoilHealthWidget";

const SoilHealth = () => {
  const mockSensorData = [
    { id: "sensor-1", name: "Field 1 - Main Plot", batteryLevel: 85, lastReading: "10 minutes ago", status: "active" },
    { id: "sensor-2", name: "Field 2 - North Corner", batteryLevel: 62, lastReading: "25 minutes ago", status: "active" },
    { id: "sensor-3", name: "Field 3 - South Zone", batteryLevel: 41, lastReading: "1 hour ago", status: "warning" },
    { id: "sensor-4", name: "Greenhouse", batteryLevel: 90, lastReading: "5 minutes ago", status: "active" },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Soil Health Monitoring</h1>
        <p className="text-muted-foreground">
          View soil conditions, nutrient levels, and IoT sensor data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="metrics">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="metrics">Current Metrics</TabsTrigger>
                <TabsTrigger value="history">Historical Data</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="metrics">
              <SoilHealthWidget />
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Historical Soil Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Historical data visualization will appear here</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Track changes in soil health over time with detailed graphs and trends
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <Card className="dashboard-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fertilization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-agriculture-primary">Nitrogen Application</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Based on current levels, apply 20kg/ha of nitrogen fertilizer to Field 1.
                        Best applied in the early morning before temperatures rise.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-agriculture-primary">pH Adjustment</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        The soil is slightly acidic. Consider applying agricultural lime at 2 tons/ha
                        to bring pH levels to the optimal range for your crops.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h3 className="font-medium text-agriculture-primary">Micronutrients</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manganese deficiency detected. Recommended to apply foliar spray with
                        manganese sulfate at 1.5kg/ha within the next 7 days.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="dashboard-card mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-agriculture-primary" />
                Field Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border-2 border-agriculture-primary bg-agriculture-primary/5 cursor-pointer">
                  <div className="font-medium">Field 1 - Main Plot</div>
                  <div className="text-sm text-muted-foreground">2.5 hectares • Tomatoes</div>
                </div>
                <div className="p-3 rounded-lg border hover:border-agriculture-primary hover:bg-agriculture-primary/5 cursor-pointer transition-colors">
                  <div className="font-medium">Field 2 - North Corner</div>
                  <div className="text-sm text-muted-foreground">1.8 hectares • Corn</div>
                </div>
                <div className="p-3 rounded-lg border hover:border-agriculture-primary hover:bg-agriculture-primary/5 cursor-pointer transition-colors">
                  <div className="font-medium">Field 3 - South Zone</div>
                  <div className="text-sm text-muted-foreground">3.2 hectares • Wheat</div>
                </div>
                <div className="p-3 rounded-lg border hover:border-agriculture-primary hover:bg-agriculture-primary/5 cursor-pointer transition-colors">
                  <div className="font-medium">Greenhouse</div>
                  <div className="text-sm text-muted-foreground">0.5 hectares • Mixed Vegetables</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Droplet className="mr-2 h-5 w-5 text-agriculture-primary" />
                IoT Sensors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSensorData.map((sensor) => (
                  <div key={sensor.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{sensor.name}</div>
                      <div className="text-xs text-muted-foreground">Last reading: {sensor.lastReading}</div>
                    </div>
                    <div className="flex items-center">
                      <div 
                        className={`h-2 w-2 rounded-full mr-2 ${
                          sensor.status === "active" ? "bg-green-500" : "bg-amber-500"
                        }`}
                      ></div>
                      <div className="text-xs font-medium">
                        {sensor.batteryLevel}%
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full p-2 mt-2 text-sm text-center text-agriculture-primary border border-dashed border-agriculture-primary/50 rounded-lg hover:bg-agriculture-primary/5 transition-colors">
                  + Add New Sensor
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SoilHealth;
