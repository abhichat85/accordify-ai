import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Accord AI | Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease." />
      </Helmet>
      <div className="w-full h-full">
        <MainLayout />
      </div>
    </>
  );
};

export default Index;
