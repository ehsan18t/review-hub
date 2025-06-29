import { AppProvider } from "@/contexts/AppContext";
import React from "react";
import { HomePageContent } from "./HomePage";
import Navigation from "./Navigation";

const Dashboard: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <HomePageContent />
      </div>
    </AppProvider>
  );
};

export default Dashboard;
