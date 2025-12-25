import { TripItem } from "@/data/tripData";
import { TripCard } from "./TripCard";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isSameDay } from "date-fns";

interface ListViewProps {
  items: TripItem[];
  selectedDate: Date | null;
}

export function ListView({ items, selectedDate }: ListViewProps) {
  // Group items by date
  const groupedItems = items.reduce((acc, item) => {
    const dateKey = item.start.split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, TripItem[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedItems).sort();

  // Filter by selected date if any
  const filteredDates = selectedDate
    ? sortedDates.filter(date => {
        const item = items.find(i => i.start.split("T")[0] === date);
        if (!item) return false;
        
        const startDate = startOfDay(parseISO(item.start.split("T")[0]));
        const endDate = item.type === "stay" 
          ? endOfDay(parseISO(item.end.split("T")[0]))
          : endOfDay(startDate);
        
        return isWithinInterval(selectedDate, { start: startDate, end: endDate }) ||
               isSameDay(selectedDate, startDate);
      })
    : sortedDates;

  // If filtering by date, show all relevant items for that date
  const getItemsForDate = (dateKey: string) => {
    if (!selectedDate) return groupedItems[dateKey];
    
    return items.filter(item => {
      const startDate = startOfDay(parseISO(item.start.split("T")[0]));
      const endDate = item.type === "stay" 
        ? endOfDay(parseISO(item.end.split("T")[0]))
        : endOfDay(startDate);
      
      return isWithinInterval(selectedDate, { start: startDate, end: endDate }) ||
             isSameDay(selectedDate, startDate);
    });
  };

  const datesToShow = selectedDate 
    ? [format(selectedDate, "yyyy-MM-dd")]
    : filteredDates;

  return (
    <div className="space-y-6">
      {datesToShow.map((dateKey) => {
        const itemsForDate = selectedDate 
          ? getItemsForDate(dateKey)
          : groupedItems[dateKey];
        
        if (!itemsForDate || itemsForDate.length === 0) return null;

        return (
          <div key={dateKey} className="animate-fade-in">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-2 mb-3">
              <h2 className="font-display text-lg font-semibold text-foreground">
                {format(parseISO(dateKey), "EEEE, dd MMMM yyyy")}
              </h2>
            </div>
            <div className="space-y-3">
              {itemsForDate.map((item, idx) => (
                <TripCard key={`${item.title}-${idx}`} item={item} index={idx} />
              ))}
            </div>
          </div>
        );
      })}
      
      {datesToShow.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No events for this date</p>
        </div>
      )}
    </div>
  );
}
