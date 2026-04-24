import { db } from "@/lib/db";
import type { TripEntry } from "@/types/entry";

type TripEntryRow = {
  id: string;
  trip_id: string;
  entry_date: string;
  title: string;
  content: string;
  image_url: string | null;
  mood_tag: string | null;
  created_at: string;
  updated_at: string;
};

function mapEntry(row: TripEntryRow): TripEntry {
  return {
    id: row.id,
    tripId: row.trip_id,
    entryDate: row.entry_date,
    title: row.title,
    content: row.content,
    imageUrl: row.image_url,
    moodTag: row.mood_tag,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getEntriesByTripId(tripId: string): Promise<TripEntry[]> {
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