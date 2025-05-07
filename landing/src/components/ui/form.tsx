import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

// Use the native form attributes directly without an empty interface
type FormProps = React.FormHTMLAttributes<HTMLFormElement>

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn("space-y-6", className)}
        {...props}
      />
    );
  }
);
Form.displayName = "Form";

interface FormFieldProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ name, label, description, error, children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {label && (
          <Label htmlFor={name} className="font-medium">
            {label}
          </Label>
        )}
        {children}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-xs text-destructive animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { Form, FormField };
