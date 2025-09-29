"use client";

import React, { useState } from "react";
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

interface AddSubTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    phase_name: string;
    phase_description: string;
    estimated_duration: string;
    phase_weight: number;
  }) => Promise<void>;
  parentPhaseName: string;
}

export function AddSubTaskDialog({
  open,
  onOpenChange,
  onSave,
  parentPhaseName,
}: AddSubTaskDialogProps) {
  const [formData, setFormData] = useState({
    phase_name: "",
    phase_description: "",
    estimated_duration: "",
    phase_weight: 1,
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.phase_name.trim()) {
      newErrors.phase_name = "Sub-task name is required";
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
      // Reset form
      setFormData({
        phase_name: "",
        phase_description: "",
        estimated_duration: "",
        phase_weight: 1,
      });
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to save sub-task:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Sub-task to {parentPhaseName}</DialogTitle>
          <DialogDescription>
            Create a new sub-task under this parent phase
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subtask_name">
              Sub-task Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subtask_name"
              value={formData.phase_name}
              onChange={(e) =>
                setFormData({ ...formData, phase_name: e.target.value })
              }
              placeholder="e.g., Excavation"
            />
            {errors.phase_name && (
              <p className="text-sm text-red-600">{errors.phase_name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subtask_description">Description</Label>
            <Textarea
              id="subtask_description"
              value={formData.phase_description}
              onChange={(e) =>
                setFormData({ ...formData, phase_description: e.target.value })
              }
              placeholder="Brief description of this sub-task"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="subtask_duration">Duration</Label>
              <Input
                id="subtask_duration"
                value={formData.estimated_duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_duration: e.target.value,
                  })
                }
                placeholder="e.g., 1-2 Days"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtask_weight">
                Weight <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subtask_weight"
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
                placeholder="1"
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
                Adding...
              </>
            ) : (
              "Add Sub-task"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
