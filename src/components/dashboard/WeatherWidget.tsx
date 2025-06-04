
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSun, Sun, Thermometer } from "lucide-react";

const WeatherWidget = () => {
  // Mock data - in a real app this would come from a weather API
  const weatherData = {
    current: {
      temp: 28,
      condition: "Mostly Sunny",
      humidity: 65,
      wind: 8,
      icon: <Sun className="h-10 w-10 text-yellow-500" />,
    },
    forecast: [
      {
        day: "Today",
        high: 29,
        low: 19,
        condition: "Sunny",
        icon: <Sun className="h-6 w-6 text-yellow-500" />,
      },
      {
        day: "Tomorrow",
        high: 27,
        low: 18,
        condition: "Partly Cloudy",
        icon: <CloudSun className="h-6 w-6 text-gray-500" />,
      },
      {
        day: "Wed",
        high: 24,
        low: 17,
        condition: "Cloudy",
        icon: <Cloud className="h-6 w-6 text-gray-500" />,
      },
      {
        day: "Thu",
        high: 22,
        low: 16,
        condition: "Rain",
        icon: <CloudRain className="h-6 w-6 text-blue-500" />,
      },
    ],
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Thermometer className="mr-2 h-5 w-5 text-agriculture-primary" />
          Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {weatherData.current.icon}
            <div className="ml-4">
              <div className="text-3xl font-bold">{weatherData.current.temp}°C</div>
              <div className="text-sm text-muted-foreground">
                {weatherData.current.condition}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            <div className="text-muted-foreground">Humidity:</div>
            <div className="font-medium">{weatherData.current.humidity}%</div>
            <div className="text-muted-foreground">Wind:</div>
            <div className="font-medium">{weatherData.current.wind} km/h</div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 pt-2 border-t">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center p-2">
              <div className="text-sm font-medium">{day.day}</div>
              <div className="my-1 flex justify-center">{day.icon}</div>
              <div className="flex text-xs justify-center gap-1">
                <span className="font-medium">{day.high}°</span>
                <span className="text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
