
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import SoilHealth from "./pages/SoilHealth";
import Weather from "./pages/Weather";
import CommunityReports from "./pages/CommunityReports";
import TreatmentGuide from "./pages/TreatmentGuide";
import CropCalendar from "./pages/CropCalendar";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/community" element={<CommunityReports />} />
          <Route path="/treatment-guide" element={<TreatmentGuide />} />
          <Route path="/crop-calendar" element={<CropCalendar />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
