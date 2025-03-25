
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileSignature, Pen, Upload, Clock, Check, Users, Send } from 'lucide-react';

export const ESignaturePanel: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="px-4 py-3 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium flex items-center">
          <FileSignature className="w-5 h-5 text-primary mr-2" />
          E-Signature Center
        </CardTitle>
        <Button variant="outline" size="sm" className="h-8 px-3">
          <Upload className="w-4 h-4 mr-2" />
          Upload to Sign
        </Button>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Awaiting</h3>
                <p className="text-2xl font-bold">3</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Pen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-1">In Progress</h3>
                <p className="text-2xl font-bold">2</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30 border-border/30">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Completed</h3>
                <p className="text-2xl font-bold">12</p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-sm font-medium mt-6 mb-3">Documents to Sign</h3>
          <div className="space-y-3">
            {["Service Agreement", "Non-Disclosure Agreement", "Employment Contract"].map((doc, index) => (
              <Card key={index} className="bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <FileSignature className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc}</h4>
                      <p className="text-xs text-muted-foreground">From: ABC Corp • Expires in 5 days</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Sign Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <h3 className="text-sm font-medium mt-6 mb-3">Waiting for Others</h3>
          <div className="space-y-3">
            {["Consulting Agreement", "Partnership Agreement"].map((doc, index) => (
              <Card key={index} className="bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc}</h4>
                      <p className="text-xs text-muted-foreground">Waiting on: Jane Doe • Sent 2 days ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Send className="w-4 h-4 mr-2" />
                    Remind
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-6">
            <Button variant="outline" className="w-full">
              View All Documents
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
