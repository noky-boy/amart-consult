"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Copy } from "lucide-react";

interface PhaseActionsProps {
  phaseId: string;
  phaseName: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  disabled?: boolean;
}

export function PhaseActions({
  phaseId,
  phaseName,
  onEdit,
  onDelete,
  onDuplicate,
  disabled = false,
}: PhaseActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={disabled}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Phase
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Phase
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Phase
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
