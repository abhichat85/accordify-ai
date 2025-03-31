
import React from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { Helmet } from "react-helmet";
import { ESignatureWorkflow } from "../components/signature/ESignatureWorkflow";

// Add a style block for fullscreen dialog
const fullscreenDialogStyles = `
  .fullscreen-dialog [data-radix-popper-content-wrapper] {
    max-width: 98vw !important;
    max-height: 98vh !important;
    width: 98vw !important;
    height: 98vh !important;
  }
  
  .fullscreen-dialog .relative {
    max-height: 98vh !important;
  }
`;

const Signatures = () => {
  return (
    <>
      <Helmet>
        <title>E-Signatures | Accord AI</title>
        <meta name="description" content="Manage your e-signatures and document signing workflows with Accord AI." />
        <style>{fullscreenDialogStyles}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
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
