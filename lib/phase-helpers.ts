// lib/phase-helpers.ts

import type { ProjectPhase, PhaseWithChildren } from "@/lib/supabase";

export type PhaseStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Pending";

/**
 * Computes the status of a phase based on completion state
 * @param phase - The phase to check status for
 * @param children - Optional children if this is a parent phase
 * @param parentStatus - Optional parent status if this is a child phase
 */
export function getPhaseStatus(
  phase: ProjectPhase | PhaseWithChildren,
  children?: ProjectPhase[],
  parentStatus?: PhaseStatus
): PhaseStatus {
  // If it's a child phase (has parent_phase_id)
  if (phase.parent_phase_id) {
    if (phase.is_completed) {
      return "Completed";
    }

    // If parent is "Not Started", child should also be "Not Started"
    // If parent is "In Progress", incomplete child should be "Pending"
    return parentStatus === "In Progress" ? "Pending" : "Not Started";
  }

  // If it's a parent phase
  const phaseChildren = "children" in phase ? phase.children : children;

  if (!phaseChildren || phaseChildren.length === 0) {
    // Parent with no children - treat as regular phase
    return phase.is_completed ? "Completed" : "Not Started";
  }

  // Parent with children - check children completion
  const completedChildren = phaseChildren.filter(
    (child) => child.is_completed
  ).length;
  const totalChildren = phaseChildren.length;

  if (completedChildren === 0) {
    return "Not Started";
  } else if (completedChildren === totalChildren) {
    return "Completed";
  } else {
    return "In Progress";
  }
}

/**
 * Gets the appropriate color classes for a status badge
 */
export function getStatusColorClasses(status: PhaseStatus): string {
  switch (status) {
    case "Not Started":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}
