'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Users, Clock, Filter, ChevronRight } from 'lucide-react';

/* eslint-disable @next/next/no-img-element */

type Space = {
  id: string;
  name: string;
  description: string;
  price_per_hour: number;
  capacity: number;
  amenities: string[];
  images: string[];
};

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCapacity, setFilterCapacity] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSpaces() {
      const { data, error } = await supabase.from('spaces').select('*');
      if (!error && data) setSpaces(data);
      setLoading(false);
    }
    fetchSpaces();
  }, []);

  const filteredSpaces = filterCapacity 
    ? spaces.filter(s => s.capacity >= filterCapacity)
    : spaces;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {/* Page Header */}
         <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest">
                <Link href="/" className="hover:underline">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span>Spaces</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Browse Premium Spaces</h1>
              <p className="text-lg text-slate-600 font-medium">Find the perfect spot for your next big idea or team session.</p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 px-3 text-slate-400">
                 <Filter className="w-4 h-4" />
                 <span className="text-sm font-bold uppercase tracking-widest">Guests:</span>
              </div>
              {[1, 4, 8, 12].map((cap) => (
                <button
                  key={cap}
                  onClick={() => setFilterCapacity(filterCapacity === cap ? null : cap)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filterCapacity === cap
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cap}+
                </button>
              ))}
            </div>
         </div>

         {loading ? (
           <div className="flex justify-center items-center h-[50vh]">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
           </div>
         ) : filteredSpaces.length === 0 ? (
           <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
              <p className="text-xl text-slate-500 font-medium mb-6">No spaces found matching your criteria.</p>
              <button 
                onClick={() => setFilterCapacity(null)}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"
              >
                Clear all filters
              </button>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
             {filteredSpaces.map((space) => (
               <Link
                 key={space.id}
                 href={`/spaces/${space.id}`}
                 className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
               >
                 <div className="relative h-80 overflow-hidden">
                   <img
                     src={space.images[0]}
                     alt={space.name}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-6 left-6">
                      <span className="px-4 py-2 bg-white/95 backdrop-blur rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
                        {space.capacity} Guests
                      </span>
                   </div>
                   <div className="absolute top-6 right-6">
                      <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl text-xl font-black shadow-2xl">
                        ${space.price_per_hour}<span className="text-xs opacity-70">/hr</span>
                      </div>
                   </div>
                 </div>
                 
                 <div className="p-10 space-y-6">
                   <div className="space-y-2">
                     <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                       {space.name}
                     </h3>
                     <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-medium">
                       {space.description}
                     </p>
                   </div>
                   
                   <div className="flex items-center gap-6 text-sm text-slate-400 font-bold border-y border-slate-50 py-5">
                     <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-indigo-500" />
                       <span>Up to {space.capacity}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4 text-indigo-500" />
                       <span>Instant Booking</span>
                     </div>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2">
                     {space.amenities.map((amenity) => (
                       <span
                         key={amenity}
                         className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-slate-100"
                       >
                         {amenity}
                       </span>
                     ))}
                   </div>
                 </div>
               </Link>
             ))}
           </div>
         )}
      </div>
    </div>
  );
}
