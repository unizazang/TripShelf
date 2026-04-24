import { db } from "@/lib/db";
import type { TripEntry } from "@/types/entry";
import type { OrderWithTrip } from "@/types/order";

type OrderRow = {
  id: string;
  trip_id: string;
  book_title: string;
  subtitle: string | null;
  theme: "basic" | "photo" | "diary";
  include_scope: "all";
  status: "pending" | "processing" | "completed";
  created_at: string;
  updated_at: string;
  trip_title: string;
  trip_destination: string;
};

type OrderExportRow = {
  id: string;
  trip_id: string;
  book_title: string;
  subtitle: string | null;
  theme: "basic" | "photo" | "diary";
  include_scope: "all";
  status: "pending" | "processing" | "completed";
  created_at: string;
  updated_at: string;
  trip_real_id: string;
  trip_title: string;
  trip_destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  cover_image_url: string | null;
  trip_created_at: string;
  trip_updated_at: string;
};

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

function mapOrder(row: OrderRow): OrderWithTrip {
  return {
    id: row.id,
    tripId: row.trip_id,
    bookTitle: row.book_title,
    subtitle: row.subtitle,
    theme: row.theme,
    includeScope: row.include_scope,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    trip: {
      id: row.trip_id,
      title: row.trip_title,
      destination: row.trip_destination,
    },
  };
}

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

export async function getOrders(): Promise<OrderWithTrip[]> {
  const result = await db.query<OrderRow>(
    `
    select
      po.id,
      po.trip_id,
      po.book_title,
      po.subtitle,
      po.theme,
      po.include_scope,
      po.status,
      po.created_at,
      po.updated_at,
      t.title as trip_title,
      t.destination as trip_destination
    from print_orders po
    join trips t on t.id = po.trip_id
    order by po.created_at desc
    `
  );

  return result.rows.map(mapOrder);
}

export async function getOrderById(orderId: string): Promise<OrderWithTrip | null> {
  const result = await db.query<OrderRow>(
    `
    select
      po.id,
      po.trip_id,
      po.book_title,
      po.subtitle,
      po.theme,
      po.include_scope,
      po.status,
      po.created_at,
      po.updated_at,
      t.title as trip_title,
      t.destination as trip_destination
    from print_orders po
    join trips t on t.id = po.trip_id
    where po.id = $1
    limit 1
    `,
    [orderId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapOrder(result.rows[0]);
}

export async function getOrderExportData(orderId: string) {
  const orderResult = await db.query<OrderExportRow>(
    `
    select
      po.id,
      po.trip_id,
      po.book_title,
      po.subtitle,
      po.theme,
      po.include_scope,
      po.status,
      po.created_at,
      po.updated_at,
      t.id as trip_real_id,
      t.title as trip_title,
      t.destination as trip_destination,
      t.start_date,
      t.end_date,
      t.description,
      t.cover_image_url,
      t.created_at as trip_created_at,
      t.updated_at as trip_updated_at
    from print_orders po
    join trips t on t.id = po.trip_id
    where po.id = $1
    limit 1
    `,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const orderRow = orderResult.rows[0];

  const entriesResult = await db.query<TripEntryRow>(
    `
    select *
    from trip_entries
    where trip_id = $1
    order by entry_date asc, created_at asc
    `,
    [orderRow.trip_id]
  );

  const entries = entriesResult.rows.map(mapEntry);

  return {
    exportedAt: new Date().toISOString(),
    order: {
      id: orderRow.id,
      tripId: orderRow.trip_id,
      bookTitle: orderRow.book_title,
      subtitle: orderRow.subtitle,
      theme: orderRow.theme,
      includeScope: orderRow.include_scope,
      status: orderRow.status,
      createdAt: orderRow.created_at,
      updatedAt: orderRow.updated_at,
    },
    trip: {
      id: orderRow.trip_real_id,
      title: orderRow.trip_title,
      destination: orderRow.trip_destination,
      startDate: orderRow.start_date,
      endDate: orderRow.end_date,
      description: orderRow.description,
      coverImageUrl: orderRow.cover_image_url,
      createdAt: orderRow.trip_created_at,
      updatedAt: orderRow.trip_updated_at,
    },
    entries,
    meta: {
      entryCount: entries.length,
      exportFormat: "json",
      version: 1,
    },
  };
}