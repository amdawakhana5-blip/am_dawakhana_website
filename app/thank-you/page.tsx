'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
  useEffect(() => {
    // 🔥 Meta Pixel Purchase Event Trigger
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'PKR',
        value: 2299,
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] flex items-center justify-center p-4 sm:p-6 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Decorative Glow Circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Card Container */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl space-y-6 text-slate-900">
        
        {/* Animated Success Checkmark */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full flex items-center justify-center mx-auto text-4xl sm:text-5xl shadow-lg shadow-emerald-600/30 animate-bounce">
          ✓
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-2">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
            Order Confirmed Successfully
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Shukriya! Aapka Order Book Ho Gaya Hai
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed px-2">
            Humari team jald hi aap se rabta karegi aur order dispatch karne se pehle call par confirm karegi.
          </p>
        </div>

        {/* Order Details / Info Box */}
        <div className="bg-[#FAF3E0]/70 border border-amber-200/80 rounded-2xl p-4 text-left space-y-2 text-xs sm:text-sm text-slate-700">
          <div className="flex justify-between font-semibold border-b border-amber-200 pb-2">
            <span>Status:</span>
            <span className="text-emerald-700 font-bold">Confirmed & Processing</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Payment Method:</span>
            <span className="text-slate-900">Cash on Delivery (COD)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-black py-4 rounded-xl shadow-lg shadow-red-700/30 transition-all text-sm sm:text-base uppercase tracking-wider text-center"
          >
            Wapas Home Page Par Jayen
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 font-medium">
          AM Dawakhana &bull; Pure Herbs & Unani Solutions
        </p>
      </div>
    </main>
  );
}
