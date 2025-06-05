
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar as CalendarIcon, Cloud, Droplets, Sun, Thermometer, MapPin, Clock } from "lucide-react";

const CropCalendar = () => {
  const [selectedRegion, setSelectedRegion] = useState("central");
  const [selectedSeason, setSelectedSeason] = useState("long-rains");
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Kenyan crop calendar data
  const cropCalendar = {
    "long-rains": {
      name: "Long Rains (March - July)",
      months: ["March", "April", "May", "June", "July"],
      crops: [
        {
          name: "Maize",
          planting: "March - April",
          harvesting: "July - August",
          regions: ["Central", "Eastern", "Western", "Rift Valley"],
          varieties: ["H513", "H614", "DK8031", "WH507"],
          requirements: "600-1000mm rainfall, well-drained soils",
          spacing: "75cm x 25cm",
          fertilizer: "DAP at planting, CAN top-dressing"
        },
        {
          name: "Beans",
          planting: "March - April",
          harvesting: "June - July",
          regions: ["Central", "Eastern", "Western"],
          varieties: ["Rose Coco", "Mwezi Moja", "Wairimu", "GLP-2"],
          requirements: "500-700mm rainfall, pH 6.0-7.0",
          spacing: "40cm x 10cm",
          fertilizer: "DAP at planting, minimal nitrogen"
        },
        {
          name: "Coffee",
          planting: "March - May",
          harvesting: "October - January",
          regions: ["Central", "Eastern"],
          varieties: ["Ruiru 11", "Batian", "SL28", "SL34"],
          requirements: "1200-1800mm rainfall, altitude 1200-2100m",
          spacing: "2.7m x 2.7m",
          fertilizer: "NPK 17:17:17, organic matter"
        },
        {
          name: "Potatoes",
          planting: "March - April",
          harvesting: "June - August",
          regions: ["Central", "Rift Valley"],
          varieties: ["Shangi", "Dutch Robjin", "Tigoni", "Kenya Mpya"],
          requirements: "800-1200mm rainfall, cool temperatures",
          spacing: "75cm x 30cm",
          fertilizer: "DAP, CAN, potassium-rich fertilizers"
        }
      ]
    },
    "short-rains": {
      name: "Short Rains (October - December)",
      months: ["October", "November", "December"],
      crops: [
        {
          name: "Maize (Short Season)",
          planting: "October - November",
          harvesting: "January - February",
          regions: ["Eastern", "Coast", "Parts of Central"],
          varieties: ["Katumani", "DK8031", "H513"],
          requirements: "400-600mm rainfall, drought-tolerant varieties",
          spacing: "75cm x 25cm",
          fertilizer: "DAP at planting, limited top-dressing"
        },
        {
          name: "Sorghum",
          planting: "October - November",
          harvesting: "February - March",
          regions: ["Eastern", "Coast", "Northern"],
          varieties: ["Gadam", "Serena", "Kari Mtama 1"],
          requirements: "300-500mm rainfall, drought-tolerant",
          spacing: "60cm x 15cm",
          fertilizer: "Minimal fertilizer requirements"
        },
        {
          name: "Green Grams",
          planting: "October - November",
          harvesting: "December - January",
          regions: ["Eastern", "Coast"],
          varieties: ["N26", "KS20", "Goldmine"],
          requirements: "250-400mm rainfall, heat-tolerant",
          spacing: "30cm x 10cm",
          fertilizer: "DAP at planting, phosphorus-rich"
        }
      ]
    },
    "dry-season": {
      name: "Dry Season (June - September)",
      months: ["June", "July", "August", "September"],
      crops: [
        {
          name: "Irrigated Tomatoes",
          planting: "June - July",
          harvesting: "September - November",
          regions: ["Central (with irrigation)", "Rift Valley"],
          varieties: ["Anna F1", "Prostar F1", "Rambo F1"],
          requirements: "Irrigation required, 600-800mm water",
          spacing: "60cm x 45cm",
          fertilizer: "High potassium, regular feeding"
        },
        {
          name: "Onions",
          planting: "June - August",
          harvesting: "October - December",
          regions: ["Central", "Rift Valley"],
          varieties: ["Red Creole", "Bombay Red", "Texas Grano"],
          requirements: "Irrigation, well-drained soils",
          spacing: "20cm x 10cm",
          fertilizer: "Nitrogen-rich, avoid fresh manure"
        },
        {
          name: "Kales (Sukuma Wiki)",
          planting: "Year-round",
          harvesting: "30-45 days after planting",
          regions: ["All regions"],
          varieties: ["Thousand Headed", "Marrow Stem"],
          requirements: "Regular watering, fertile soils",
          spacing: "30cm x 30cm",
          fertilizer: "Nitrogen-rich, organic matter"
        }
      ]
    }
  };

  const kenyanRegions = [
    { value: "central", label: "Central Kenya (Kiambu, Murang'a, Nyeri)" },
    { value: "eastern", label: "Eastern Kenya (Machakos, Makueni, Embu)" },
    { value: "western", label: "Western Kenya (Kakamega, Bungoma, Busia)" },
    { value: "rift-valley", label: "Rift Valley (Nakuru, Eldoret, Narok)" },
    { value: "coast", label: "Coast (Mombasa, Kilifi, Kwale)" },
    { value: "northern", label: "Northern Kenya (Marsabit, Turkana, Wajir)" }
  ];

  const currentSeason = cropCalendar[selectedSeason as keyof typeof cropCalendar];
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const getSeasonStatus = (season: string) => {
    const now = new Date().getMonth();
    const longRainsMonths = [2, 3, 4, 5, 6]; // March-July
    const shortRainsMonths = [9, 10, 11]; // Oct-Dec
    const drySeasonMonths = [5, 6, 7, 8]; // June-Sept

    if (season === "long-rains" && longRainsMonths.includes(now)) return "active";
    if (season === "short-rains" && shortRainsMonths.includes(now)) return "active";
    if (season === "dry-season" && drySeasonMonths.includes(now)) return "active";
    return "inactive";
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crop Calendar</h1>
        <p className="text-muted-foreground">
          Optimal planting and harvesting schedules for crops in Kenya
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {kenyanRegions.map(region => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(cropCalendar).map(([key, season]) => (
                <Button
                  key={key}
                  variant={selectedSeason === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSeason(key)}
                  className={`relative ${getSeasonStatus(key) === "active" ? "ring-2 ring-green-500" : ""}`}
                >
                  {season.name.split(' ')[0]} {season.name.split(' ')[1]}
                  {getSeasonStatus(key) === "active" && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <Alert className="mb-6">
            <CalendarIcon className="h-4 w-4" />
            <AlertDescription>
              <strong>Current Season: {currentSeason.name}</strong><br />
              Active months: {currentSeason.months.join(", ")}
              {getSeasonStatus(selectedSeason) === "active" && (
                <Badge className="ml-2 bg-green-100 text-green-800">Active Now</Badge>
              )}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {currentSeason.crops.map((crop, index) => (
              <Card key={index} className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="h-5 w-5 text-agriculture-primary" />
                      {crop.name}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{crop.planting}</Badge>
                      <Badge className="bg-green-100 text-green-800">{crop.harvesting}</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4" />
                          Suitable Regions
                        </h4>
                        <p className="text-sm text-muted-foreground">{crop.regions.join(", ")}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Recommended Varieties</h4>
                        <div className="flex flex-wrap gap-1">
                          {crop.varieties.map((variety, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {variety}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium flex items-center gap-2 mb-1">
                          <Droplets className="h-4 w-4" />
                          Water & Climate Requirements
                        </h4>
                        <p className="text-sm text-muted-foreground">{crop.requirements}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">Plant Spacing</h4>
                        <p className="text-sm text-muted-foreground">{crop.spacing}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Fertilizer Recommendations</h4>
                        <p className="text-sm text-muted-foreground">{crop.fertilizer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Clock className="h-4 w-4 mr-2" />
                          Set Reminder
                        </Button>
                        <Button size="sm" variant="outline">
                          More Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="text-lg">Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">This Month: {currentMonth}</h4>
                <div className="space-y-1">
                  {currentSeason.crops
                    .filter(crop => 
                      crop.planting.toLowerCase().includes(currentMonth.toLowerCase()) ||
                      crop.harvesting.toLowerCase().includes(currentMonth.toLowerCase())
                    )
                    .map((crop, idx) => (
                      <div key={idx} className="text-sm p-2 bg-agriculture-primary/10 rounded">
                        <strong>{crop.name}</strong>
                        {crop.planting.toLowerCase().includes(currentMonth.toLowerCase()) && (
                          <div className="text-green-600">• Planting time</div>
                        )}
                        {crop.harvesting.toLowerCase().includes(currentMonth.toLowerCase()) && (
                          <div className="text-blue-600">• Harvesting time</div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Weather Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span>Monitor rainfall patterns for optimal planting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-yellow-500" />
                  <span>Consider temperature requirements for each crop</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-green-500" />
                  <span>Plan irrigation for dry season crops</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CropCalendar;
