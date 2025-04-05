import React, { useEffect, useState } from "react";
import { GenerationProgress, getGenerationProgress, subscribeToGenerationProgress } from "@/services/contractAnalysis";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function ContractGenerationProgress() {
  const [progress, setProgress] = useState<GenerationProgress>(getGenerationProgress());
  
  useEffect(() => {
    // Subscribe to progress updates
    const unsubscribe = subscribeToGenerationProgress(setProgress);
    return unsubscribe;
  }, []);
  
  // Don't render anything if generation is not in progress
  if (progress.status === 'idle') {
    return null;
  }
  
  // Calculate percentage for progress bar
  let percentage = 0;
  if (progress.status === 'generating-outline') {
    percentage = 5; // Outline generation is 5% of the total
  } else if (progress.status === 'generating-sections') {
    // Outline is 5%, sections are 95%
    const sectionPercentage = progress.totalSections > 0 
      ? (progress.completedSections / progress.totalSections) * 95 
      : 0;
    percentage = 5 + sectionPercentage;
  } else if (progress.status === 'completed') {
    percentage = 100;
  }
  
  // Format estimated time remaining
  const formatTimeRemaining = (ms?: number): string => {
    if (!ms) return 'Calculating...';
    
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${seconds % 60} second${seconds % 60 !== 1 ? 's' : ''}`;
  };
  
  return (
    <Card className="w-full mb-4 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Generating Contract</CardTitle>
          <StatusBadge status={progress.status} />
        </div>
        <CardDescription>
          {progress.status === 'generating-outline' && 'Creating contract structure...'}
          {progress.status === 'generating-sections' && progress.currentSectionTitle && 
            `Generating: ${progress.currentSectionTitle}`}
          {progress.status === 'completed' && 'Contract generation complete!'}
          {progress.status === 'error' && `Error: ${progress.error || 'Unknown error'}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              {progress.status === 'generating-sections' && (
                <span>
                  {progress.completedSections} of {progress.totalSections} sections
                </span>
              )}
            </div>
            <div>
              {progress.status === 'generating-sections' && progress.estimatedTimeRemaining && (
                <span>
                  Estimated time remaining: {formatTimeRemaining(progress.estimatedTimeRemaining)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: GenerationProgress['status'] }) {
  switch (status) {
    case 'generating-outline':
    case 'generating-sections':
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary flex gap-1 items-center">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Generating</span>
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500">
          Completed
        </Badge>
      );
    case 'error':
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500">
          Error
        </Badge>
      );
    default:
      return null;
  }
}
