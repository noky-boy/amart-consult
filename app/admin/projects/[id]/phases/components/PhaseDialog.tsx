"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { ProjectPhase } from "@/lib/supabase";

interface PhaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: PhaseFormData) => Promise<void>;
  phase?: ProjectPhase | null;
  isParentPhase?: boolean;
  title?: string;
}

export interface PhaseFormData {
  phase_name: string;
  phase_description: string;
  estimated_duration: string;
  phase_weight: number;
  parent_phase_id?: string | null;
}

export function PhaseDialog({
  open,
  onOpenChange,
  onSave,
  phase,
  isParentPhase = true,
  title,
}: PhaseDialogProps) {
  const [formData, setFormData] = useState<PhaseFormData>({
    phase_name: "",
    phase_description: "",
    estimated_duration: "",
    phase_weight: isParentPhase ? 10 : 1,
    parent_phase_id: null,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (phase) {
      setFormData({
        phase_name: phase.phase_name,
        phase_description: phase.phase_description || "",
        estimated_duration: phase.estimated_duration || "",
        phase_weight: phase.phase_weight,
        parent_phase_id: phase.parent_phase_id,
      });
    } else {
      setFormData({
        phase_name: "",
        phase_description: "",
        estimated_duration: "",
        phase_weight: isParentPhase ? 10 : 1,
        parent_phase_id: null,
      });
    }
    setErrors({});
  }, [phase, open, isParentPhase]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phase_name.trim()) {
      newErrors.phase_name = "Phase name is required";
    }

    if (formData.phase_weight <= 0) {
      newErrors.phase_weight = "Weight must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save phase:", err);
    } finally {
      setSaving(false);
    }
  };

  const dialogTitle = title || (phase ? "Edit Phase" : "Add New Phase");
  const dialogDescription = phase
    ? "Update the phase details below"
    : "Create a new phase for this project";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="phase_name">
              Phase Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phase_name"
              value={formData.phase_name}
              onChange={(e) =>
                setFormData({ ...formData, phase_name: e.target.value })
              }
              placeholder="e.g., Foundation Work"
            />
            {errors.phase_name && (
              <p className="text-sm text-red-600">{errors.phase_name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phase_description">Description</Label>
            <Textarea
              id="phase_description"
              value={formData.phase_description}
              onChange={(e) =>
                setFormData({ ...formData, phase_description: e.target.value })
              }
              placeholder="Brief description of this phase"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="estimated_duration">Duration</Label>
              <Input
                id="estimated_duration"
                value={formData.estimated_duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_duration: e.target.value,
                  })
                }
                placeholder="e.g., 2-4 Weeks"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phase_weight">
                Weight <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phase_weight"
                type="number"
                step="0.01"
                min="0"
                value={formData.phase_weight}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phase_weight: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="10"
              />
              {errors.phase_weight && (
                <p className="text-sm text-red-600">{errors.phase_weight}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>{phase ? "Update Phase" : "Add Phase"}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
