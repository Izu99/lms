"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Award } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface GradePaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attemptId: string, percentage: number) => void;
  attemptId: string;
  initialPercentage: number; // 0-100
}

export function GradePaperModal({
  isOpen,
  onClose,
  onSubmit,
  attemptId,
  initialPercentage,
}: GradePaperModalProps) {
  const [percentage, setPercentage] = useState<string>(initialPercentage.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPercentage(initialPercentage.toString());
    setError(null);
  }, [isOpen, initialPercentage]);

  if (!isOpen) return null;

  const handleSave = () => {
    const parsedPercentage = parseInt(percentage);
    if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
      setError("Please enter a valid percentage between 0 and 100.");
      return;
    }
    setError(null);
    onSubmit(attemptId, parsedPercentage);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-md flex flex-col shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Award size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Grade Paper</h2>
              <p className="text-sm text-muted-foreground">Set the percentage for this submission.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} className="text-muted-foreground" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="percentage-input">Percentage</Label>
            <Input
              id="percentage-input"
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              placeholder="Enter percentage (0-100)"
              className="w-full"
            />
            {error && <p className="text-sm text-destructive-foreground">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Percentage
          </Button>
        </div>
      </div>
    </div>
  );
}
