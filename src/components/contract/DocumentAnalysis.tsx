
import React from "react";
import { DocumentAnalysisContainer } from "./analysis/DocumentAnalysisContainer";

interface DocumentAnalysisProps {
  className?: string;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ className }) => {
  return <DocumentAnalysisContainer className={className} />;
};
