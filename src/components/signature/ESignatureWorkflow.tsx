
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PenTool, 
  Users, 
  FileSignature, 
  Check, 
  Send, 
  UserCheck, 
  Clock, 
  Copy, 
  Shield, 
  Key, 
  Layout 
} from 'lucide-react';

export const ESignatureWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSignature className="mr-2 h-5 w-5 text-primary" />
          E-Signature Integration Plan
        </CardTitle>
        <CardDescription>
          Implementation roadmap for adding e-signature capabilities to Accord AI
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="implementation">Implementation</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">E-Signature Integration</h3>
              <p className="text-sm text-muted-foreground">
                The e-signature module will allow users to prepare, send, sign, and track documents
                requiring signatures, all within the Accord AI platform. This creates a complete
                contract lifecycle management solution.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <PenTool className="h-4 w-4 mr-2 text-primary" />
                    Preparation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Document upload or AI creation</li>
                    <li>Signature field placement</li>
                    <li>Assign signers and roles</li>
                    <li>Set signing order & expiration</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Send className="h-4 w-4 mr-2 text-primary" />
                    Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Email notifications to signers</li>
                    <li>Secure access links</li>
                    <li>Optional access codes</li>
                    <li>Automated reminders</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Audit trails and logging</li>
                    <li>Legal disclosures</li>
                    <li>Signer identity verification</li>
                    <li>Tamper-evident seals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
              <h4 className="font-medium mb-2 flex items-center">
                <Key className="h-4 w-4 mr-2 text-primary" />
                Integration with AI Capabilities
              </h4>
              <p className="text-sm text-muted-foreground">
                The e-signature process will leverage Accord AI's intelligence to:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li>Auto-detect signature fields in documents</li>
                <li>Suggest appropriate signers based on document context</li>
                <li>Flag potentially problematic clauses before sending</li>
                <li>Optimize signing workflow based on document complexity</li>
                <li>Provide automated guidance throughout the signing process</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="workflow" className="space-y-6">
            <h3 className="text-lg font-medium">E-Signature Workflow</h3>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border z-0"></div>
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <Layout className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">1. Document Preparation</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload an existing document or use Accord AI to generate a new document 
                      that needs signatures. The AI will automatically detect potential signature fields.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <PenTool className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">2. Signature Setup</h4>
                    <p className="text-sm text-muted-foreground">
                      Specify signature, initial, date, and form fields. Drag and drop to position 
                      fields on the document. The AI can suggest optimal field placement based on 
                      document type.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">3. Signer Assignment</h4>
                    <p className="text-sm text-muted-foreground">
                      Add signers by email, assign roles, and set the signing order. Enable authentication 
                      methods like access codes or phone verification for enhanced security.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">4. Document Distribution</h4>
                    <p className="text-sm text-muted-foreground">
                      Send the document to all signers with personalized email notifications. 
                      Set expiration dates and automated reminder schedules.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">5. Status Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor real-time signature status, view who has signed, and who still needs to sign. 
                      Receive notifications when documents are viewed, signed, or declined.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/30">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4 bg-card rounded-lg p-4 border border-border/60 shadow-sm flex-grow">
                    <h4 className="font-medium mb-1">6. Completion</h4>
                    <p className="text-sm text-muted-foreground">
                      Once all parties have signed, the document is finalized with a digital 
                      certificate. All participants receive a copy of the completed document 
                      with audit trail and certificate of completion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="implementation" className="space-y-4">
            <h3 className="text-lg font-medium">Implementation Plan</h3>
            <p className="text-sm text-muted-foreground">
              The e-signature functionality will be implemented in phases to ensure robust functionality
              and seamless integration with the existing Accord AI platform.
            </p>
            
            <div className="space-y-4 mt-4">
              <Card className="border-l-4 border-l-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Phase 1: Core Infrastructure</CardTitle>
                  <CardDescription>Estimated timeline: 2-3 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Database schema for signature requests and signers</li>
                    <li>Document preparation interface</li>
                    <li>Basic signature field placement</li>
                    <li>Email notification system</li>
                    <li>Simple signing page for external users</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-primary/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Phase 2: Advanced Features</CardTitle>
                  <CardDescription>Estimated timeline: 3-4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Enhanced signature workflow (sequential & parallel signing)</li>
                    <li>Multiple signature types (draw, type, upload)</li>
                    <li>Authentication methods (access codes, SMS verification)</li>
                    <li>Audit trails and compliance features</li>
                    <li>Reminder system and expiration handling</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Phase 3: AI Integration</CardTitle>
                  <CardDescription>Estimated timeline: 3-4 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Automatic signature field detection</li>
                    <li>Smart signer recommendations</li>
                    <li>Pre-signature document analysis</li>
                    <li>Automated field population based on context</li>
                    <li>Signature process optimization</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Phase 4: Enterprise Features</CardTitle>
                  <CardDescription>Estimated timeline: 4-6 weeks</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Team management and permissions</li>
                    <li>Template library for common signature documents</li>
                    <li>Bulk send capabilities</li>
                    <li>Advanced analytics and reporting</li>
                    <li>API for external integrations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
              <h4 className="font-medium mb-2">Technology Stack</h4>
              <p className="text-sm text-muted-foreground">
                The e-signature functionality will leverage our existing Supabase backend with:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                <li>Dedicated signature tables and RLS policies</li>
                <li>Edge functions for signature handling and verification</li>
                <li>Supabase storage for document management</li>
                <li>Email service integration for notifications</li>
                <li>Front-end components for document viewing and signing</li>
              </ul>
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copy Implementation Plan
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};
