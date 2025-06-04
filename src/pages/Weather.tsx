
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplet,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import WeatherWidget from "@/components/dashboard/WeatherWidget";

const Weather = () => {
  // Mock data for hourly forecast
  const hourlyForecast = [
    { time: "Now", temp: 28, icon: <Sun className="h-6 w-6 text-yellow-500" />, precipitation: 0 },
    { time: "12 PM", temp: 29, icon: <Sun className="h-6 w-6 text-yellow-500" />, precipitation: 0 },
    { time: "1 PM", temp: 30, icon: <Sun className="h-6 w-6 text-yellow-500" />, precipitation: 0 },
    { time: "2 PM", temp: 30, icon: <CloudSun className="h-6 w-6 text-gray-500" />, precipitation: 0 },
    { time: "3 PM", temp: 29, icon: <CloudSun className="h-6 w-6 text-gray-500" />, precipitation: 10 },
    { time: "4 PM", temp: 28, icon: <Cloud className="h-6 w-6 text-gray-500" />, precipitation: 20 },
    { time: "5 PM", temp: 27, icon: <Cloud className="h-6 w-6 text-gray-500" />, precipitation: 20 },
    { time: "6 PM", temp: 25, icon: <Cloud className="h-6 w-6 text-gray-500" />, precipitation: 10 },
  ];

  // Mock data for agricultural impacts
  const agriculturalImpacts = [
    {
      title: "Watering Needs",
      recommendation: "Reduced watering recommended due to expected rainfall",
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
    },
    {
      title: "Disease Risk",
      recommendation: "Moderate risk of fungal diseases from humidity",
      icon: <CloudRain className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: "Harvest Conditions",
      recommendation: "Excellent conditions for harvest in the morning",
      icon: <Sun className="h-5 w-5 text-green-500" />,
    },
    {
      title: "Wind Advisory",
      recommendation: "Low wind speeds - good for spraying operations",
      icon: <Wind className="h-5 w-5 text-blue-400" />,
    },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">
          Weather conditions and agricultural implications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <WeatherWidget />
        </div>

        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-agriculture-primary" />
              Agricultural Impacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agriculturalImpacts.map((impact, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-full bg-card">
                      {impact.icon}
                    </div>
                    <h3 className="font-medium">{impact.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-9">
                    {impact.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hourly Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto pb-2">
              {hourlyForecast.map((hour, index) => (
                <div
                  key={index}
                  className="flex-none w-24 text-center p-3"
                >
                  <div className="font-medium text-sm">{hour.time}</div>
                  <div className="my-2 flex justify-center">{hour.icon}</div>
                  <div className="text-lg font-bold">{hour.temp}°C</div>
                  {hour.precipitation > 0 && (
                    <div className="text-xs text-blue-500 flex items-center justify-center mt-1">
                      <Droplet className="h-3 w-3 mr-1" />
                      {hour.precipitation}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Weather;
