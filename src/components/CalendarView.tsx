import { useMemo } from "react";
import { TripItem } from "@/data/tripData";
import { 
  format, 
  eachDayOfInterval, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  parseISO,
  isWithinInterval,
  eachWeekOfInterval
} from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  items: TripItem[];
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

export function CalendarView({ items, selectedDate, onDateSelect }: CalendarViewProps) {
  // Calculate trip date range
  const tripRange = useMemo(() => {
    const allDates = items.flatMap(item => [
      parseISO(item.start.split("T")[0]),
      parseISO(item.end.split("T")[0])
    ]);
    
    const startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    return { start: startDate, end: endDate };
  }, [items]);

  // Get all weeks that span the trip
  const weeks = useMemo(() => {
    const tripStart = startOfWeek(tripRange.start);
    const tripEnd = endOfWeek(tripRange.end);
    
    return eachWeekOfInterval({ start: tripStart, end: tripEnd });
  }, [tripRange]);

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

  // Check if date is within trip range
  const isInTripRange = (date: Date) => {
    return isWithinInterval(date, tripRange) || 
           isSameDay(date, tripRange.start) || 
           isSameDay(date, tripRange.end);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-lg shadow-card border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <h2 className="font-display text-xl font-semibold text-foreground text-center">
          {format(tripRange.start, "dd MMM")} – {format(tripRange.end, "dd MMM yyyy")}
        </h2>
      </div>

      {/* Week days header */}
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
        {weekDays.map(day => (
          <div 
            key={day} 
            className="p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid - all weeks */}
      <div className="divide-y divide-border/30">
        {weeks.map((weekStart, weekIdx) => {
          const weekEnd = endOfWeek(weekStart);
          const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
          
          // Check if this is a new month to show month label
          const firstDayOfMonth = daysInWeek.find(d => d.getDate() === 1);
          
          return (
            <div key={weekIdx}>
              {/* Month label if new month starts */}
              {firstDayOfMonth && weekIdx > 0 && (
                <div className="bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {format(firstDayOfMonth, "MMMM yyyy")}
                </div>
              )}
              {weekIdx === 0 && (
                <div className="bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {format(weekStart, "MMMM yyyy")}
                </div>
              )}
              
              <div className="grid grid-cols-7">
                {daysInWeek.map((day, dayIdx) => {
                  const stays = getStaysForDate(day);
                  const flights = getFlightsForDate(day);
                  const inTrip = isInTripRange(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const hasContent = stays.length > 0 || flights.length > 0;

                  return (
                    <button
                      key={dayIdx}
                      onClick={() => onDateSelect(isSelected ? null : day)}
                      className={cn(
                        "min-h-[70px] md:min-h-[90px] p-1.5 border-r border-border/30 last:border-r-0 text-left transition-all relative",
                        !inTrip && "bg-muted/20",
                        inTrip && "bg-card hover:bg-muted/50",
                        isSelected && "ring-2 ring-primary ring-inset bg-primary/5",
                        hasContent && "cursor-pointer"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-medium",
                        !inTrip && "text-muted-foreground/40",
                        inTrip && "text-foreground",
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
                        {stays.slice(0, 1).map((stay, sidx) => (
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
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
