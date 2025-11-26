import { useState } from "react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = "Select...",
  className,
}: MultiSelectDropdownProps) {
  const toggleOption = (optionValue: string) => {
    onChange(
      selected.includes(optionValue)
        ? selected.filter(o => o !== optionValue)
        : [...selected, optionValue]
    )
  }

  const selectedLabels = options.filter(o => selected.includes(o.value)).map(o => o.label);

  return (
    <Popover>
      <PopoverTrigger className={`w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${className}`}>
        {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            {options.map(option => (
              <CommandItem key={option.value} onSelect={() => toggleOption(option.value)}>
                <Checkbox checked={selected.includes(option.value)} className="mr-2" />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
