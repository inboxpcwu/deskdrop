## DeskDrop — Co-working Space Rental App Spec

### Overview

A minimal co-working space rental web app built to demonstrate lean startup principles. Users browse spaces, add them to a cart, and confirm a booking. No real payment in v1.

---

### Tech Stack

**Next.js 14 (App Router) + TypeScript** for frontend and API routes, deployed to **Vercel**. **Supabase** for Postgres, Auth, and file storage.

---

### Pages

**`/`** — Landing page with a grid of available spaces. Filter by capacity or price (client-side). Each card shows name, price/hour, capacity, and one photo.

**`/spaces/[id]`** — Space detail page. Full photo gallery, amenities list, description, availability, and an "Add to Cart" button with date/time pickers.

**`/cart`** — Lists cart items (space, date range, calculated price). Remove items, proceed to checkout.

**`/checkout`** — Review order summary. A single "Confirm Booking" button that creates a booking record (status: `confirmed`) and clears the cart.

**`/bookings`** — User's past and upcoming bookings. Shows booking status and space info.

**`/profile`** — Edit display name and avatar. Change password via Supabase Auth.

**`/auth/login` and `/auth/signup`** — Simple email/password forms using Supabase Auth.

---

### API Routes

These are thin wrappers over Supabase that handle server-side validation and RLS bypass when needed.

`GET /api/spaces` — list all spaces, optional query params for filtering. `GET /api/spaces/[id]` — single space. `POST /api/bookings` — create booking, validate no date conflict. `GET /api/bookings` — user's bookings (authenticated).

---

### Supabase Schema

**`users`** — extends Supabase Auth; stores `full_name`, `avatar_url`. Populated on signup via a trigger.

**`spaces`** — seed data only (admin-managed). Fields: `id`, `name`, `description`, `price_per_hour` (numeric), `capacity` (int), `amenities` (text array), `images` (text array of Storage URLs).

**`cart_items`** — ephemeral rows per user. Fields: `id`, `user_id`, `space_id`, `start_at`, `end_at`. Cleared on checkout.

**`bookings`** — `id`, `user_id`, `space_id`, `start_at`, `end_at`, `total_price` (computed on write), `status` (enum: `pending | confirmed | cancelled`), `created_at`.

**Storage bucket** — `space-photos`, public read, admin-only write.

**Row Level Security** — users can read all spaces; can only read/write their own cart items and bookings.

---

### What's explicitly out of scope (v1)

Real payments, admin dashboard, email notifications, reviews, availability calendar (conflict check is server-side only), and metric instrumentation (added later in the tutorial).

---

### Suggested seed data

5–6 pre-populated spaces with varied capacities (1-person pod, 4-person room, 10-person event hall) to make the browsing experience feel real during the demo.