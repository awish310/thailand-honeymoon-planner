import { format, parseISO } from "date-fns";
import { Plane, Home, MapPin, Clock, Calendar, FileText, Building } from "lucide-react";
import { TripItem } from "@/data/tripData";
import { cn } from "@/lib/utils";

interface TripCardProps {
  item: TripItem;
  index: number;
}

export function TripCard({ item, index }: TripCardProps) {
  const isStay = item.type === "stay";
  
  const formatTime = (dateStr: string) => {
    if (dateStr.includes("T")) {
      return format(parseISO(dateStr), "HH:mm");
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr.split("T")[0]), "dd MMM yyyy");
  };

  const getTimeRange = () => {
    const startTime = formatTime(item.start);
    const endTime = formatTime(item.end);
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    }
    return null;
  };

  return (
    <div 
      className={cn(
        "group relative bg-card rounded-lg shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden animate-slide-up",
        "border border-border/50"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Color accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg"
        style={{ backgroundColor: isStay ? item.color : "hsl(var(--flight))" }}
      />
      
      <div className="p-4 pl-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "p-2 rounded-md",
                isStay ? "bg-stay/10" : "bg-flight/10"
              )}
              style={isStay ? { backgroundColor: `${item.color}15` } : undefined}
            >
              {isStay ? (
                <Home className="w-4 h-4" style={{ color: item.color }} />
              ) : (
                <Plane className="w-4 h-4 text-flight" />
              )}
            </div>
            <div>
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={isStay 
                  ? { backgroundColor: `${item.color}20`, color: item.color }
                  : { backgroundColor: "hsl(var(--flight) / 0.15)", color: "hsl(var(--flight))" }
                }
              >
                {isStay ? "Stay" : "Flight"}
              </span>
            </div>
          </div>
          
          {getTimeRange() && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {getTimeRange()}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {/* Flight route or location */}
        {!isStay && item.from && item.to && (
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-sm font-medium text-foreground">{item.from}</span>
            <div className="flex-1 border-t border-dashed border-muted-foreground/30 relative">
              <Plane className="w-3 h-3 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground rotate-90" />
            </div>
            <span className="font-mono text-sm font-medium text-foreground">{item.to}</span>
          </div>
        )}

        {isStay && item.place && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.place}</span>
          </div>
        )}

        {/* Details */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          {/* Dates */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(item.start)}</span>
            {isStay && <span>→ {formatDate(item.end)}</span>}
          </div>

          {/* Airline or Address */}
          {!isStay && item.airline && (
            <div className="flex items-center gap-1.5">
              <Building className="w-3 h-3" />
              <span>{item.airline}</span>
              {item.flightNo && <span className="font-mono">• {item.flightNo}</span>}
            </div>
          )}

          {isStay && item.address && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{item.address}</span>
            </div>
          )}

          {/* Booking ref */}
          {item.bookingRef && (
            <div className="flex items-center gap-1.5">
              <FileText className="w-3 h-3" />
              <span className="font-mono">{item.bookingRef}</span>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="pt-2 border-t border-border/50 mt-2">
              <p className="text-muted-foreground leading-relaxed">{item.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
