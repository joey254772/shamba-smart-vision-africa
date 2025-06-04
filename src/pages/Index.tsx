
import React from "react";
import Layout from "@/components/layout/Layout";
import StatusCard from "@/components/dashboard/StatusCard";
import WeatherWidget from "@/components/dashboard/WeatherWidget";
import SoilHealthWidget from "@/components/dashboard/SoilHealthWidget";
import RecentAlertsWidget from "@/components/dashboard/RecentAlertsWidget";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Image, Database, Cloud, Bell, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Farm Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your farm's health and conditions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Generate Report
          </Button>
          <Button 
            size="sm"
            className="bg-agriculture-primary hover:bg-agriculture-primary/90"
          >
            <Image className="h-4 w-4 mr-2" />
            Scan Crop Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatusCard
          title="Disease Alerts"
          value="2"
          subtitle="1 high risk"
          icon={<Bell className="h-5 w-5" />}
          trend={{ value: 50, isPositive: false }}
          className="border-l-4 border-l-agriculture-danger"
        />
        <StatusCard
          title="Sensor Health"
          value="98%"
          subtitle="All sensors active"
          icon={<Wifi className="h-5 w-5" />}
          trend={{ value: 2, isPositive: true }}
        />
        <StatusCard
          title="Soil Moisture"
          value="65%"
          subtitle="Optimal range"
          icon={<MapPin className="h-5 w-5" />}
        />
        <StatusCard
          title="Community Reports"
          value="5"
          subtitle="From your region"
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 20, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-agriculture-primary to-agriculture-secondary rounded-xl overflow-hidden shadow-lg">
            <div className="p-6 text-white">
              <h2 className="text-xl font-bold mb-2">Welcome to AgriSense</h2>
              <p className="opacity-90 mb-6">
                Your AI-powered assistant for smarter farming. Monitor conditions, detect diseases early, and get personalized recommendations for your crops.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/disease-detection">
                  <Button size="sm" variant="secondary" className="bg-white text-agriculture-primary hover:bg-white/90">
                    <Image className="h-4 w-4 mr-2" />
                    Detect Disease
                  </Button>
                </Link>
                <Link to="/soil-health">
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    <MapPin className="h-4 w-4 mr-2" />
                    Soil Analysis
                  </Button>
                </Link>
                <Link to="/weather">
                  <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    <Cloud className="h-4 w-4 mr-2" />
                    Weather Forecast
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-agriculture-primary/10 to-agriculture-secondary/10 backdrop-blur-md">
              <div className="flex items-center text-sm">
                <Database className="h-4 w-4 mr-2 text-agriculture-primary" />
                <span className="font-medium text-agriculture-primary">AI System Status:</span>
                <span className="ml-2 text-muted-foreground">Active and monitoring your farm</span>
                <span className="ml-2 h-2 w-2 rounded-full bg-green-500 animate-pulse-green"></span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <WeatherWidget />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAlertsWidget />
        <SoilHealthWidget />
      </div>
    </Layout>
  );
};

export default Index;
