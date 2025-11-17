"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Import Label component
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { PaperData } from "@/modules/shared/types/paper.types";
import { Check, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaperMultiSelectDialogProps {
  options: { label: string; value: string }[];
  selected: string[];
  onSelectedChange: (selectedValues: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
}

export function PaperMultiSelectDialog({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select papers...",
  isLoading,
}: PaperMultiSelectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentSelected, setCurrentSelected] = useState<string[]>(selected);

  useEffect(() => {
    setCurrentSelected(selected);
  }, [selected]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleToggle = (value: string) => {
    setCurrentSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSave = () => {
    onSelectedChange(currentSelected);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setCurrentSelected(selected); // Revert to original selected
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between"
          disabled={isLoading}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Papers</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex flex-col overflow-hidden">
          <Command className="flex-grow">
            <CommandInput
              placeholder="Search papers..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>No papers found.</CommandEmpty>
            <ScrollArea className="flex-grow p-1">
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Use label for search matching
                    onSelect={() => handleToggle(option.value)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`paper-${option.value}`}
                        checked={currentSelected.includes(option.value)}
                        onCheckedChange={() => handleToggle(option.value)}
                      />
                      <Label htmlFor={`paper-${option.value}`}>{option.label}</Label>
                    </div>
                    {currentSelected.includes(option.value) && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </Command>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Select ({currentSelected.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
