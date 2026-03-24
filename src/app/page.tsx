'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Clock } from 'lucide-react';

type Space = {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  amenities: string[];
  images: string[];
};

export default function LandingPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCapacity, setFilterCapacity] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSpaces() {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');

      if (!error && data) {
        setSpaces(data);
      }
      setLoading(false);
    }
    fetchSpaces();
  }, []);

  const filteredSpaces = filterCapacity 
    ? spaces.filter(s => s.capacity >= filterCapacity)
    : spaces;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Find Your Perfect Workspace
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Book premium desks and meeting rooms by the hour.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm font-medium text-gray-500 ml-2">Min Capacity:</span>
          {[1, 4, 8, 12].map((cap) => (
            <button
              key={cap}
              onClick={() => setFilterCapacity(filterCapacity === cap ? null : cap)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filterCapacity === cap
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-50 text-gray-700 hover:bg-slate-100'
              }`}
            >
              {cap}+
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSpaces.map((space) => (
          <Link
            key={space.id}
            href={`/spaces/${space.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={space.images[0]}
                alt={space.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-indigo-600 shadow-sm">
                ${space.price_per_hour}/hr
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {space.name}
              </h2>
              
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Up to {space.capacity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Flexible hours</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {space.amenities.slice(0, 3).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2.5 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-semibold rounded-md uppercase tracking-wider"
                  >
                    {amenity}
                  </span>
                ))}
                {space.amenities.length > 3 && (
                  <span className="text-[11px] text-slate-400 font-medium self-center">
                    +{space.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
