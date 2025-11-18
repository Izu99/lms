import React, { useState, useEffect, useRef } from "react";

interface SearchableMultiSelectProps {
  options: { label: string; value: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function SearchableMultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Choose options...",
}: SearchableMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search
  useEffect(() => {
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Toggle item selection
  function toggleOption(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function renderButtonText() {
    if (selected.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    } else if (selected.length === 1) {
      const label = options.find((o) => o.value === selected[0])?.label || "";
      return <span>{label.length > 20 ? label.slice(0, 20) + "..." : label}</span>;
    } else {
      return <span>{selected.length} items selected</span>;
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-3 py-2 focus:outline-none"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {renderButtonText()}
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 border border-indigo-500 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-600 dark:border-gray-600 dark:text-white"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul tabIndex={-1} role="listbox" aria-multiselectable="true" className="max-h-48 overflow-auto">
            {filteredOptions.length === 0 && (
              <li className="p-3 text-gray-500 text-center">No matching options found</li>
            )}
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                className="flex items-start px-4 py-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-600"
                onClick={() => toggleOption(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => toggleOption(opt.value)}
                  className="mr-2 mt-1 cursor-pointer accent-indigo-600 dark:accent-indigo-400"
                />
                <span className="select-none">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected.length > 0 && (
        <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-wrap gap-2">
          {selected.map((val) => {
            const label = options.find((o) => o.value === val)?.label || val;
            return (
              <span
                key={val}
                className="bg-indigo-600 text-white rounded-full px-3 py-1 text-sm flex items-center gap-2 max-w-[250px] truncate"
                title={label}
              >
                {label}
                <button
                  type="button"
                  onClick={() => toggleOption(val)}
                  className="ml-1 text-white hover:opacity-80 focus:outline-none"
                  aria-label={`Remove ${label}`}
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
