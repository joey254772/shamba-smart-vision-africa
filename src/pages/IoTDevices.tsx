
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wifi,
  Battery,
  Thermometer,
  Droplets,
  Gauge,
  MapPin,
  Plus,
  Settings,
  AlertTriangle,
  TrendingUp,
  Signal,
} from "lucide-react";

interface IoTDevice {
  id: string;
  name: string;
  type: "soil" | "weather" | "irrigation" | "camera";
  location: string;
  county: string;
  status: "online" | "offline" | "warning";
  batteryLevel: number;
  signalStrength: number;
  lastReading: string;
  sensors: {
    temperature?: number;
    humidity?: number;
    soilMoisture?: number;
    pH?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
  };
}

const IoTDevices = () => {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: "device-001",
      name: "Kiambu Coffee Farm Sensor",
      type: "soil",
      location: "Kiambu County - Plot A",
      county: "Kiambu",
      status: "online",
      batteryLevel: 85,
      signalStrength: 92,
      lastReading: "2 minutes ago",
      sensors: {
        temperature: 22.5,
        humidity: 65,
        soilMoisture: 45,
        pH: 6.2,
        nitrogen: 25,
        phosphorus: 18,
        potassium: 32,
      },
    },
    {
      id: "device-002",
      name: "Nakuru Maize Weather Station",
      type: "weather",
      location: "Nakuru County - Field 3",
      county: "Nakuru",
      status: "online",
      batteryLevel: 72,
      signalStrength: 88,
      lastReading: "5 minutes ago",
      sensors: {
        temperature: 28.3,
        humidity: 58,
      },
    },
    {
      id: "device-003",
      name: "Meru Tea Plantation Monitor",
      type: "soil",
      location: "Meru County - Section B",
      county: "Meru",
      status: "warning",
      batteryLevel: 23,
      signalStrength: 65,
      lastReading: "15 minutes ago",
      sensors: {
        temperature: 18.9,
        humidity: 78,
        soilMoisture: 32,
        pH: 5.8,
      },
    },
    {
      id: "device-004",
      name: "Eldoret Wheat Irrigation",
      type: "irrigation",
      location: "Uasin Gishu County - Block 2",
      county: "Uasin Gishu",
      status: "online",
      batteryLevel: 91,
      signalStrength: 95,
      lastReading: "1 minute ago",
      sensors: {
        soilMoisture: 28,
        temperature: 24.1,
      },
    },
    {
      id: "device-005",
      name: "Machakos Tomato Camera",
      type: "camera",
      location: "Machakos County - Greenhouse 1",
      county: "Machakos",
      status: "offline",
      batteryLevel: 0,
      signalStrength: 0,
      lastReading: "2 hours ago",
      sensors: {},
    },
  ]);

  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(devices[0]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        sensors: {
          ...device.sensors,
          temperature: device.sensors.temperature ? 
            device.sensors.temperature + (Math.random() - 0.5) * 0.5 : undefined,
          humidity: device.sensors.humidity ? 
            Math.max(0, Math.min(100, device.sensors.humidity + (Math.random() - 0.5) * 2)) : undefined,
          soilMoisture: device.sensors.soilMoisture ? 
            Math.max(0, Math.min(100, device.sensors.soilMoisture + (Math.random() - 0.5) * 1)) : undefined,
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "soil": return <Gauge className="h-5 w-5" />;
      case "weather": return <Thermometer className="h-5 w-5" />;
      case "irrigation": return <Droplets className="h-5 w-5" />;
      case "camera": return <MapPin className="h-5 w-5" />;
      default: return <Wifi className="h-5 w-5" />;
    }
  };

  const onlineDevices = devices.filter(d => d.status === "online").length;
  const warningDevices = devices.filter(d => d.status === "warning").length;
  const offlineDevices = devices.filter(d => d.status === "offline").length;

  return (
    <Layout>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">IoT Devices</h1>
            <p className="text-muted-foreground">
              Monitor your smart farming devices across Kenya
            </p>
          </div>
          <Button className="bg-agriculture-primary hover:bg-agriculture-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{devices.length}</p>
              </div>
              <Wifi className="h-8 w-8 text-agriculture-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online</p>
                <p className="text-2xl font-bold text-green-600">{onlineDevices}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-yellow-600">{warningDevices}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline</p>
                <p className="text-2xl font-bold text-red-600">{offlineDevices}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Device List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDevice?.id === device.id
                        ? "border-agriculture-primary bg-agriculture-primary/5"
                        : "hover:border-agriculture-primary/50"
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-agriculture-primary">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{device.name}</h4>
                          <p className="text-xs text-muted-foreground">{device.location}</p>
                          <div className="flex items-center mt-1">
                            <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(device.status)}`}></div>
                            <Badge variant="outline" className="text-xs">
                              {device.county}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <div className="flex items-center">
                        <Battery className="h-3 w-3 mr-1" />
                        {device.batteryLevel}%
                      </div>
                      <div className="flex items-center">
                        <Signal className="h-3 w-3 mr-1" />
                        {device.signalStrength}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Details */}
        <div className="lg:col-span-2">
          {selectedDevice && (
            <Tabs defaultValue="readings">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="readings">Live Readings</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>

              <TabsContent value="readings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedDevice.name}</span>
                      <Badge 
                        variant={selectedDevice.status === "online" ? "default" : "destructive"}
                        className={selectedDevice.status === "online" ? "bg-green-500" : ""}
                      >
                        {selectedDevice.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Last reading: {selectedDevice.lastReading}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedDevice.sensors.temperature && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Thermometer className="h-5 w-5 text-red-500" />
                            <span className="text-sm text-muted-foreground">°C</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.temperature.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                        </div>
                      )}
                      
                      {selectedDevice.sensors.humidity && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Droplets className="h-5 w-5 text-blue-500" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.humidity.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">Humidity</p>
                        </div>
                      )}
                      
                      {selectedDevice.sensors.soilMoisture && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Gauge className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-muted-foreground">%</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.soilMoisture.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">Soil Moisture</p>
                        </div>
                      )}
                      
                      {selectedDevice.sensors.pH && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <TrendingUp className="h-5 w-5 text-purple-500" />
                            <span className="text-sm text-muted-foreground">pH</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.pH.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">Soil pH</p>
                        </div>
                      )}
                      
                      {selectedDevice.sensors.nitrogen && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="h-5 w-5 rounded bg-yellow-500"></div>
                            <span className="text-sm text-muted-foreground">ppm</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.nitrogen}</p>
                          <p className="text-xs text-muted-foreground">Nitrogen (N)</p>
                        </div>
                      )}
                      
                      {selectedDevice.sensors.phosphorus && (
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="h-5 w-5 rounded bg-orange-500"></div>
                            <span className="text-sm text-muted-foreground">ppm</span>
                          </div>
                          <p className="text-2xl font-bold mt-2">{selectedDevice.sensors.phosphorus}</p>
                          <p className="text-xs text-muted-foreground">Phosphorus (P)</p>
                        </div>
                      )}
                    </div>

                    {/* Device Status */}
                    <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-3">Device Status</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Battery Level</span>
                          <div className="flex items-center">
                            <Battery className="h-4 w-4 mr-1" />
                            <span className="font-medium">{selectedDevice.batteryLevel}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Signal Strength</span>
                          <div className="flex items-center">
                            <Signal className="h-4 w-4 mr-1" />
                            <span className="font-medium">{selectedDevice.signalStrength}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Device configuration options will be available here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Historical Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Historical charts and data trends will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default IoTDevices;
