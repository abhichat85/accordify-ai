import * as React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerElement?: React.ReactNode;
}

export function WaitlistModal({ open, onOpenChange, triggerElement }: WaitlistModalProps) {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !acceptTerms) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and accept the terms.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        onOpenChange(false);
        setEmail("");
        setName("");
        setCompany("");
        setAcceptTerms(false);
        setIsSubmitted(false);
        
        toast({
          title: "Success!",
          description: "You've been added to our waitlist. We'll be in touch soon!",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerElement && <DialogTrigger asChild>{triggerElement}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Join the Waitlist</DialogTitle>
          <DialogDescription>
            Get early access to Accord AI's intelligent contract platform.
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                required
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground">
                I agree to receive email updates about Accord AI and accept the{" "}
                <a href="#" className="underline text-primary">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline text-primary">
                  Privacy Policy
                </a>
                .
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Join Waitlist"}
            </Button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium">Thank You!</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              You've been added to our waitlist. We'll notify you when you're granted access.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
