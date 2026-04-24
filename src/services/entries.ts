import { getDb } from "@/lib/db";
import type { TripEntry } from "@/types/entry";

type TripEntryRow = {
  id: string;
  trip_id: string;
  entry_date: string | Date;
  title: string;
  content: string;
  image_url: string | null;
  mood_tag: string | null;
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

function mapEntry(row: TripEntryRow): TripEntry {
  return {
    id: row.id,
    tripId: row.trip_id,
    entryDate: formatDateOnly(row.entry_date),
    title: row.title,
    content: row.content,
    imageUrl: row.image_url,
    moodTag: row.mood_tag,
    createdAt: formatDateTime(row.created_at),
    updatedAt: formatDateTime(row.updated_at),
  };
}

export async function getEntriesByTripId(tripId: string): Promise<TripEntry[]> {
  const db = getDb();

  const result = await db.query<TripEntryRow>(
    `
    select *
    from trip_entries
    where trip_id = $1
    order by entry_date asc, created_at asc
    `,
    [tripId]
  );

  return result.rows.map(mapEntry);
}