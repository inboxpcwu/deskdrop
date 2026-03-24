# DeskDrop — Co-working Space Rental App Summary

## Overview

DeskDrop is a modern web application designed for browsing and booking co-working spaces. It provides a seamless user experience from discovery to confirmation, leveraging a robust tech stack to handle authentication, space management, and booking workflows.

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Database**: Supabase (Postgres, Auth, Storage)
- **State Management**: React Context API (`AuthContext`, `CartContext`)

## File Structure

```text
deskdrop/
├── src/
│   ├── app/                # Next.js App Router Pages & API Routes
│   │   ├── api/            # Server-side API endpoints (e.g., /api/bookings)
│   │   ├── auth/           # Login and Signup pages
│   │   ├── bookings/       # User booking history
│   │   ├── cart/           # Shopping cart management
│   │   ├── checkout/       # Booking confirmation flow
│   │   ├── profile/        # User profile settings
│   │   ├── spaces/         # Individual space details ([id])
│   │   ├── layout.tsx      # Root layout with Navbar and Footer
│   │   └── page.tsx        # Landing page (Space discovery)
│   ├── components/         # Reusable UI components (Navbar, Footer, etc.)
│   ├── context/            # React Contexts (Auth, Cart)
│   ├── lib/                # Shared utilities and Supabase client
│   └── supabase/           # Database schema and migrations
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
```

## UX Flow

1.  **Discovery**: Users arrive at the **Landing Page (`/`)**, where they can browse a grid of available co-working spaces. Filtering options allow them to narrow down results by capacity or price.
2.  **Space Detail**: Clicking on a space card navigates to the **Space Detail page (`/spaces/[id]`)**. Here, users can see full descriptions, amenities, and a photo gallery.
3.  **Booking Preparation**: On the detail page, users select a date and time range using pickers and click **"Add to Cart"**.
4.  **Cart Management**: The **Cart page (`/cart`)** displays all selected spaces and their calculated costs. Users can review or remove items before proceeding.
5.  **Checkout & Confirmation**: The **Checkout page (`/checkout`)** provides a final summary. Clicking **"Confirm Booking"** creates the official record in the database.
6.  **Post-Booking**: Users are redirected to the **Bookings page (`/bookings`)**, where they can view their upcoming and past reservations.
7.  **Account Management**: Users can manage their details (display name, avatar) through the **Profile page (`/profile`)**.

## Data Model (Supabase)

- **`users`**: Managed by Supabase Auth, extended with user profiles (name, avatar).
- **`spaces`**: Stores information about the co-working spaces (name, price, capacity, images).
- **`cart_items`**: Maintains a temporary list of spaces a user intends to book.
- **`bookings`**: Records confirmed rentals with status (confirmed, pending, cancelled).

## Important Features

- **Server Side Conflict Check**: Bookings are validated server-side to prevent double-booking the same space.
- **Real-time Auth**: Integrated Supabase Auth for secure user sessions.
- **Responsive Design**: Built with Tailwind CSS to ensure a great experience on both mobile and desktop.
