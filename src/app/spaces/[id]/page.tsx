'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Users, Clock, Shield, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format, addHours, differenceInHours, parseISO } from 'date-fns';

type Space = {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  amenities: string[];
  images: string[];
};

export default function SpaceDetailPage({ params }: { params: { id: string } }) {
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:00"));
  const [endDate, setEndDate] = useState(format(addHours(new Date(), 2), "yyyy-MM-dd'T'HH:00"));
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function fetchSpace() {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!error && data) {
        setSpace(data);
      }
      setLoading(false);
    }
    fetchSpace();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!space) return;

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const hours = differenceInHours(end, start);

    if (hours <= 0) {
      alert('End time must be after start time');
      return;
    }

    await addItem({
      space_id: space.id,
      space_name: space.name,
      price_per_hour: space.price_per_hour,
      start_at: startDate,
      end_at: endDate,
      total_price: hours * space.price_per_hour,
    });

    router.push('/cart');
  };

  if (loading) return <div className="h-[60vh] flex items-center justify-center animate-pulse text-indigo-600">Loading space...</div>;
  if (!space) return <div className="p-20 text-center text-red-500">Space not found</div>;

  const hours = differenceInHours(parseISO(endDate), parseISO(startDate));
  const totalPrice = hours > 0 ? hours * space.price_per_hour : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Gallery & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-video relative group">
            <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <h1 className="absolute bottom-8 left-8 text-4xl font-bold text-white tracking-tight">
              {space.name}
            </h1>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this space</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {space.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 p-6 bg-slate-50 rounded-xl">
              <div className="text-center">
                <Users className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Capacity</p>
                <p className="text-lg font-bold text-slate-800">{space.capacity} People</p>
              </div>
              <div className="text-center">
                <Clock className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Access</p>
                <p className="text-lg font-bold text-slate-800">24/7 Flex</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Safety</p>
                <p className="text-lg font-bold text-slate-800">Verified</p>
              </div>
              <div className="text-center">
                <Star className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Rating</p>
                <p className="text-lg font-bold text-slate-800">4.9 / 5.0</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Included Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {space.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 ring-1 ring-slate-900/5">
            <div className="flex justify-between items-end mb-8 pb-6 border-b border-gray-100">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-1">Price per Hour</p>
                <p className="text-4xl font-extrabold text-indigo-600">${space.price_per_hour}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">Popular</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Check-in</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Check-out</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-gray-700"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-600 py-1">
                  <span>${space.price_per_hour} x {hours > 0 ? hours : 0} hours</span>
                  <span className="font-bold">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600 py-1 text-xs">
                  <span>Service fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3">
                  <span>Total</span>
                  <span className="text-indigo-600">${totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={hours <= 0}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                Reserve Now
              </button>
              
              <p className="text-center text-xs text-gray-400 font-medium">
                No payment will be collected at this stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
