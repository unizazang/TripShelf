import { getDb } from "@/lib/db";
import type { Trip } from "@/types/trip";

type TripRow = {
  id: string;
  title: string;
  destination: string;
  start_date: string | Date;
  end_date: string | Date;
  description: string | null;
  cover_image_url: string | null;
  created_at: string | Date;
  updated_at: string | Date;
};

function formatDateOnly(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

function formatDateTime(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    startDate: formatDateOnly(row.start_date),
    endDate: formatDateOnly(row.end_date),
    description: row.description,
    coverImageUrl: row.cover_image_url,
    createdAt: formatDateTime(row.created_at),
    updatedAt: formatDateTime(row.updated_at),
  };
}

export async function getTrips(): Promise<Trip[]> {
  const db = getDb();

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
  const db = getDb();

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