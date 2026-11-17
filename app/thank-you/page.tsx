'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
  useEffect(() => {
    // 🔥 Meta Pixel Purchase Event Trigger
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'PKR',
        value: 2299, // Agar 2 bottles wala ho toh 4400 bhi kar sakte hain
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E0] to-[#F9EBEA] flex flex-col items-center justify-center p-4 text-slate-900 font-sans">
      <div className="bg-white/95 border-2 border-red-700 rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl space-y-6">
        <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-600 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md animate-bounce">
          ✓
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order Confirmed!</h1>
        <p className="text-xs sm:text-sm text-slate-700 font-medium">
          Aapka order kamyabi se book ho gaya hai. Hum jald hi aap se rabta karenge.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-red-700 hover:bg-red-800 text-white font-black py-3.5 rounded-xl shadow-lg transition-all text-sm uppercase"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
