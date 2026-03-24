'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Users, ShoppingCart, CalendarCheck, DollarSign, AlertTriangle, LogOut, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'deskdrop_admin_2026') {
      setIsAuthenticated(true);
      fetchStats();
    } else {
      alert('Invalid password');
    }
  };

  async function fetchStats() {
    setLoading(true);
    try {
      // 1. Fetch Bookings & Revenue
      const { data: bookings } = await supabase.from('bookings').select('*');
      const totalRevenue = bookings?.reduce((acc, b) => acc + (b.total_price || 0), 0) || 0;
      const totalBookings = bookings?.length || 0;

      // 2. Fetch Events for Actionable Metrics
      const { data: events } = await supabase.from('analytics_events').select('*');
      
      const views = events?.filter(e => e.event_name === 'view_item').length || 0;
      const carts = events?.filter(e => e.event_name === 'add_to_cart').length || 0;
      const signups = events?.filter(e => e.event_name === 'sign_up').length || 1; // avoid div by zero
      const conflicts = events?.filter(e => e.event_name === 'booking_error_clash').length || 0;
      const attempts = events?.filter(e => e.event_name === 'booking_attempted').length || totalBookings;

      setStats({
        revenue: totalRevenue,
        bookings: totalBookings,
        activationRate: ((views / signups) * 100).toFixed(1),
        conversionRate: ((totalBookings / (carts || 1)) * 100).toFixed(1),
        conflictRate: ((conflicts / (attempts || 1)) * 100).toFixed(1),
        rpau: (totalRevenue / (views || 1)).toFixed(2)
      });
    } catch (err) {
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-32 p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-center text-slate-900 mb-8 tracking-tight">Admin Gateway</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100">
            Access Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Metrics Dashboard</h1>
          <p className="text-slate-500 font-medium mt-1">Lean Startup Actionable Metrics for DeskDrop</p>
        </div>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="font-bold">Aggregating real-time data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Revenue & Bookings (Traditional) */}
          <MetricCard 
            title="Total GMV" 
            value={`$${stats.revenue}`} 
            icon={<DollarSign className="w-6 h-6" />}
            suffix="Revenue generated"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <MetricCard 
            title="Confirmed Bookings" 
            value={stats.bookings} 
            icon={<CalendarCheck className="w-6 h-6" />}
            suffix="Successful checkouts"
            color="text-blue-600"
            bg="bg-blue-50"
          />

          {/* Actionable Metrics (Lean Startup) */}
          <MetricCard 
            title="Activation Rate" 
            value={`${stats.activationRate}%`} 
            icon={<Users className="w-6 h-6" />}
            suffix="Views per signup"
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <MetricCard 
            title="Conversion Rate" 
            value={`${stats.conversionRate}%`} 
            icon={<ShoppingCart className="w-6 h-6" />}
            suffix="Cart to Booking"
            color="text-violet-600"
            bg="bg-violet-50"
          />
          <MetricCard 
            title="Conflict Rate" 
            value={`${stats.conflictRate}%`} 
            icon={<AlertTriangle className="w-6 h-6" />}
            suffix="Booking failures"
            color="text-amber-600"
            bg="bg-amber-50"
          />
          <MetricCard 
            title="Revenue per Active User" 
            value={`$${stats.rpau}`} 
            icon={<DollarSign className="w-6 h-6" />}
            suffix="Avg value per space view"
            color="text-rose-600"
            bg="bg-rose-50"
          />
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, icon, suffix, color, bg }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 ${bg} rounded-2xl group-hover:scale-110 transition-transform`}>
          <div className={color}>{icon}</div>
        </div>
      </div>
      <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <p className={`text-4xl font-black ${color}`}>{value}</p>
      </div>
      <p className="text-slate-400 text-sm mt-4 font-medium italic">{suffix}</p>
    </div>
  );
}
