create extension if not exists "pgcrypto";

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  description text,
  cover_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists trip_entries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  entry_date date not null,
  title text not null,
  content text not null,
  image_url text,
  mood_tag text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists print_orders (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  book_title text not null,
  subtitle text,
  theme text not null check (theme in ('basic', 'photo', 'diary')),
  include_scope text not null default 'all' check (include_scope in ('all')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trips_created_at_idx
  on trips (created_at desc);

create index if not exists trip_entries_trip_id_idx
  on trip_entries (trip_id);

create index if not exists trip_entries_entry_date_idx
  on trip_entries (entry_date);

create index if not exists print_orders_trip_id_idx
  on print_orders (trip_id);

create index if not exists print_orders_status_idx
  on print_orders (status);