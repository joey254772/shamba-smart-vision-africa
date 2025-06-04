
import React from "react";
import Layout from "@/components/layout/Layout";
import ImageUploader from "@/components/disease-detection/ImageUploader";
import DetectionResults from "@/components/disease-detection/DetectionResults";
import { Card, CardContent } from "@/components/ui/card";

const DiseaseDetection = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Disease Detection</h1>
        <p className="text-muted-foreground">
          Upload plant images to identify diseases and get treatment recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <ImageUploader />
          <Card className="dashboard-card mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">How to take a good photo</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="text-agriculture-primary mr-2">•</span>
                  <span>Ensure good lighting - natural daylight works best</span>
                </li>
                <li className="flex items-start">
                  <span className="text-agriculture-primary mr-2">•</span>
                  <span>Focus clearly on the affected area (leaves, stems, fruits)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-agriculture-primary mr-2">•</span>
                  <span>Include both healthy and infected parts for comparison</span>
                </li>
                <li className="flex items-start">
                  <span className="text-agriculture-primary mr-2">•</span>
                  <span>Take multiple photos from different angles for best results</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <DetectionResults />
      </div>
    </Layout>
  );
};

export default DiseaseDetection;
