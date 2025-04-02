
import { AgentCapability } from "../types";
import { 
  FileText,
  FileCheck,
  BrainCircuit,
  Workflow,
  AlarmClock
} from "lucide-react";

export const useAgentCapabilities = (): AgentCapability[] => {
  return [
    { 
      id: "draft", 
      name: "Draft", 
      icon: FileText,
      description: "Generate new contracts and agreements",
      examples: ["Create an NDA for my startup", "Draft a consulting agreement"]
    },
    { 
      id: "review", 
      name: "Review", 
      icon: FileCheck,
      description: "Analyze and improve existing contracts",
      examples: ["Review this employment contract", "Check this NDA for issues"]
    },
    { 
      id: "negotiate", 
      name: "Negotiate", 
      icon: BrainCircuit,
      description: "Get negotiation guidance and suggestions",
      examples: ["Suggest negotiation points for this contract", "How should I counter these terms?"]
    },
    { 
      id: "compare", 
      name: "Compare", 
      icon: Workflow,
      description: "Compare different contract versions",
      examples: ["Compare these two contract versions", "What changed in this revision?"]
    },
    { 
      id: "remind", 
      name: "Calendar", 
      icon: AlarmClock,
      description: "Manage contract deadlines and renewals",
      examples: ["Track renewal dates for this contract", "Remind me of upcoming deadlines"]
    }
  ];
};
