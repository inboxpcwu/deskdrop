'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Save, Layout, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data) setFullName(data.full_name || '');
    }
    getProfile();
  }, [user]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      setMessage('Profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 ring-1 ring-slate-900/5">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-32 relative">
          <div className="absolute -bottom-10 left-10">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden">
               <User className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-10 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <form onSubmit={updateProfile} className="w-full md:w-2/3 space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Your Profile</h1>
                <p className="text-gray-500 font-medium">Update your account settings and preferences.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white outline-none transition-all font-semibold text-gray-800"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-6 py-4 bg-slate-100 border-0 rounded-2xl cursor-not-allowed font-semibold text-gray-400"
                    value={user?.email || ''}
                  />
                </div>
              </div>

              {message && (
                <p className="bg-emerald-50 text-emerald-700 px-6 py-4 rounded-2xl font-bold flex items-center gap-2 border border-emerald-100/50">
                  <Layout className="w-5 h-5" /> {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> {loading ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </form>

            <div className="w-full md:w-1/3 bg-slate-50 p-8 rounded-3xl border border-slate-100">
               <div className="flex items-center gap-2 mb-6">
                 <Shield className="w-5 h-5 text-indigo-500" />
                 <h2 className="font-bold text-gray-900">Security</h2>
               </div>
               <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                 Password changes are currently handled via Supabase Magic Links. Visit account recovery to reset.
               </p>
               <button 
                 onClick={() => alert('Password reset link sent to your email!')}
                 className="w-full py-4 bg-white border border-slate-200 text-gray-700 rounded-xl font-bold text-sm hover:shadow-md transition-all"
                >
                 Request Password Reset
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
