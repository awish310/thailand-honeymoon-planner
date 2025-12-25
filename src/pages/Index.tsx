import { useState, useEffect } from "react";
import { TRIP_ITEMS, TripItem } from "@/data/tripData";
import { TripHeader } from "@/components/TripHeader";
import { ViewToggle } from "@/components/ViewToggle";
import { CalendarView } from "@/components/CalendarView";
import { ListView } from "@/components/ListView";
import { TripItemForm } from "@/components/TripItemForm";
import { format } from "date-fns";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STORAGE_KEY = "trip-items";

const Index = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [items, setItems] = useState<TripItem[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : TRIP_ITEMS;
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    setEditingIndex(null);
    setFormOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormOpen(true);
  };

  const handleDelete = (index: number) => {
    const item = items[index];
    setItems(prev => prev.filter((_, i) => i !== index));
    toast.success(`Deleted "${item.title}"`);
  };

  const handleSave = (item: TripItem) => {
    if (editingIndex !== null) {
      setItems(prev => prev.map((existing, i) => i === editingIndex ? item : existing));
      toast.success(`Updated "${item.title}"`);
    } else {
      setItems(prev => [...prev, item].sort((a, b) => a.start.localeCompare(b.start)));
      toast.success(`Added "${item.title}"`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-4 md:py-8">
        <TripHeader items={items} />
        
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <ViewToggle view={view} onViewChange={setView} />
            <Button onClick={handleAdd} size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
          
          {selectedDate && (
            <div className="flex items-center gap-2 animate-scale-in">
              <span className="text-sm text-muted-foreground">
                Showing: <span className="font-medium text-foreground">{format(selectedDate, "dd MMM yyyy")}</span>
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => setSelectedDate(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={view === "calendar" ? "block" : "hidden"}>
          <div className="grid lg:grid-cols-[1fr,380px] gap-6">
            <CalendarView 
              items={items} 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <div className="lg:sticky lg:top-4 lg:self-start">
              <div className="bg-card rounded-lg shadow-card border border-border/50 p-4">
                <h3 className="font-display text-lg font-semibold mb-4">
                  {selectedDate 
                    ? format(selectedDate, "EEEE, dd MMM") 
                    : "All Events"
                  }
                </h3>
                <div className="max-h-[60vh] overflow-y-auto pr-1">
                  <ListView 
                    items={items} 
                    selectedDate={selectedDate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={view === "list" ? "block" : "hidden"}>
          <ListView 
            items={items} 
            selectedDate={selectedDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <TripItemForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        item={editingIndex !== null ? items[editingIndex] : undefined}
      />
    </div>
  );
};

export default Index;
