
import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Helmet } from "react-helmet";
import { ESignatureWorkflow } from "../components/signature/ESignatureWorkflow";

const Signatures = () => {
  return (
    <>
      <Helmet>
        <title>E-Signatures | Accord AI</title>
        <meta name="description" content="Manage your e-signatures and document signing workflows with Accord AI." />
      </Helmet>
      <MainLayout>
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-foreground">E-Signature Management</h1>
          <ESignatureWorkflow />
        </div>
      </MainLayout>
    </>
  );
};

export default Signatures;
