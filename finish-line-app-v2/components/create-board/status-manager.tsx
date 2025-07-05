"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface StatusManagerProps {
  statuses: string[];
  onStatusesChange: (statuses: string[]) => void;
}

const statusColors = [
  "bg-gray-100 text-gray-800 border-gray-200",
  "bg-blue-100 text-blue-800 border-blue-200", 
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-red-100 text-red-800 border-red-200",
];

export function StatusManager({ statuses, onStatusesChange }: StatusManagerProps) {
  const [newStatus, setNewStatus] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addStatus = () => {
    if (newStatus.trim() && !statuses.includes(newStatus.trim())) {
      onStatusesChange([...statuses, newStatus.trim()]);
      setNewStatus("");
    }
  };

  const removeStatus = (statusToRemove: string) => {
    if (statuses.length > 3) { // Ensure at least three statuses remain
      onStatusesChange(statuses.filter(status => status !== statusToRemove));
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newStatuses = [...statuses];
    const draggedItem = newStatuses[draggedIndex];
    
    // Remove the dragged item
    newStatuses.splice(draggedIndex, 1);
    
    // Insert at the new position
    newStatuses.splice(dropIndex, 0, draggedItem);
    
    onStatusesChange(newStatuses);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addStatus();
    }
  };

  return (
    <div className="space-y-3">
      {/* Add new status */}
      <div className="flex gap-2">
        <Input
          placeholder="Add new status..."
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button"
          onClick={addStatus}
          disabled={!newStatus.trim() || statuses.includes(newStatus.trim())}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Current statuses - Compact horizontal layout */}
      <div className="border rounded-lg p-3 bg-muted/20">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-1.5 pl-2 pr-1 py-1.5 border rounded-md bg-background shadow-sm min-w-0 cursor-move transition-all ${
                draggedIndex === index ? 'opacity-50 scale-95' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index ? 'border-blue-400 bg-blue-50' : ''
              }`}
            >
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {index + 1}
              </span>
              <Badge 
                variant="outline"
                className={`text-xs px-2 py-0.5 ${statusColors[index % statusColors.length]} border-0`}
              >
                {status}
              </Badge>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                onClick={() => removeStatus(status)}
                disabled={statuses.length === 3}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
