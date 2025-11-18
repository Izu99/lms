# How to Create a Searchable Dropdown

This guide explains the common pattern used in this project to create a searchable dropdown menu (like the district selector) that gets its data from a simple text file. Any new developer can follow these steps to create a new dropdown for any kind of data (e.g., product categories, tags, locations, etc.).

### The Core Pattern

The design is simple and reusable:

1.  **Data in a `.txt` File**: The list of items is stored in a simple text file. This makes it easy to view and edit.
2.  **Server Component Reads the File**: A Next.js Server Component reads the `.txt` file and prepares the data as a list (an array). This happens on the server, so it's fast and doesn't expose file system logic to the browser.
3.  **Client Component Displays the UI**: The list is passed as a "prop" to an interactive Client Component. This component's only job is to display the dropdown, handle user input (searching), and manage the selection state.

### Technologies Used

*   **Next.js (React)**: For building the application and handling both server-side and client-side rendering.
*   **shadcn/ui**: The UI component library used in this project. We use:
    *   `Popover`: To create the floating dropdown box.
    *   `Command`: To provide the search input and filterable list.
    *   `Button`: To trigger the dropdown.
*   **Node.js `fs` module**: A built-in tool used on the server to read files from the file system.

--- 

### Step-by-Step "Recipe" to Create a New Dropdown

Let's create a new dropdown for **"Vehicle Brands"**.

#### Step 1: Create the Data File

Create a new `.txt` file in the `src/data/` directory. Name it based on its content.

**File:** `src/data/vehicle-brands.txt`

```txt
Toyota
Honda
Ford
BMW
Mercedes-Benz
Audi
```

#### Step 2: Create the Reusable UI Component

Create a new file for your interactive component. You can copy `src/components/DistrictSearch.tsx` and modify it, or create a new one from scratch.

**File:** `src/components/BrandSearch.tsx`

```tsx
"use client"; // This component is interactive, so it must be a client component.

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// This component expects a prop named `brands` which is an array of strings.
interface BrandSearchProps {
  brands: string[];
}

export function BrandSearch({ brands }: BrandSearchProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[200px] justify-between">
          {value ? brands.find((brand) => brand.toLowerCase() === value.toLowerCase()) : "Select a brand..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search brand..." />
          <CommandList>
            <CommandEmpty>No brand found.</CommandEmpty>
            <CommandGroup>
              {/* Loop over the `brands` array to create the list */}
              {brands.map((brand) => (
                <CommandItem
                  key={brand}
                  value={brand}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value.toLowerCase() === brand.toLowerCase() ? "opacity-100" : "opacity-0")} />
                  {brand}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

#### Step 3: Load Data and Add the Component to a Page

Now, go to any page where you want to display this new dropdown. This page should be a **Server Component** (or have a server-side part) to read the file.

**File:** (Example) `src/app/some-new-page/page.tsx`

```tsx
// This is a Server Component, so we can use Node.js tools like `fs`.
import fs from 'fs';
import path from 'path';
import { BrandSearch } from '@/components/BrandSearch';

export default function SomeNewPage() {
  // 1. Define the path to your new data file.
  const brandsFilePath = path.join(process.cwd(), 'src', 'data', 'vehicle-brands.txt');
  
  // 2. Read the file's content.
  const brandsFileContent = fs.readFileSync(brandsFilePath, 'utf8');
  
  // 3. Convert the file content into a list (array) of strings.
  const brandList = brandsFileContent.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Find Vehicles by Brand</h1>
      
      {/* 4. Render your new component and pass the list of brands to it. */}
      <BrandSearch brands={brandList} />
    </div>
  );
}
```

That's the complete pattern. You can follow these three steps to create a searchable dropdown for any list of data you need.
