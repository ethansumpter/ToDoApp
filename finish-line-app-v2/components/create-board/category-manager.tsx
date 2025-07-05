"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      onCategoriesChange([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    if (categories.length > 1) { // Ensure at least one category remains
      onCategoriesChange(categories.filter(category => category !== categoryToRemove));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Add new category */}
      <div className="flex gap-2">
        <Input
          placeholder="Add new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={addCategory}
          disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Current categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="flex items-center gap-1 py-1 px-2"
          >
            {category}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeCategory(category)}
              disabled={categories.length === 1}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {categories.length < 2 && (
        <div className="text-xs text-muted-foreground">
          You need at least one category. Add more to better organize your tasks.
        </div>
      )}
    </div>
  );
}
