'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Clock, Shield, Zap, Target, ArrowRight, Play, Star } from 'lucide-react';

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

  useEffect(() => {
    async function fetchSpaces() {
      const { data, error } = await supabase.from('spaces').select('*');
      if (!error && data) setSpaces(data);
      setLoading(false);
    }
    fetchSpaces();
  }, []);

  const filteredSpaces = spaces.slice(0, 3);

  return (
    <div className="relative">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-white">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 skew-x-12 translate-x-1/2 -z-10 hidden lg:block"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <div className="space-y-10">
               <div>
                  <span className="inline-block py-1.5 px-4 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 border border-indigo-100/50">
                    Trusted by 500+ remote workers
                  </span>
                  <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                    Your office, <br />
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Anywhere.</span>
                  </h1>
                  <p className="mt-8 text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                    Skip the lease. Book premium co-working spaces and private pods by the hour. Designed for focus, built for teams.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                 <Link 
                   href="/spaces"
                   className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 group text-center"
                 >
                   Browse Spaces <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <button className="px-10 py-5 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                   <Play className="w-5 h-5 fill-slate-900" /> See how it works
                 </button>
               </div>

               <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-slate-200 relative">
                         <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="user" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex gap-0.5 text-orange-400 mb-1">
                       {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-400" />)}
                    </div>
                    <p className="text-sm font-bold text-slate-900">4.9/5 from 2,000+ bookings</p>
                  </div>
               </div>
             </div>

             <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-600/5 rounded-[2.5rem] blur-2xl group-hover:bg-indigo-600/10 transition-colors"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                   <Image 
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200" 
                    alt="Premium workspace" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                     <div className="flex justify-between items-center text-white">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Featured Location</p>
                          <p className="text-xl font-bold">The Glass House — London</p>
                        </div>
                        <p className="text-2xl font-black">$45<span className="text-xs">/hr</span></p>
                     </div>
                  </div>
                </div>
             </div>
           </div>
         </div>
      </section>

      {/* 2. Benefits Section */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
             <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.3em]">Why DeskDrop</h2>
             <p className="text-4xl font-extrabold text-slate-900 tracking-tight">Everything you need to ship your best work</p>
             <p className="text-lg text-slate-600 font-medium">No memberships, no long-term contracts. Just high-quality office space whenever you need it.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                 <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                   <Zap className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Instant Access</h3>
                 <p className="text-slate-600 leading-relaxed font-medium">Book in under 60 seconds. Our frictionless platform gets you into a focus pod or boardroom instantly.</p>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                 <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                   <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Secure & Verified</h3>
                 <p className="text-slate-600 leading-relaxed font-medium">Every space is vetted for high-speed internet, ergonomic furniture, and secure keyless access.</p>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                 <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                   <Target className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900">Ultra Productive</h3>
                 <p className="text-slate-600 leading-relaxed font-medium">Curated environments designed to minimize distraction and maximize team collaboration.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Space Preview Section */}
      <section id="discover" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Featured Spaces</h2>
                <p className="mt-4 text-lg text-slate-600 font-medium">The most popular workspaces in our network this week.</p>
              </div>

              <Link 
                href="/spaces" 
                className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-sm hover:translate-x-1 transition-transform"
              >
                View full catalog <ArrowRight className="w-5 h-5" />
              </Link>
           </div>

           {loading ? (
             <div className="flex justify-center items-center h-[300px]">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredSpaces.map((space) => (
                 <Link
                   key={space.id}
                   href={`/spaces/${space.id}`}
                   className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                 >
                   <div className="relative h-72 overflow-hidden">
                     <img
                       src={space.images[0]}
                       alt={space.name}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     <div className="absolute top-6 left-6">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">
                          {space.capacity} Guests
                        </span>
                     </div>
                     <div className="absolute top-6 right-6">
                        <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg">
                          ${space.price_per_hour}<span className="text-xs opacity-70">/hr</span>
                        </div>
                     </div>
                   </div>
                   
                   <div className="p-8 space-y-4">
                     <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                       {space.name}
                     </h3>
                     
                     <div className="flex items-center gap-6 text-sm text-slate-400 font-bold border-y border-slate-50 py-4">
                       <div className="flex items-center gap-2">
                         <Users className="w-4 h-4 text-indigo-500" />
                         <span>Up to {space.capacity}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <Clock className="w-4 h-4 text-indigo-500" />
                         <span>24/7 Access</span>
                       </div>
                     </div>
                   </div>
                 </Link>
               ))}
             </div>
           )}
        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 blur-3xl rounded-full"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col items-center text-center space-y-6 mb-20">
               <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em]">Success Stories</h2>
               <p className="text-4xl lg:text-5xl font-extrabold max-w-2xl leading-tight">Trusted by founders and digital nomads worldwide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-10 bg-slate-800/50 backdrop-blur rounded-[2.5rem] border border-slate-700 space-y-8">
                  <p className="text-xl leading-relaxed italic text-slate-300">
                    &quot;DeskDrop has completely changed how our remote team works. We can find a premium boardroom in 10 minutes for our strategy sessions. The quality of spaces is consistently high.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden relative">
                        <Image src="https://i.pravatar.cc/150?u=a" alt="Sarah J" fill className="object-cover" />
                     </div>
                     <div>
                        <p className="font-bold text-white text-lg">Sarah Jenkins</p>
                        <p className="text-sm text-slate-400 font-medium">Founder at FluxMedia</p>
                     </div>
                  </div>
               </div>

               <div className="p-10 bg-slate-800/50 backdrop-blur rounded-[2.5rem] border border-slate-700 space-y-8">
                  <p className="text-xl leading-relaxed italic text-slate-300">
                    &quot;I travel as a designer and DeskDrop is my lifeline. Reliable Wi-Fi, great coffee, and beautiful environments. It&apos;s better than any coworking membership I&apos;ve HAD.&quot;
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-slate-700 overflow-hidden relative">
                        <Image src="https://i.pravatar.cc/150?u=b" alt="Alex M" fill className="object-cover" />
                     </div>
                     <div>
                        <p className="font-bold text-white text-lg">Alex Moriarty</p>
                        <p className="text-sm text-slate-400 font-medium">Senior Product Designer</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-10">
                <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  Ready to book <br /> your next session?
                </h2>
                <p className="text-xl text-indigo-100 max-w-xl mx-auto font-medium">
                  Join 10,000+ professionals booking on-demand workspaces today. No hidden fees.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link 
                     href="/auth/signup"
                     className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all shadow-xl shadow-black/10"
                   >
                     Get Started for Free
                   </Link>
                   <Link 
                     href="/auth/login"
                     className="px-12 py-5 bg-indigo-500/20 text-white border border-indigo-400/30 rounded-2xl font-bold text-xl hover:bg-indigo-500/30 transition-all"
                   >
                     Sign In
                   </Link>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="grid grid-cols-12 h-full">
                    {[...Array(12)].map((_, i) => <div key={i} className="border-r border-white h-full"></div>)}
                 </div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
