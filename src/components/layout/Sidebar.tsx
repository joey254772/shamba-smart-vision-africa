
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Cloud,
  Image,
  Database,
  MapPin,
  Users,
  FileText,
  Sun,
  Wifi,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems = [
    {
      label: "Dashboard",
      icon: <Database className="h-5 w-5" />,
      href: "/",
    },
    {
      label: "Disease Detection",
      icon: <Image className="h-5 w-5" />,
      href: "/disease-detection",
    },
    {
      label: "Soil Health",
      icon: <MapPin className="h-5 w-5" />,
      href: "/soil-health",
    },
    {
      label: "Weather Forecast",
      icon: <Cloud className="h-5 w-5" />,
      href: "/weather",
    },
    {
      label: "Community Reports",
      icon: <Users className="h-5 w-5" />,
      href: "/community",
    },
    {
      label: "Treatment Guide",
      icon: <FileText className="h-5 w-5" />,
      href: "/treatment-guide",
    },
    {
      label: "Crop Calendar",
      icon: <Sun className="h-5 w-5" />,
      href: "/crop-calendar",
    },
    {
      label: "IoT Devices",
      icon: <Wifi className="h-5 w-5" />,
      href: "/iot-devices",
    },
  ];

  return (
    <div
      className={cn(
        "fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 bg-sidebar transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <div className="py-4">
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-agriculture-primary">Menu</h2>
            <div className="h-8 w-8 bg-agriculture-accent/20 rounded-full flex items-center justify-center text-agriculture-accent">
              <span className="text-xs font-medium">KE</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Smart farming for Kenya</p>
        </div>
        
        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-sm rounded-lg transition-colors touch-manipulation",
                location.pathname === item.href
                  ? "bg-agriculture-primary text-white"
                  : "hover:bg-agriculture-primary/10 text-foreground hover:text-agriculture-primary"
              )}
            >
              <div
                className={cn(
                  "mr-3",
                  location.pathname === item.href
                    ? "text-white"
                    : "text-agriculture-primary"
                )}
              >
                {item.icon}
              </div>
              <span className="text-sm md:text-base">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-agriculture-primary/10 rounded-lg p-3">
          <h3 className="text-sm font-medium text-agriculture-primary">Kenya Offline Mode</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Your crop data stored for use in remote areas
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
