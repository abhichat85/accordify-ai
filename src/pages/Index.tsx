
import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Helmet } from "react-helmet";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Accord AI | Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease." />
      </Helmet>
      <MainLayout />
    </>
  );
};

export default Index;
