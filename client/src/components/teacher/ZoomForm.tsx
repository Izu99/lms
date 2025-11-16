"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { TeacherZoomService } from "@/modules/shared/services/ZoomService";
import { Textarea } from "@/components/ui/textarea";
import { useTeacherInstitutes } from "@/modules/teacher/hooks/useTeacherInstitutes";
import { useTeacherYears } from "@/modules/teacher/hooks/useTeacherYears";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ZoomFormProps {
  onSuccess: () => void;
}

export function ZoomForm({ onSuccess }: ZoomFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [institute, setInstitute] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { institutes } = useTeacherInstitutes();
  const { years } = useTeacherYears();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !zoomLink || !institute || !year) {
      toast.error("Title, Zoom link, institute, and year are required");
      return;
    }
    setIsLoading(true);
    try {
      await TeacherZoomService.createZoomLink(title, description, zoomLink, institute, year);
      toast.success("Zoom link saved successfully");
      setTitle("");
      setDescription("");
      setZoomLink("");
      setInstitute("");
      setYear("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save Zoom link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Meeting Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <Textarea
        placeholder="Meeting Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="url"
        placeholder="Enter your Zoom meeting link"
        value={zoomLink}
        onChange={(e) => setZoomLink(e.target.value)}
        disabled={isLoading}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select onValueChange={setInstitute} value={institute}>
          <SelectTrigger>
            <SelectValue placeholder="Select Institute" />
          </SelectTrigger>
          <SelectContent>
            {institutes.map((inst) => (
              <SelectItem key={inst._id} value={inst._id}>
                {inst.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setYear} value={year}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((yr) => (
              <SelectItem key={yr._id} value={yr._id}>
                {yr.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Zoom Link"}
      </Button>
    </form>
  );
}
