
import React from "react";
import Layout from "@/components/layout/Layout";
import StatusCard from "@/components/dashboard/StatusCard";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import SoilHealthWidget from "@/components/dashboard/SoilHealthWidget";
import RecentAlertsWidget from "@/components/dashboard/RecentAlertsWidget";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Image, Database, Cloud, Bell, Users, Wifi } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="mb-4 md:mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Kenya Farm Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Monitor your farm's health across Kenya's diverse regions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs md:text-sm">
            Generate Report
          </Button>
          <Button 
            size="sm"
            className="bg-agriculture-primary hover:bg-agriculture-primary/90 text-xs md:text-sm"
          >
            <Image className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Scan Crop Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
        <StatusCard
          title="Disease Alerts"
          value="3"
          subtitle="Coffee berry disease"
          icon={<Bell className="h-4 w-4 md:h-5 md:w-5" />}
          trend={{ value: 25, isPositive: false }}
          className="border-l-4 border-l-agriculture-danger"
        />
        <StatusCard
          title="Sensor Health"
          value="96%"
          subtitle="Rift Valley active"
          icon={<Wifi className="h-4 w-4 md:h-5 md:w-5" />}
          trend={{ value: 2, isPositive: true }}
        />
        <StatusCard
          title="Soil Moisture"
          value="72%"
          subtitle="Central Kenya"
          icon={<MapPin className="h-4 w-4 md:h-5 md:w-5" />}
        />
        <StatusCard
          title="Farmer Reports"
          value="12"
          subtitle="This week"
          icon={<Users className="h-4 w-4 md:h-5 md:w-5" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-agriculture-primary to-agriculture-secondary rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 md:p-6 text-white">
              <h2 className="text-lg md:text-xl font-bold mb-2">Welcome to AgriJolt</h2>
              <p className="text-sm md:text-base opacity-90 mb-4 md:mb-6">
                Your AI-powered assistant for smarter farming in Kenya. Monitor conditions, detect diseases, and get recommendations for your crops across all counties.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Link to="/disease-detection">
                  <Button size="sm" variant="secondary" className="bg-white text-agriculture-primary hover:bg-white/90 text-xs md:text-sm">
                    <Image className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Detect Disease
                  </Button>
                </Link>
                <Link to="/soil-health">
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-xs md:text-sm">
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Soil Analysis
                  </Button>
                </Link>
                <Link to="/weather">
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30 text-xs md:text-sm">
                    <Cloud className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Weather Forecast
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-3 md:p-4 bg-gradient-to-r from-agriculture-primary/10 to-agriculture-secondary/10 backdrop-blur-md">
              <div className="flex items-center text-xs md:text-sm">
                <Database className="h-3 w-3 md:h-4 md:w-4 mr-2 text-agriculture-primary" />
                <span className="font-medium text-agriculture-primary">AI System Status:</span>
                <span className="ml-2 text-muted-foreground">Monitoring Kenya farms</span>
                <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse-green"></span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <WeatherWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <RecentAlertsWidget />
        <SoilHealthWidget />
      </div>
    </Layout>
  );
};

export default Index;
