'use client';

import { useEffect } from 'react';

export default function ThankYouPage() {
  useEffect(() => {
    // Meta Pixel Purchase Event Trigger
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'PKR',
        value: 2299, // Apni product ki price yahan rakh sakte hain
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-green-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Shukriya! Aapka order kamyabi se book ho gaya hai. Hum jald hi aap se rabta karenge.
        </p>
        <a
          href="/"
          className="inline-block bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-red-800 transition"
        >
          Go Back to Home
        </a>
      </div>
    </main>
  );
}
