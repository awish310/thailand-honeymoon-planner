import { useState } from "react";
import { TRIP_ITEMS } from "@/data/tripData";
import { TripHeader } from "@/components/TripHeader";
import { ViewToggle } from "@/components/ViewToggle";
import { CalendarView } from "@/components/CalendarView";
import { ListView } from "@/components/ListView";
import { format } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-4 md:py-8">
        <TripHeader items={TRIP_ITEMS} />
        
        {/* Controls */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <ViewToggle view={view} onViewChange={setView} />
          
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
              items={TRIP_ITEMS} 
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
                  <ListView items={TRIP_ITEMS} selectedDate={selectedDate} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={view === "list" ? "block" : "hidden"}>
          <ListView items={TRIP_ITEMS} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default Index;
