export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};