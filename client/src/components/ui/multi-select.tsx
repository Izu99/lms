"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge"; // Assuming a Badge component exists

export type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onSelectedChange: (selected: string[]) => void;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onSelectedChange,
  placeholder = "Select options...",
  isLoading = false,
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSelect = React.useCallback(
    (value: string) => {
      const newSelected = selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value];
      onSelectedChange(newSelected);
    },
    [selected, onSelectedChange]
  );

  const handleClear = React.useCallback(() => {
    onSelectedChange([]);
  }, [onSelectedChange]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto min-h-10 cursor-pointer", className)}
          disabled={isLoading || disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selected.length > 0 ? (
              selected.map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                  option && (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {option.label}
                      <span
                        role="button" // Indicate it's clickable for accessibility
                        tabIndex={0} // Make it focusable
                        className="h-auto w-auto p-0.5 text-muted-foreground hover:bg-transparent hover:text-foreground cursor-pointer rounded-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelect(value);
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  )
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        style={{ zIndex: 9999 }}
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <CommandItem className="flex justify-center py-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </CommandItem>
              ) : (
                filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Use label for searchability
                    onSelect={() => {
                      handleSelect(option.value);
                      setInputValue(""); // Clear input after selection
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Clear all
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
