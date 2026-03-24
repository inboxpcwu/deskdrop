'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { CreditCard, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    setIsProcessing(true);
    try {
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (resp.ok) {
        trackEvent('purchase', {
          transaction_id: `book_${Date.now()}`,
          value: total,
          currency: 'USD',
          items: items.map(item => ({
            item_id: item.space_id,
            item_name: item.space_name,
            price: item.price_per_hour,
            quantity: item.total_price / item.price_per_hour
          }))
        });
        setIsSuccess(true);
        clearCart();
        setTimeout(() => router.push('/bookings'), 3000);
      } else {
        const err = await resp.json();
        alert(err.error || 'Booking failed');
      }
    } catch {
      alert('Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 bg-white rounded-3xl shadow-2xl text-center border border-emerald-100 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-emerald-500/10">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Space Secured!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your booking has been confirmed. You will be redirected to your bookings page in a moment.
        </p>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full animate-[progress_3s_linear_forwards]"></div>
        </div>
        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left: Summary */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Checkout</h1>
            <p className="text-gray-500 font-medium italic">Review your order summary before confirming.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {items.map((item) => (
              <div key={item.space_id} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{item.space_name}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                    {item.total_price / item.price_per_hour} hours booked
                  </p>
                </div>
                <p className="font-bold text-slate-800">${item.total_price}</p>
              </div>
            ))}
            
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Total Due Today</span>
                <span className="text-2xl font-black text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100/50">
            <ShieldCheck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
            <p className="text-xs text-indigo-800 font-medium">
              Your data is encrypted and secure. We do not store sensitive payment information in v1.
            </p>
          </div>
        </div>

        {/* Right: Dummy Payment */}
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 ring-1 ring-slate-900/5">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-500" /> Payment Info
          </h2>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-indigo-100">
              <p className="text-sm font-bold text-indigo-600 mb-1 uppercase tracking-widest">Selected Method</p>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">Demo Mode / No Charge</span>
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-sm text-gray-500 leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-1">
                &quot;Real payments are disabled for this demo. Clicking confirm will create a live booking record in the database.&quot;
              </p>

              <button
                onClick={handleConfirm}
                disabled={isProcessing || authLoading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 shadow-2xl hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Finalizing...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
