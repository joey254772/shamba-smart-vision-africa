
import React from "react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  className?: string;
}

const StatusCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatusCardProps) => {
  return (
    <div className={cn("dashboard-card p-5", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <div className="flex items-end gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <div
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        <div className="feature-icon">{icon}</div>
      </div>
    </div>
  );
};

export default StatusCard;
