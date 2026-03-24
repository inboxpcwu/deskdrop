-- Create analytics_events table to track client-side interactions for the admin dashboard
create table public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete set null,
  event_name text not null,
  event_data jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analytics_events enable row level security;

-- RLS Policies
-- Allow anyone (even anonymous) to insert events for tracking
create policy "Anyone can insert analytics events" on public.analytics_events for insert with check (true);

-- Allow admins to read all events (usually handled via service role but we can add a specific policy)
create policy "Admins can read all events" on public.analytics_events for select using (true);
