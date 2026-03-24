-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Create spaces table
create table public.spaces (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price_per_hour numeric not null,
  capacity int not null,
  amenities text[] default '{}',
  images text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create users profile table
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: cart_items would be cleared on checkout, ephemeral.
create table public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  space_id uuid references public.spaces on delete cascade not null,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create type booking_status as enum ('pending', 'confirmed', 'cancelled');

-- 4. Create bookings table
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users on delete cascade not null,
  space_id uuid references public.spaces on delete cascade not null,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  total_price numeric not null,
  status booking_status default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS
alter table public.spaces enable row level security;
alter table public.users enable row level security;
alter table public.cart_items enable row level security;
alter table public.bookings enable row level security;

-- RLS Policies
-- Spaces: everyone can read
create policy "Spaces are viewable by everyone" on public.spaces for select using (true);

-- Users: users can read and update their own profile
create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Cart items: users can CRUD their own
create policy "Users can CRUD own cart items" on public.cart_items for all using (auth.uid() = user_id);

-- Bookings: users can read their own, create their own
create policy "Users can read own bookings" on public.bookings for select using (auth.uid() = user_id);
create policy "Users can insert own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Users can update own bookings" on public.bookings for update using (auth.uid() = user_id);

-- Storage (assuming you create 'space-photos' bucket in Supabase manually)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('space-photos', 'space-photos', true);
-- admin write, public read policies would usually be done in the Supabase UI.

-- Seed Data for Spaces
insert into public.spaces (name, description, price_per_hour, capacity, amenities, images) values
('Focus Pod', 'A quiet, soundproof pod perfect for deep work and important video calls. Includes high-speed Wi-Fi and ergonomic chair.', 15.00, 1, '{"Wi-Fi", "Soundproof", "Ergonomic Chair", "Power Outlets"}', '{"https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800"}'),
('The Think Tank', 'Small meeting room designed for intimate team sessions or client meetings. Equipped with a whiteboard and TV for presentations.', 35.00, 4, '{"Wi-Fi", "Whiteboard", "TV Monitor", "Coffee"}', '{"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"}'),
('Creative Studio', 'Spacious open-plan room with plenty of natural light, perfect for creative workshops, brainstorming or team offsites.', 75.00, 8, '{"Wi-Fi", "Natural Light", "Lounge Area", "Kitchenette", "Whiteboard"}', '{"https://images.unsplash.com/photo-1600508774634-4e11d34730e2?auto=format&fit=crop&q=80&w=800"}'),
('Executive Boardroom', 'Premium boardroom with high-end furniture, video conferencing facilities, and catering options available upon request.', 120.00, 12, '{"Wi-Fi", "Video Conferencing", "Premium Furniture", "Catering Available"}', '{"https://images.unsplash.com/photo-1505322022379-7c3353ee6291?auto=format&fit=crop&q=80&w=800"}'),
('Event Hall Flex', 'Large, flexible space that can be configured for town halls, networking events, or large workshops.', 250.00, 50, '{"Wi-Fi", "Projector", "Sound System", "Microphones", "Stage Sections"}', '{"https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800"}');
