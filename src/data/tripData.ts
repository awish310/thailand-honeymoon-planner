export interface TripItem {
  type: "flight" | "stay";
  start: string;
  end: string;
  title: string;
  from?: string;
  to?: string;
  airline?: string;
  flightNo?: string;
  place?: string;
  address?: string;
  bookingRef?: string;
  notes?: string;
  color?: string;
}

export const TRIP_ITEMS: TripItem[] = [
  {
    type: "flight",
    start: "2026-01-19T06:20",
    end: "2026-01-19T11:15",
    title: "Etihad EY610",
    from: "TLV",
    to: "AUH",
    airline: "Etihad Airways",
    flightNo: "EY610",
    notes: "כבודה 25kg | הזמנה GVALG7"
  },
  {
    type: "flight",
    start: "2026-01-19T14:20",
    end: "2026-01-19T23:25",
    title: "Etihad EY400",
    from: "AUH",
    to: "BKK",
    airline: "Etihad Airways",
    flightNo: "EY400",
    notes: "כבודה 25kg | הזמנה GVALG7"
  },
  {
    type: "stay",
    start: "2026-01-19",
    end: "2026-01-22",
    title: "Airbnb – Khlong Toei",
    place: "Bangkok",
    address: "Sukhumvit 36, Khet Khlong Toei, Bangkok 10110, Thailand",
    bookingRef: "HM4R535ZR9",
    notes: "צ׳ק אין 15:00 | צ׳ק אאוט 22.1",
    color: "#4A90E2"
  },
  {
    type: "flight",
    start: "2026-01-22T13:55",
    end: "2026-01-22T15:05",
    title: "AirAsia FD3433",
    from: "DMK",
    to: "CNX",
    airline: "AirAsia",
    flightNo: "FD3433",
    notes: "Confirmation: Z7V1RL"
  },
  {
    type: "stay",
    start: "2026-01-22",
    end: "2026-01-23",
    title: "Rustic River Boutique",
    place: "Chiang Mai",
    address: "84/1 Taiwang Road, T.Changmoi, A.Muang Chiang Mai, Chang Moi, 50300 Chiang Mai, Thailand",
    bookingRef: "",
    notes: "צ׳ק אין 14:00-20:00 | צ׳ק אאוט עד 11:30 | 3 כוכבים | Baggage storage",
    color: "#50C878"
  },
  {
    type: "stay",
    start: "2026-01-23",
    end: "2026-01-31",
    title: "Airbnb – cozy 2 storey house, Maehi",
    place: "Pai",
    address: "170 Moo 5, Maehi, Pai, Maehongson 58130, Thailand",
    bookingRef: "HM5DD8M4SM",
    notes: "צ׳ק אין 14:00 | צ׳ק אאוט 31.1",
    color: "#FF8C42"
  },
  {
    type: "stay",
    start: "2026-02-05",
    end: "2026-02-23",
    title: "Airbnb – Room by the sea",
    place: "Ko Pha-ngan",
    address: "Ko Pha-ngan Sub-district, Surat Thani 84280, Thailand",
    bookingRef: "HMDEDZHAPY",
    notes: "צ׳ק אין 12:00 | צ׳ק אאוט 23.2",
    color: "#9B59B6"
  },
  {
    type: "flight",
    start: "2026-02-25T14:40",
    end: "2026-02-25T19:05",
    title: "Etihad EY405",
    from: "BKK",
    to: "AUH",
    airline: "Etihad Airways",
    flightNo: "EY405",
    notes: "כבודה 25kg | הזמנה GVALG7"
  },
  {
    type: "flight",
    start: "2026-02-25T21:50",
    end: "2026-02-25T23:40",
    title: "Etihad EY599",
    from: "AUH",
    to: "TLV",
    airline: "Etihad Airways",
    flightNo: "EY599",
    notes: "כבודה 25kg | הזמנה GVALG7"
  }
];
