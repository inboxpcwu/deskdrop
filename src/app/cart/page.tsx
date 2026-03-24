'use client';

import { useCart } from '@/context/CartContext';
import { Trash2, Calendar, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-indigo-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">
          Explore our premium workspaces and book your next focus session today.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          Browse Spaces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
        Your Cart <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">{items.length} items</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.space_id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{item.space_name}</h3>
                
                <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span>{format(parseISO(item.start_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span>
                      {format(parseISO(item.start_at), 'HH:mm')} - {format(parseISO(item.end_at), 'HH:mm')}
                    </span>
                  </div>
                </div>

                <p className="text-indigo-600 font-bold text-lg">
                  ${item.total_price} <span className="text-xs text-gray-400 font-normal">(${item.price_per_hour}/hr)</span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => removeItem(item.space_id)}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Remove item"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Service Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-2xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-indigo-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-100 transition-all active:scale-[0.98]"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>
            
            <p className="mt-6 text-center text-xs text-gray-400">
              Tax will be calculated at next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
