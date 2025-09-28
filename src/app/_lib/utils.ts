import { faker } from "@faker-js/faker";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircle2,
  CircleCheck,
  CircleHelp,
  CircleIcon,
  CircleX,
  Timer,
} from "lucide-react";

import { type Cattle, cattle } from "@/db/schema";

export function getStatusIcon(status: Cattle["healthStatus"]) {
  const statusIcons = {
    HEALTHY: CircleCheck,
    MINOR_ISSUE: CircleHelp,
    SICK: CircleX,
    CRITICAL: CircleX,
  };

  return statusIcons[status] || CircleIcon;
}

export function getPriorityIcon(priority: "high" | "low" | "medium") {
  const priorityIcons = {
    high: ArrowUpIcon,
    low: ArrowDownIcon,
    medium: ArrowRightIcon,
  };

  return priorityIcons[priority] || CircleIcon;
}
