import { useState, useMemo } from "react";
import { TripItem } from "@/data/tripData";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  items: TripItem[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export function CalendarView({ items, selectedDate, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1)); // Start at Jan 2026

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get stays that overlap with a specific date
  const getStaysForDate = (date: Date): TripItem[] => {
    return items.filter(item => {
      if (item.type !== "stay") return false;
      const startDate = parseISO(item.start);
      const endDate = parseISO(item.end);
      return isWithinInterval(date, { start: startDate, end: endDate }) ||
             isSameDay(date, startDate) ||
             isSameDay(date, endDate);
    });
  };

  // Get flights for a specific date
  const getFlightsForDate = (date: Date): TripItem[] => {
    return items.filter(item => {
      if (item.type !== "flight") return false;
      const flightDate = parseISO(item.start.split("T")[0]);
      return isSameDay(date, flightDate);
    });
  };

  const hasEvents = (date: Date) => {
    return getStaysForDate(date).length > 0 || getFlightsForDate(date).length > 0;
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="hover:bg-muted"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-display text-xl font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="hover:bg-muted"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const stays = getStaysForDate(day);
          const flights = getFlightsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const hasContent = stays.length > 0 || flights.length > 0;

          return (
            <button
              key={idx}
              onClick={() => onDateSelect(isSelected ? null : day)}
              className={cn(
                "min-h-[80px] md:min-h-[100px] p-1.5 border-b border-r border-border/30 text-left transition-all relative",
                !isCurrentMonth && "bg-muted/30",
                isCurrentMonth && "bg-card hover:bg-muted/50",
                isSelected && "ring-2 ring-primary ring-inset bg-primary/5",
                hasContent && "cursor-pointer"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                !isCurrentMonth && "text-muted-foreground/50",
                isCurrentMonth && "text-foreground",
                isSelected && "text-primary"
              )}>
                {format(day, "d")}
              </span>

              <div className="mt-1 space-y-0.5 overflow-hidden">
                {/* Show flights first */}
                {flights.map((flight, fidx) => (
                  <div 
                    key={`f-${fidx}`}
                    className="text-[10px] md:text-xs px-1.5 py-0.5 rounded bg-flight/15 text-flight font-medium truncate"
                  >
                    {flight.from}→{flight.to}
                  </div>
                ))}
                
                {/* Show stays */}
                {stays.slice(0, 2).map((stay, sidx) => (
                  <div 
                    key={`s-${sidx}`}
                    className="text-[10px] md:text-xs px-1.5 py-0.5 rounded font-medium truncate"
                    style={{ 
                      backgroundColor: `${stay.color}20`,
                      color: stay.color 
                    }}
                  >
                    {stay.place}
                  </div>
                ))}
                
                {stays.length > 2 && (
                  <div className="text-[10px] text-muted-foreground pl-1">
                    +{stays.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
