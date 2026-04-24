import { db } from "@/lib/db";
import type { Trip } from "@/types/trip";

type TripRow = {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    coverImageUrl: row.cover_image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTrips(): Promise<Trip[]> {
  const result = await db.query<TripRow>(
    `
    select *
    from trips
    order by created_at desc
    `
  );

  return result.rows.map(mapTrip);
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const result = await db.query<TripRow>(
    `
    select *
    from trips
    where id = $1
    limit 1
    `,
    [tripId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapTrip(result.rows[0]);
}