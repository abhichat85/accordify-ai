import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContractSummary, SummaryActionPoint } from '@/services/contractAnalysis';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle, 
  CalendarClock, 
  Circle, 
  AlertTriangle, 
  Clock, 
  ArrowRightCircle, 
  FileText,
  Calendar 
} from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary?: ContractSummary | null;
  isLoading: boolean;
  error?: string | null;
}

// Priority badge components with color coding
const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive" className="ml-2">High</Badge>;
    case 'medium':
      return <Badge variant="default" className="ml-2 bg-amber-500">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="ml-2">Low</Badge>;
    default:
      return null;
  }
};

// Category badge components with color coding
const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  switch (category) {
    case 'obligation':
      return <Badge variant="secondary" className="ml-2 bg-blue-600">Obligation</Badge>;
    case 'right':
      return <Badge variant="secondary" className="ml-2 bg-green-600">Right</Badge>;
    case 'date':
      return <Badge variant="secondary" className="ml-2 bg-purple-600">Date</Badge>;
    case 'payment':
      return <Badge variant="secondary" className="ml-2 bg-amber-600">Payment</Badge>;
    case 'condition':
      return <Badge variant="secondary" className="ml-2 bg-orange-600">Condition</Badge>;
    case 'restriction':
      return <Badge variant="secondary" className="ml-2 bg-red-600">Restriction</Badge>;
    default:
      return <Badge variant="secondary" className="ml-2">Other</Badge>;
  }
};

const ActionPointCard: React.FC<{ actionPoint: SummaryActionPoint }> = ({ actionPoint }) => {
  const { title, description, priority, category } = actionPoint;
  
  return (
    <Card className="mb-4 border-l-4" 
      style={{ 
        borderLeftColor: 
          priority === 'high' ? 'var(--destructive)' : 
          priority === 'medium' ? 'var(--amber-500)' : 
          'var(--border)' 
      }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold flex items-center">
            {priority === 'high' && <AlertTriangle size={16} className="mr-2 text-destructive" />}
            {priority === 'medium' && <Clock size={16} className="mr-2 text-amber-500" />}
            {priority === 'low' && <ArrowRightCircle size={16} className="mr-2 text-muted-foreground" />}
            {title}
          </CardTitle>
          <div className="flex">
            <PriorityBadge priority={priority} />
            <CategoryBadge category={category} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export const SummaryModal: React.FC<SummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  summary, 
  isLoading,
  error
}) => {
  // First, handle the loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Analyzing Contract</DialogTitle>
            <DialogDescription>
              Summarizing your contract and extracting action points...
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">This may take a moment</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Then, handle error state
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Summarization Error</DialogTitle>
            <DialogDescription>
              There was an error summarizing your contract.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // If the modal is open but we don't have a summary yet (not loading/error but summary is null),
  // show a placeholder to prevent rendering errors
  if (!summary && isOpen) {
    return (
      <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Contract Summary</DialogTitle>
            <DialogDescription>
              No summary data is available.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            The summary could not be generated.
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // If the modal is not open or we don't have a summary, don't render anything
  if (!isOpen || !summary) {
    return null;
  }

  // Create safe versions of all required properties with fallbacks
  const safeTitle = summary.title || 'Contract Summary';
  const safeOverview = summary.overview || 'Summary of the contract terms and conditions';
  const actionPoints = Array.isArray(summary.actionPoints) ? summary.actionPoints : [];
  const keyTerms = Array.isArray(summary.keyTerms) ? summary.keyTerms : [];
  const dates = Array.isArray(summary.dates) ? summary.dates : [];

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{safeTitle}</DialogTitle>
          <DialogDescription className="text-lg">
            {safeOverview}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="action-points" className="flex-grow flex flex-col overflow-hidden">
          <TabsList className="mb-4">
            <TabsTrigger value="action-points" className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Action Points
            </TabsTrigger>
            <TabsTrigger value="key-terms" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Key Terms
            </TabsTrigger>
            <TabsTrigger value="key-dates" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" /> Important Dates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="action-points" className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="pr-4">
                {actionPoints.length > 0 ? (
                  actionPoints.map((actionPoint, index) => (
                    <ActionPointCard key={index} actionPoint={actionPoint} />
                  ))
                ) : (
                  <Alert>
                    <Circle className="h-4 w-4" />
                    <AlertTitle>No action points</AlertTitle>
                    <AlertDescription>
                      No specific action points were identified in this contract.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="key-terms" className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="pr-4">
                {keyTerms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {keyTerms.map((term, index) => (
                      <Card key={index} className="border-t-4 border-t-primary">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-semibold">{term.term}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{term.definition}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <Circle className="h-4 w-4" />
                    <AlertTitle>No key terms</AlertTitle>
                    <AlertDescription>
                      No specific key terms were identified in this contract.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="key-dates" className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="pr-4">
                {dates.length > 0 ? (
                  dates.map((date, index) => (
                    <Card key={index} className="mb-4 border-l-4 border-l-purple-600">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-semibold flex items-center">
                            <CalendarClock className="mr-2 h-4 w-4 text-purple-600" />
                            {date.title}
                          </CardTitle>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800">
                            {date.date}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{date.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Alert>
                    <Circle className="h-4 w-4" />
                    <AlertTitle>No key dates</AlertTitle>
                    <AlertDescription>
                      No specific dates or deadlines were identified in this contract.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose} variant="secondary" className="mr-2">Close</Button>
          <Button variant="default">
            <FileText className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
