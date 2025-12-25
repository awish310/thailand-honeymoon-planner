import { Calendar, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-lg p-1 shadow-sm">
      <button
        onClick={() => onViewChange("calendar")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          view === "calendar" 
            ? "bg-card text-foreground shadow-card" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Calendar className="w-4 h-4" />
        <span className="hidden sm:inline">Calendar</span>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
          view === "list" 
            ? "bg-card text-foreground shadow-card" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="w-4 h-4" />
        <span className="hidden sm:inline">List</span>
      </button>
    </div>
  );
}
