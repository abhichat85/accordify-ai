
import { useState } from "react";

export const useProactiveSuggestions = () => {
  const [showProactiveSuggestions, setShowProactiveSuggestions] = useState(true);
  
  const proactiveSuggestions = [
    "I noticed this contract is missing a confidentiality clause. Would you like me to suggest one?",
    "This agreement has payment terms of NET-60. Industry standard is NET-30. Consider negotiating this.",
    "The liability cap is unusually low for this type of agreement. Here's what I recommend...",
    "I noticed similar contracts in your history have included IP protection clauses. Add one?"
  ];

  return {
    showProactiveSuggestions,
    setShowProactiveSuggestions,
    proactiveSuggestions
  };
};
