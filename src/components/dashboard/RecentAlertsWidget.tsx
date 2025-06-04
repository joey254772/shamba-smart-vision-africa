
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CloudRain, Thermometer, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: number;
  type: "disease" | "weather" | "soil" | "pest";
  severity: "low" | "medium" | "high";
  title: string;
  message: string;
  time: string;
  icon: React.ReactNode;
}

const RecentAlertsWidget = () => {
  // Mock alerts data - in a real app this would come from the backend
  const alerts: Alert[] = [
    {
      id: 1,
      type: "disease",
      severity: "high",
      title: "Tomato Blight Detected",
      message: "Early blight symptoms identified in Tomato Field 2. Immediate action required.",
      time: "10 min ago",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: 2,
      type: "weather",
      severity: "medium",
      title: "Heavy Rainfall Warning",
      message: "Heavy rainfall predicted in your region for the next 48 hours.",
      time: "1 hour ago",
      icon: <CloudRain className="h-5 w-5" />,
    },
    {
      id: 3,
      type: "soil",
      severity: "low",
      title: "Low Nitrogen Levels",
      message: "Nitrogen deficiency detected in Field 3. Consider fertilization.",
      time: "3 hours ago",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      id: 4,
      type: "pest",
      severity: "high",
      title: "Aphid Infestation Risk",
      message: "High risk of aphid infestation based on current conditions.",
      time: "Yesterday",
      icon: <Thermometer className="h-5 w-5" />,
    },
  ];

  const getSeverityColor = (severity: Alert["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getTypeColor = (type: Alert["type"]) => {
    switch (type) {
      case "disease":
        return "text-agriculture-danger";
      case "weather":
        return "text-blue-500";
      case "soil":
        return "text-agriculture-soil";
      case "pest":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="mr-2 h-5 w-5 text-agriculture-primary" />
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className={cn("mt-0.5 p-2 rounded-full", getTypeColor(alert.type))}>
                {alert.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium flex items-center gap-2">
                    {alert.title}
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center">
          <button className="text-agriculture-primary text-sm font-medium hover:underline">
            View all alerts
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAlertsWidget;
