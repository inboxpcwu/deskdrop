'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { format, parseISO } from 'date-fns';
import { CalendarDays, Tag, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

type Booking = {
  id: string;
  start_at: string;
  end_at: string;
  total_price: number;
  status: string;
  spaces: {
    name: string;
    images: string[];
  };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchBookings() {
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id, start_at, end_at, total_price, status,
          spaces ( name, images )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBookings(data as unknown as Booking[]);
      }
      setLoading(false);
    }
    fetchBookings();
  }, [user]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center animate-pulse text-indigo-600">Loading your bookings...</div>;

  if (bookings.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-display">No bookings found</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven&apos;t made any reservations yet. Ready to find your next workspace?</p>
        <Link href="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg">
          Explore Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">My Bookings</h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row gap-6 p-4"
          >
            <div className="w-full md:w-64 h-48 md:h-auto rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={booking.spaces.images[0]}
                alt={booking.spaces.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="flex-grow flex flex-col justify-between py-2 pr-4">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {booking.spaces.name}
                  </h2>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarDays className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Date</p>
                      <p className="font-semibold">{format(parseISO(booking.start_at), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Tag className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Total Price</p>
                      <p className="font-semibold text-lg text-indigo-600 font-mono">${booking.total_price}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-sm text-gray-400 font-medium">Session ID: {booking.id.slice(0, 8)}...</span>
                <Link href="/" className="flex items-center gap-1 text-indigo-600 font-bold text-sm hover:underline">
                  Book Again <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
