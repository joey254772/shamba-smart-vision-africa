
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const SoilHealthWidget = () => {
  // Mock data - in a real app this would come from IoT sensors
  const soilData = {
    moisture: 65,
    ph: 6.5,
    nitrogen: 75,
    phosphorus: 50,
    potassium: 60,
    temperature: 22,
  };

  const getColorForValue = (value: number, type: string) => {
    switch (type) {
      case "moisture":
        return value < 30 ? "text-red-500" : value < 60 ? "text-yellow-500" : "text-green-500";
      case "ph":
        return value < 5.5 || value > 7.5 ? "text-red-500" : value < 6 || value > 7 ? "text-yellow-500" : "text-green-500";
      default:
        return value < 40 ? "text-red-500" : value < 70 ? "text-yellow-500" : "text-green-500";
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-agriculture-primary" />
          Soil Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Moisture</div>
            <div className="flex items-end gap-1">
              <div className={`text-xl font-bold ${getColorForValue(soilData.moisture, "moisture")}`}>
                {soilData.moisture}%
              </div>
              <div className="text-xs text-muted-foreground mb-0.5">Optimal</div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-agriculture-primary rounded-full"
                style={{ width: `${soilData.moisture}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">pH Level</div>
            <div className="flex items-end gap-1">
              <div className={`text-xl font-bold ${getColorForValue(soilData.ph, "ph")}`}>
                {soilData.ph}
              </div>
              <div className="text-xs text-muted-foreground mb-0.5">Neutral</div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-agriculture-primary rounded-full"
                style={{ width: `${(soilData.ph / 14) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Temperature</div>
            <div className="flex items-end gap-1">
              <div className="text-xl font-bold text-yellow-500">
                {soilData.temperature}°C
              </div>
              <div className="text-xs text-muted-foreground mb-0.5">Warm</div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${(soilData.temperature / 40) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Nitrogen (N)</div>
            <div className="flex items-end gap-1">
              <div className={`text-xl font-bold ${getColorForValue(soilData.nitrogen, "nutrient")}`}>
                {soilData.nitrogen}%
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${soilData.nitrogen}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Phosphorus (P)</div>
            <div className="flex items-end gap-1">
              <div className={`text-xl font-bold ${getColorForValue(soilData.phosphorus, "nutrient")}`}>
                {soilData.phosphorus}%
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${soilData.phosphorus}%` }}
              ></div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3">
            <div className="text-sm text-muted-foreground mb-1">Potassium (K)</div>
            <div className="flex items-end gap-1">
              <div className={`text-xl font-bold ${getColorForValue(soilData.potassium, "nutrient")}`}>
                {soilData.potassium}%
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${soilData.potassium}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground border-t pt-2">
          <p>Last updated: Today at 9:45 AM · <span className="text-agriculture-primary font-medium">Field 1 - Main Plot</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilHealthWidget;
