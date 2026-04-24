export type OrderStatus = "pending" | "processing" | "completed";
export type OrderTheme = "basic" | "photo" | "diary";
export type OrderIncludeScope = "all";

export type PrintOrder = {
  id: string;
  tripId: string;
  bookTitle: string;
  subtitle: string | null;
  theme: OrderTheme;
  includeScope: OrderIncludeScope;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrderWithTrip = PrintOrder & {
  trip: {
    id: string;
    title: string;
    destination: string;
  } | null;
};