
import { LucideIcon } from "lucide-react";

export interface AgentCapability {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  examples: string[];
}
