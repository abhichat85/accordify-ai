
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorksSection: React.FC = () => {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Accord AI simplifies contract workflows through intelligent automation and analysis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-background/50 backdrop-blur-sm card-elevation">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-xl font-semibold">Upload or Create</h3>
            <p className="text-muted-foreground">
              Start with an existing contract or create a new one from our template library.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm card-elevation">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-muted-foreground">
              Our AI models analyze the content, identifying risks and suggesting improvements.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/50 backdrop-blur-sm card-elevation">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-xl font-semibold">Finalize & Sign</h3>
            <p className="text-muted-foreground">
              Make revisions based on AI insights, then collect secure electronic signatures.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSection;
