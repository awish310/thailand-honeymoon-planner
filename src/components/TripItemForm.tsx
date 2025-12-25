import { useState } from "react";
import { TripItem } from "@/data/tripData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TripItemFormProps {
  item?: TripItem;
  open: boolean;
  onClose: () => void;
  onSave: (item: TripItem) => void;
}

const STAY_COLORS = [
  { label: "Blue", value: "#4A90E2" },
  { label: "Green", value: "#50C878" },
  { label: "Orange", value: "#FF8C42" },
  { label: "Purple", value: "#9B59B6" },
  { label: "Pink", value: "#E91E63" },
  { label: "Teal", value: "#00BCD4" },
];

export function TripItemForm({ item, open, onClose, onSave }: TripItemFormProps) {
  const isEditing = !!item;
  
  const [type, setType] = useState<"flight" | "stay">(item?.type || "flight");
  const [title, setTitle] = useState(item?.title || "");
  const [start, setStart] = useState(item?.start || "");
  const [end, setEnd] = useState(item?.end || "");
  const [from, setFrom] = useState(item?.from || "");
  const [to, setTo] = useState(item?.to || "");
  const [airline, setAirline] = useState(item?.airline || "");
  const [flightNo, setFlightNo] = useState(item?.flightNo || "");
  const [place, setPlace] = useState(item?.place || "");
  const [address, setAddress] = useState(item?.address || "");
  const [bookingRef, setBookingRef] = useState(item?.bookingRef || "");
  const [notes, setNotes] = useState(item?.notes || "");
  const [color, setColor] = useState(item?.color || "#4A90E2");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: TripItem = {
      type,
      start,
      end,
      title,
      ...(type === "flight" && { from, to, airline, flightNo }),
      ...(type === "stay" && { place, address, color }),
      ...(bookingRef && { bookingRef }),
      ...(notes && { notes }),
    };
    
    onSave(newItem);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "flight" | "stay")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="stay">Stay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder={type === "flight" ? "Etihad EY610" : "Airbnb – Bangkok"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{type === "flight" ? "Departure" : "Check-in"}</Label>
              <Input 
                type={type === "flight" ? "datetime-local" : "date"}
                value={start} 
                onChange={(e) => setStart(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{type === "flight" ? "Arrival" : "Check-out"}</Label>
              <Input 
                type={type === "flight" ? "datetime-local" : "date"}
                value={end} 
                onChange={(e) => setEnd(e.target.value)}
                required
              />
            </div>
          </div>

          {type === "flight" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From (Airport)</Label>
                  <Input 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value.toUpperCase())} 
                    placeholder="TLV"
                    maxLength={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To (Airport)</Label>
                  <Input 
                    value={to} 
                    onChange={(e) => setTo(e.target.value.toUpperCase())} 
                    placeholder="BKK"
                    maxLength={3}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Airline</Label>
                  <Input 
                    value={airline} 
                    onChange={(e) => setAirline(e.target.value)} 
                    placeholder="Etihad Airways"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Flight No.</Label>
                  <Input 
                    value={flightNo} 
                    onChange={(e) => setFlightNo(e.target.value)} 
                    placeholder="EY610"
                  />
                </div>
              </div>
            </>
          )}

          {type === "stay" && (
            <>
              <div className="space-y-2">
                <Label>Place</Label>
                <Input 
                  value={place} 
                  onChange={(e) => setPlace(e.target.value)} 
                  placeholder="Bangkok"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Address</Label>
                <Input 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="123 Street, City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        {STAY_COLORS.find(c => c.value === color)?.label || "Custom"}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STAY_COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: c.value }}
                          />
                          {c.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label>Booking Reference</Label>
            <Input 
              value={bookingRef} 
              onChange={(e) => setBookingRef(e.target.value)} 
              placeholder="ABC123"
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Save" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
