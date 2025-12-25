import { format, parseISO, differenceInDays } from "date-fns";
import { TripItem } from "@/data/tripData";
import { MapPin, Calendar, Plane } from "lucide-react";

interface TripHeaderProps {
  items: TripItem[];
}

export function TripHeader({ items }: TripHeaderProps) {
  // Calculate trip stats
  const flights = items.filter(i => i.type === "flight");
  const stays = items.filter(i => i.type === "stay");
  
  const allDates = items.flatMap(item => [
    parseISO(item.start.split("T")[0]),
    parseISO(item.end.split("T")[0])
  ]);
  
  const startDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const totalDays = differenceInDays(endDate, startDate) + 1;

  const uniquePlaces = [...new Set(stays.map(s => s.place).filter(Boolean))];

  return (
    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary mb-6 animate-fade-in">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full blur-2xl" />
      </div>
      
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-2">
              Thailand Honeymoon 🇹🇭
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base">
              {format(startDate, "dd MMM")} – {format(endDate, "dd MMM yyyy")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Duration</span>
            </div>
            <p className="text-primary-foreground font-semibold text-lg md:text-xl">
              {totalDays} days
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-xs mb-1">
              <Plane className="w-3.5 h-3.5" />
              <span>Flights</span>
            </div>
            <p className="text-primary-foreground font-semibold text-lg md:text-xl">
              {flights.length}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4">
            <div className="flex items-center gap-2 text-primary-foreground/70 text-xs mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Places</span>
            </div>
            <p className="text-primary-foreground font-semibold text-lg md:text-xl">
              {uniquePlaces.length}
            </p>
          </div>
        </div>

        {/* Places preview */}
        <div className="flex flex-wrap gap-2 mt-4">
          {uniquePlaces.map((place, idx) => {
            const stay = stays.find(s => s.place === place);
            return (
              <span 
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-primary-foreground backdrop-blur-sm"
              >
                {place}
              </span>
            );
          })}
        </div>
      </div>
    </header>
  );
}
