"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = 
  | 'date-created'
  | 'date-modified'
  | 'priority'
  | 'deadline';

interface TaskSortDropdownProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

export function TaskSortDropdown({ value, onValueChange }: TaskSortDropdownProps) {
  const sortOptions = [
    { value: 'date-created', label: 'Date Created' },
    { value: 'date-modified', label: 'Date Modified' },
    { value: 'priority', label: 'Priority' },
    { value: 'deadline', label: 'Closest Deadline' },
  ] as const;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sort by:</span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[160px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3" />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
