'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [extraImageIndex, setExtraImageIndex] = useState(0);

  // Popups States (Two-Step Confirmation Flow)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Custom Dropdown State for Styling
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // See More Reviews State
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Secondary Videos States (Video 1 & Video 2)
  const [isVideo1Playing, setIsVideo1Playing] = useState(false);
  const [isVideo2Playing, setIsVideo2Playing] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 38, seconds: 10 });
  const [recentOrder, setRecentOrder] = useState({ name: 'Bilal Ahmed', city: 'Karachi', time: 'Just now' });
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: '1 Bottle (20 Tablets) - Rs. 2,299',
  });
  const [loading, setLoading] = useState(false);

  // Exact Classic Nastaliq Urdu Font Styling
  const nastaliqStyle = {
    fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaliq', serif",
    lineHeight: '2.4',
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live Recent Order Toast Notification (Compact & Bottom-Left)
  useEffect(() => {
    const buyers = [
      { name: 'Bilal Ahmed', city: 'Karachi' },
      { name: 'Rizwan', city: 'Islamabad' },
      { name: 'Ahmed Khan', city: 'Lahore' },
      { name: 'Muneeb', city: 'Faisalabad' },
      { name: 'Usman Ali', city: 'Rawalpindi' },
      { name: 'Hamza', city: 'Multan' },
    ];

    const orderInterval = setInterval(() => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      const randomMinutes = Math.floor(Math.random() * 4) + 1;
      setRecentOrder({
        name: randomBuyer.name,
        city: randomBuyer.city,
        time: `${randomMinutes}m ago`,
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }, 7000);

    return () => clearInterval(orderInterval);
  }, []);

  const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg', '/8.jpg', '/9.jpg'];
  const extraImages = ['/10.jpg', '/11.jpg'];

  // Auto-play Image Sliders (Smooth and comfortable timing)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    const extraTimer = setInterval(() => {
      setExtraImageIndex((prevIndex) => (prevIndex + 1) % extraImages.length);
    }, 6000);

    return () => {
      clearInterval(timer);
      clearInterval(extraTimer);
    };
  }, [images.length, extraImages.length]);

  // Secondary Videos Controls
  const toggleVideo1 = () => {
    if (video1Ref.current) {
      if (video1Ref.current.paused) {
        video1Ref.current.play();
        setIsVideo1Playing(true);
      } else {
        video1Ref.current.pause();
        setIsVideo1Playing(false);
      }
    }
  };

  const toggleVideo2 = () => {
    if (video2Ref.current) {
      if (video2Ref.current.paused) {
        video2Ref.current.play();
        setIsVideo2Playing(true);
      } else {
        video2Ref.current.pause();
        setIsVideo2Playing(false);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleFinalOrderConfirm = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      // Map quantity selection string to clean value/quantity for the backend sheet
      const payload = {
        ...formData,
        quantityValue: formData.quantity.includes('2 Bottles') ? 2 : 1,
      };

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowSuccessPopup(true);
        setFormData({
          name: '',
          phone: '',
          address: '',
          quantity: '1 Bottle (20 Tablets) - Rs. 2,299',
        });
      } else {
        alert('Order submit karne mein masla aaya. Dobara koshish karein.');
      }
    } catch (err) {
      alert('Network ka masla hai. Apna internet check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FDFBF7] text-slate-900 font-sans overflow-x-hidden selection:bg-red-600 selection:text-white pb-24 sm:pb-0">
      
      {/* Top Compact & Stylish Timer Banner */}
      <div className="relative z-50 bg-gradient-to-r from-red-950 via-amber-900 to-red-900 text-white text-center py-2 px-3 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
            <span>🔥</span> <span>⏳</span> <span>Price will go up soon!</span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="bg-[#FAF7EE] text-red-950 px-2 py-0.5 rounded-lg font-black text-xs shadow">
              {String(timeLeft.hours).padStart(2, '0')} <span className="text-[8px] text-slate-600">hrs</span>
            </div>
            <span className="text-white font-bold">:</span>
            <div className="bg-[#FAF7EE] text-red-950 px-2 py-0.5 rounded-lg font-black text-xs shadow">
              {String(timeLeft.minutes).padStart(2, '0')} <span className="text-[8px] text-slate-600">mins</span>
            </div>
            <span className="text-white font-bold">:</span>
            <div className="bg-[#FAF7EE] text-red-950 px-2 py-0.5 rounded-lg font-black text-xs shadow">
              {String(timeLeft.seconds).padStart(2, '0')} <span className="text-[8px] text-slate-600">secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Left-Aligned Professional Header */}
      <header className="relative z-40 py-3 sm:py-4 px-3 sm:px-6 border-b border-red-700/20 bg-gradient-to-r from-white via-[#FAF6ED] to-amber-50/90 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
          
          {/* Left Side: Logo & Dual-color Heading */}
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 overflow-hidden rounded-full border-2 border-red-700 bg-amber-100 shadow-md shrink-0">
              <Image
                src="/logo.png"
                alt="AM Dawakhana Logo"
                fill
                sizes="(max-width: 640px) 44px, 56px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm sm:text-lg font-black tracking-tight leading-tight">
                <span className="text-amber-600">AM</span>{' '}
                <span className="text-red-800">Unani</span>{' '}
                <span className="text-slate-800">&amp;</span>{' '}
                <span className="text-emerald-700">Herbal</span> Labs
              </div>
              <div className="text-xs sm:text-base font-extrabold leading-tight tracking-wide flex items-center gap-1.5 mt-0.5" style={nastaliqStyle} dir="rtl">
                <span className="text-red-800">اے ایم</span> <span className="text-emerald-800">دواخانہ</span>
              </div>
            </div>
          </div>

          {/* Right Side: Perfectly Aligned Equal-Sized Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/923150894064?text=Salam,%20mujhe%20AM%20Dawakhana%20ke%20bary%20mein%20puchna%20hai."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs sm:text-sm transition-all transform hover:scale-105 shadow-md flex items-center gap-1.5 border border-emerald-400/50 shrink-0"
              title="WhatsApp Chat"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            <a
              href="#order-form"
              className="bg-gradient-to-r from-red-700 to-amber-700 hover:from-red-800 hover:to-amber-800 text-white font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm transition-all transform hover:scale-105 shadow-md tracking-wider uppercase border border-red-400/50 shrink-0"
            >
              Order Now
            </a>
          </div>

        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        
        {/* Main Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 sm:mb-16">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-300 text-red-950 font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-700 animate-ping"></span>
              <span>100% Khalis Aur Mehfooz Nuskha</span>
              <span>•</span>
              <span style={nastaliqStyle} className="text-red-950">20 ٹیبلٹس</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-amber-200 pb-5">
              <div className="text-left border-l-4 border-red-700 pl-3.5 space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-wide">
                  Taqat Ka Khazana
                </h1>
                <p className="text-red-800 font-black text-xs sm:text-sm tracking-wide">
                  Mardana Quwwat Ka Asli Hal
                </p>
              </div>

              <div className="text-right border-r-4 border-red-700 pr-3.5 space-y-1" style={nastaliqStyle} dir="rtl">
                <h2 className="text-2xl sm:text-4xl font-black text-red-950">
                  طاقت کا خزانہ
                </h2>
                <p className="text-red-800 font-extrabold text-base sm:text-xl">
                  مردانہ قوت کا بااعتماد حل
                </p>
              </div>
            </div>

            {/* Urdu description box */}
            <div className="bg-white/90 p-5 sm:p-6 rounded-2xl border-2 border-amber-200 shadow-md text-right" style={nastaliqStyle} dir="rtl">
              <p className="text-slate-900 text-base sm:text-lg font-bold">
                طاقتور ہربل فارمولا ہے جو خاص طور پر مردوں کے لیے تیار کیا گیا ہے جو کمزوری، کم ٹائمنگ اور اعصابی نقاہت کا شکار ہیں۔
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-amber-200 text-left shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-800 font-black text-[10px] uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded">
                    Product Overview
                  </span>
                  <span className="text-red-600">🔥</span>
                </div>
                <p className="text-slate-700 font-medium text-xs sm:text-sm leading-relaxed">
                  AM Vitality Tablet is a master blend of rare Himalayan herbs designed to deliver absolute vigor, peak stamina, and enduring performance.
                </p>
              </div>
              
              <div className="bg-white/90 p-4 sm:p-5 rounded-2xl border border-amber-200 text-right shadow-md" style={nastaliqStyle} dir="rtl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-700 font-black text-xs bg-amber-100 px-2.5 py-0.5 rounded">
                    پروڈکٹ کا تعارف
                  </span>
                  <span className="text-red-700">🌿</span>
                </div>
                <p className="text-slate-800 text-base sm:text-lg font-bold">
                  اے ایم وائٹلٹی ٹیبلٹ نایاب دیسی جڑی بوٹیوں کا شاہکار مرکب ہے، جو دیتا ہے بھرپور طاقت اور دیرپا اسٹیمنا۔
                </p>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/90 border border-amber-200 p-3 rounded-xl text-center shadow-sm">
                <div className="text-red-800 font-extrabold text-xs sm:text-sm">20 Tablets</div>
                <div className="text-slate-700 text-xs mt-1 font-bold" style={nastaliqStyle}>20 ٹیبلٹس</div>
              </div>
              <div className="bg-white/90 border border-amber-200 p-3 rounded-xl text-center shadow-sm">
                <div className="text-red-800 font-extrabold text-xs sm:text-sm">100% Herbal</div>
                <div className="text-slate-700 text-xs mt-1 font-bold" style={nastaliqStyle}>بغیر نقصان</div>
              </div>
              <div className="bg-white/90 border border-amber-200 p-3 rounded-xl text-center shadow-sm">
                <div className="text-red-800 font-extrabold text-xs sm:text-sm">Free Delivery</div>
                <div className="text-slate-700 text-xs mt-1 font-bold" style={nastaliqStyle}>مفت ڈلیوری</div>
              </div>
            </div>

          </div>

          {/* Right Column: Fixed Image Boxes with Non-cutting object-contain display */}
          <div className="flex flex-col gap-4 w-full">
            
            {/* Box 1: Main Big Image Slider */}
            <div className="relative w-full bg-white border-2 border-amber-300 rounded-3xl p-3 shadow-xl overflow-hidden">
              <div className="relative w-full aspect-[4/3] max-h-[380px] overflow-hidden rounded-2xl bg-[#FAF7EE] flex items-center justify-center">
                <Image
                  src={images[currentImageIndex]}
                  alt={`AM Dawakhana Slide ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain w-full h-full transition-all duration-700 p-2"
                  priority
                />
              </div>

              {/* Thumbnails Row Centered */}
              <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                {images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                      currentImageIndex === idx ? 'border-red-700 ring-2 ring-red-400/50 scale-105 shadow-md' : 'border-amber-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Extra Gallery Slide */}
            <div className="relative w-full bg-white border-2 border-amber-300 rounded-3xl p-3 shadow-xl overflow-hidden">
              <div className="relative w-full aspect-[4/3] max-h-[320px] overflow-hidden rounded-2xl bg-[#FAF7EE] flex items-center justify-center">
                <Image
                  src={extraImages[extraImageIndex]}
                  alt={`AM Dawakhana Extra Slide ${extraImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain w-full h-full transition-all duration-700 p-2"
                  priority
                />
              </div>

              {/* Thumbnails Row Centered */}
              <div className="flex justify-center gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-thin">
                {extraImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExtraImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                      extraImageIndex === idx ? 'border-red-700 ring-2 ring-red-400/50 scale-105 shadow-md' : 'border-amber-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Extra Thumbnail ${idx + 1}`} fill className="object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </section>

        {/* SECONDARY VIDEOS SECTION */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white/90 border border-amber-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg text-center">
            <span className="bg-amber-100 text-red-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-2">
              Extra Demonstration
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Product Videos
            </h3>
            <p className="text-slate-700 text-sm mt-1 mb-6 font-bold" style={nastaliqStyle}>
              مزید ویڈیوز اور کسٹمرز کے تجربات ملاحظہ کریں
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#FAF7EE] border border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-amber-300 group flex items-center justify-center">
                  <video 
                    ref={video1Ref}
                    controls 
                    preload="metadata"
                    playsInline
                    poster="/1.jpg"
                    onPlay={() => setIsVideo1Playing(true)}
                    onPause={() => setIsVideo1Playing(false)}
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src="/video1.mp4" type="video/mp4" />
                    Aap ka browser video support nahi karta.
                  </video>

                  {!isVideo1Playing && (
                    <div 
                      onClick={toggleVideo1}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all"
                    >
                      <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                        <svg className="w-7 h-7 fill-white ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-red-950 font-extrabold text-sm sm:text-base mt-3">
                  Official Introduction & Results
                </p>
              </div>

              <div className="bg-[#FAF7EE] border border-amber-200 p-3.5 rounded-2xl shadow-sm flex flex-col items-center">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-amber-300 group flex items-center justify-center">
                  <video 
                    ref={video2Ref}
                    controls 
                    preload="metadata"
                    playsInline
                    poster="/2.jpg"
                    onPlay={() => setIsVideo2Playing(true)}
                    onPause={() => setIsVideo2Playing(false)}
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src="/video2.mp4" type="video/mp4" />
                    Aap ka browser video support nahi karta.
                  </video>

                  {!isVideo2Playing && (
                    <div 
                      onClick={toggleVideo2}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer group-hover:bg-black/20 transition-all"
                    >
                      <div className="w-14 h-14 bg-red-700 rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                        <svg className="w-7 h-7 fill-white ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-red-950 font-extrabold text-sm sm:text-base mt-3">
                  Unboxing & Customer Feedback
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 12 Key Ingredients Section */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-white/90 border border-amber-200 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <span className="bg-amber-100 text-red-950 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
                Khaas Unani Nuskha
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                Key Ingredients / <span style={nastaliqStyle} className="text-red-800">نایاب دیسی اجزاء کی تفصیل</span>
              </h3>
              <p className="text-slate-700 text-xs sm:text-sm mt-1.5 font-semibold">
                Har tablet mein shamil 12 behtareen qudrati aur kamil ajza jo aap ko dein mukammal quwwat.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Zafran (زعفران)</div>
                <div className="text-slate-600 text-[11px] font-medium">Energy & Blood Circulation</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Salab Misri (ثعلب مصری)</div>
                <div className="text-slate-600 text-[11px] font-medium">Stamina & Muscle Strength</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Shilajit (شیلاجیت)</div>
                <div className="text-slate-600 text-[11px] font-medium">Pure Himalayan Mineral Tonic</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Akarkara (عقرقرحا)</div>
                <div className="text-slate-600 text-[11px] font-medium">Nerve Stimulation & Josh</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Kasturi (کستوری)</div>
                <div className="text-slate-600 text-[11px] font-medium">Maximum Strength Booster</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Jund Bedastar (جند بدستر)</div>
                <div className="text-slate-600 text-[11px] font-medium">Physical Power & Vigor</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Asgandh (اسگندھ ناگوری)</div>
                <div className="text-slate-600 text-[11px] font-medium">Stress Relief & Stamina</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Maghaz Chilgoza (مغز جلغوزہ)</div>
                <div className="text-slate-600 text-[11px] font-medium">Natural Body Warmth</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Tukhm E Rehan (تخم ریحان)</div>
                <div className="text-slate-600 text-[11px] font-medium">Cooling & Energy Balance</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Darchini (دارچینی)</div>
                <div className="text-slate-600 text-[11px] font-medium">Metabolism & Circulation</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Jaifal & Javitri (جائفل و جوتری)</div>
                <div className="text-slate-600 text-[11px] font-medium">Vitality & Performance</div>
              </div>
              <div className="bg-[#FAF7EE] border border-amber-200 p-4 rounded-xl text-center space-y-1 hover:border-red-600 transition-all shadow-sm">
                <div className="text-red-950 font-extrabold text-sm sm:text-base">Kushta Tilla (کشتہ طلا)</div>
                <div className="text-slate-600 text-[11px] font-medium">Ultimate Strength Formula</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Grid */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-3xl font-black text-slate-900">
              Why Choose AM Dawakhana?
            </h3>
            <p className="text-red-800 text-base sm:text-xl mt-1 font-bold" style={nastaliqStyle} dir="rtl">
              اے ایم دواخانہ ہی کیوں منتخب کریں؟
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/90 border border-amber-200 p-4.5 rounded-2xl text-center space-y-2 hover:border-red-600 transition-all shadow-sm">
              <div className="text-3xl">🌿</div>
              <div className="text-red-950 font-extrabold text-sm sm:text-base">100% Organic</div>
              <p className="text-slate-700 text-xs font-medium">Pure Herbal Formula</p>
            </div>
            <div className="bg-white/90 border border-amber-200 p-4.5 rounded-2xl text-center space-y-2 hover:border-red-600 transition-all shadow-sm">
              <div className="text-3xl">⚡</div>
              <div className="text-red-950 font-extrabold text-sm sm:text-base">Fast Action</div>
              <p className="text-slate-700 text-xs font-medium">Asar 1-2 Ghante Mein</p>
            </div>
            <div className="bg-white/90 border border-amber-200 p-4.5 rounded-2xl text-center space-y-2 hover:border-red-600 transition-all shadow-sm">
              <div className="text-3xl">📦</div>
              <div className="text-red-950 font-extrabold text-sm sm:text-base">Discreet Packing</div>
              <p className="text-slate-700 text-xs font-medium">Full Raazdaari Ke Saath</p>
            </div>
            <div className="bg-white/90 border border-amber-200 p-4.5 rounded-2xl text-center space-y-2 hover:border-red-600 transition-all shadow-sm">
              <div className="text-3xl">🚚</div>
              <div className="text-red-950 font-extrabold text-sm sm:text-base">Free Delivery</div>
              <div className="text-slate-700 text-xs font-medium">Cash On Delivery</div>
            </div>
          </div>
        </section>

        {/* Pricing Packages Box */}
        <section className="bg-white/90 border border-amber-200 text-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-10 mb-12 sm:mb-16 text-center relative overflow-hidden shadow-lg">
          <div className="inline-block bg-red-700 text-white font-black text-xs px-4 py-1.5 rounded-full mb-3 shadow-sm uppercase tracking-wider animate-pulse">
            Khaas Riayat Offer
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-2 text-slate-900">
            AM Dawakhana Price Packages
          </h2>
          <p className="text-red-800 text-base sm:text-xl mb-6 font-bold" style={nastaliqStyle} dir="rtl">
            قیمت کی تفصیلات - پورے پاکستان میں مفت ہوم ڈیلیوری
          </p>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="bg-[#FAF7EE] border border-amber-200 p-5 sm:p-6 rounded-2xl text-center shadow-sm">
              <div className="text-slate-800 font-extrabold text-sm sm:text-base">1 Bottle (20 Tablets)</div>
              <div className="text-red-950 text-sm sm:text-lg font-bold mt-0.5" style={nastaliqStyle} dir="rtl">ایک بوتل (20 ٹیبلٹس)</div>
              <div className="text-red-800 text-3xl sm:text-4xl font-black my-2.5">Rs. 2,299</div>
              <div className="text-[11px] sm:text-xs text-slate-600 font-semibold">Free Delivery Included</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-amber-100 border-2 border-red-700 p-5 sm:p-6 rounded-2xl text-center shadow-md relative">
              <div className="absolute -top-3.5 right-3 sm:right-4 bg-red-700 text-white font-black text-[10px] sm:text-xs px-3.5 py-1 rounded-full shadow-sm">
                Bachat Offer
              </div>
              <div className="text-red-950 font-extrabold text-sm sm:text-base">2 Bottles (40 Tablets)</div>
              <div className="text-red-900 text-sm sm:text-lg font-bold mt-0.5" style={nastaliqStyle} dir="rtl">دو بوتلیں (40 ٹیبلٹس - مکمل کورس)</div>
              <div className="text-red-800 text-3xl sm:text-4xl font-black my-2.5">Rs. 4,400</div>
              <div className="text-[11px] sm:text-xs text-red-900 font-bold">Special Discount + Free Delivery</div>
            </div>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-black text-red-950 uppercase tracking-wider">
              Trusted By Thousands - Real Customers Feedback
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">Verified buyers sharing their experience with our products.</p>
          </div>

          {/* Rating Summary Box */}
          <div className="bg-white/90 border border-amber-200 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-md mb-8 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="text-center">
              <div className="text-5xl font-black text-red-950">4.9</div>
              <div className="flex text-amber-500 text-base justify-center my-1">★★★★★</div>
              <div className="text-xs text-slate-600 font-semibold">Based on 2,847 Reviews</div>
            </div>
            <div className="w-full sm:w-1/2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>5★</span>
                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div className="w-[90%] h-full bg-gradient-to-r from-red-800 to-amber-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>4★</span>
                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div className="w-[8%] h-full bg-gradient-to-r from-red-800 to-amber-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>3★</span>
                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div className="w-[2%] h-full bg-gradient-to-r from-red-800 to-amber-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>2★</span>
                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div className="w-[0%] h-full bg-gradient-to-r from-red-800 to-amber-600 rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>1★</span>
                <div className="flex-1 h-3 bg-amber-100 rounded-full overflow-hidden">
                  <div className="w-[0%] h-full bg-gradient-to-r from-red-800 to-amber-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Bilal Ahmed</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "worth it cheez hai or me bp pateint hun but mera bp control rehta hai is tablets sy ."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
            </div>

            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Rizwan</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "AM Vitality Tablet ka experience honestly kaafi acha raha. Pehle thori hesitation thi lekin use ke baad confidence mein noticeable improvement feel hui. Overall satisfied."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
            </div>

            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Ahmed Khan</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "first time meny koi sexual tablet use ki hain or me to ap logo ka regular customer banny wala hun Love you AM Dawakhana."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet (Ultra)</div>
            </div>

            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Muneeb</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "Main ne AM Vitality Tablet try ki aur mujhe iska overall experience kaafi impressive laga. Quality achi hai aur routine mein bhi positive difference mehsoos hua."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
            </div>

            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Usman Ali</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "Pehly me inki normal tablets use karta tha bhot achi thi but inho ny new launch kia hai AM Vitality Tablet bhai bht hi zabardast cheez hai."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet (Ultra)</div>
            </div>

            <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-black text-slate-900 text-base">Hamza</div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
              </div>
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                "Herbal products mein se AM Vitality mujhe sab se better laga. Use ke baad confidence aur overall performance mein achi improvement feel hui."
              </p>
              <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
            </div>

            {/* Hidden Additional Reviews shown when See More is clicked */}
            {showAllReviews && (
              <>
                <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-base">Tariq Jamil</div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
                  </div>
                  <div className="flex text-amber-500 text-sm">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    "Bohot hi behtareen result mila hai. Koi side effect nahi hua aur timing mein behtareen izafa hua hai."
                  </p>
                  <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
                </div>

                <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-base">Fahad Mustafa</div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
                  </div>
                  <div className="flex text-amber-500 text-sm">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    "Packing bohot secure aur confidential thi. Delivery bhi 2 din mein mil gayi thi. Highly recommended."
                  </p>
                  <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet</div>
                </div>

                <div className="bg-white/95 border-t-4 border-red-700 border-x border-b border-amber-200 p-6 rounded-2xl shadow-md space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900 text-base">Zubair Abbasi</div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">Verified Buyer</span>
                  </div>
                  <div className="flex text-amber-500 text-sm">★★★★★</div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    "Maqsood Dawakhana aur AM Labs ka yeh nuskha sach mein lajawab hai. Mera porana course complete ho gaya hai."
                  </p>
                  <div className="pt-2 text-xs font-bold text-red-800 uppercase tracking-wide">AM Vitality Tablet (Course)</div>
                </div>
              </>
            )}

          </div>

          {/* See More Reviews Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-amber-200 hover:bg-amber-300 text-red-950 font-black px-8 py-3 rounded-full text-sm shadow-md transition-all border border-amber-300"
            >
              {showAllReviews ? 'Show Less Reviews / کم ریویوز دیکھیں' : 'See More Reviews / مزید ریویوز دیکھیں (3+)'}
            </button>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-form" className="max-w-xl mx-auto">
          <div className="bg-white/95 border-2 border-red-700/50 rounded-3xl p-5 sm:p-10 shadow-xl relative">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-black text-slate-900">
                Order Form / <span style={nastaliqStyle} className="text-red-800">آرڈر فارم</span>
              </h2>
              <p className="text-slate-700 text-sm sm:text-lg mt-2 font-bold" style={nastaliqStyle} dir="rtl">
                اپنی تفصیلات درج کریں، ہم آپ سے تصدیق کے لیے رابطہ کریں گے۔
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-slate-800 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Full Name</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-red-800 text-sm">پورا نام *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apna poora naam likhein / اپنا نام لکھیں"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7EE] border border-amber-300 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Mobile / WhatsApp Number</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-red-800 text-sm">موبائل نمبر *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7EE] border border-amber-300 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Complete Address & City</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-red-800 text-sm">مکمل پتہ اور شہر کا نام *</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House/Shop No, Street, Area, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#FAF7EE] border border-amber-300 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-700 transition-colors"
                ></textarea>
              </div>

              {/* CUSTOM DROPDOWN */}
              <div>
                <label className="block text-slate-800 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Select Deal / Package</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-red-800 text-sm">پیکج منتخب کریں *</span>
                </label>

                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#FAF7EE] border-2 border-red-700/60 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-red-950 font-black cursor-pointer flex justify-between items-center shadow-sm hover:border-red-700 transition-all"
                  >
                    <span className="truncate pr-2">{formData.quantity}</span>
                    <span className={`text-red-800 transform transition-transform duration-300 text-lg ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                      ▼
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-red-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
                      <div 
                        onClick={() => {
                          setFormData({ ...formData, quantity: '1 Bottle (20 Tablets) - Rs. 2,299' });
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3.5 text-xs sm:text-sm text-slate-800 font-bold hover:bg-red-700 hover:text-white cursor-pointer border-b border-amber-100 transition-all flex items-center justify-between"
                      >
                        <span>1 Bottle (20 Tablets) - Rs. 2,299</span>
                        <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded text-red-950 font-mono">Free Delivery</span>
                      </div>

                      <div 
                        onClick={() => {
                          setFormData({ ...formData, quantity: '2 Bottles (40 Tablets) - Rs. 4,400' });
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3.5 text-xs sm:text-sm text-red-950 font-black hover:bg-red-700 hover:text-white cursor-pointer transition-all flex items-center justify-between"
                      >
                        <span>2 Bottles (40 Tablets) - Rs. 4,400</span>
                        <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-extrabold">Bachat Offer</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-700 via-amber-700 to-red-900 hover:from-red-800 hover:to-red-950 text-white font-black text-sm sm:text-lg py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 uppercase tracking-wider border border-red-500/50"
              >
                {loading ? 'Submitting...' : 'CONFIRM ORDER NOW / آرڈر کی تصدیق کریں'}
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* 🔔 COMPACT RECENT ORDER TOAST POPUP (Bottom-Left Corner) */}
      {showToast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 z-50 bg-white border border-red-700/40 text-slate-900 px-3 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 transition-all duration-300 max-w-[260px] animate-fadeIn">
          <div className="w-8 h-8 rounded-full bg-red-700 text-white font-black flex items-center justify-center shrink-0 text-xs shadow">
            📦
          </div>
          <div>
            <p className="text-[11px] font-bold text-red-950 leading-tight">Naya Order Moosool Hua!</p>
            <p className="text-[10px] text-slate-700 font-medium leading-tight">
              <strong className="text-slate-900">{recentOrder.name}</strong> ({recentOrder.city}) • <span className="text-red-700">{recentOrder.time}</span>
            </p>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Chat Button */}
      <a
        href="https://wa.me/923150894064?text=Salam,%20mujhe%20AM%20Dawakhana%20ke%20bary%20mein%20puchna%20hai."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-4 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 border-2 border-emerald-400"
        title="Chat on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* Mobile Sticky Footer Button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-[#FAF7EE]/95 border-t border-amber-200 backdrop-blur-md">
        <a
          href="#order-form"
          className="block text-center w-full bg-gradient-to-r from-red-700 to-amber-700 text-white font-black py-3 rounded-xl shadow-lg text-sm tracking-wider uppercase border border-red-500"
        >
          ⚡ ORDER NOW (CASH ON DELIVERY)
        </a>
      </div>

      {/* Colorful Vibrant Footer with Number +3150894064 */}
      <footer className="relative z-10 border-t-4 border-red-700 bg-gradient-to-r from-red-950 via-amber-950 to-red-900 pt-12 pb-20 sm:pb-10 text-white mt-16 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden bg-amber-100 shadow-md">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <h4 className="font-black text-amber-300 text-lg sm:text-xl">AM Unani &amp; Herbal Labs</h4>
            </div>
            <p className="text-xs text-amber-100 leading-relaxed font-medium">
              Pakistan ka bharpoor aur qabil-e-itminan idara jo faraham karta hai 100% khalis aur behtareen herbal nuskha-jat.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-black text-amber-400 text-sm uppercase tracking-wider">Contact &amp; Support</h5>
            <ul className="space-y-2 text-xs font-semibold text-amber-100">
              <li className="flex items-center gap-2"><span className="text-amber-400">📞</span> Contact / WhatsApp: +92 315 0894064</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> 100% Pure Himalayan Herbs</li>
              <li className="flex items-center gap-2"><span className="text-amber-400">✓</span> Free Discreet Delivery Across Pakistan</li>
            </ul>
          </div>

          <div className="space-y-3 text-right" style={nastaliqStyle} dir="rtl">
            <h5 className="font-black text-amber-400 text-2xl">اے ایم دواخانہ</h5>
            <p className="text-sm text-amber-100 font-bold">
              اعتماد، صحت اور قدرت کا بہترین امتزاج۔ 100٪ دیسی اور محفوظ نسخہ جات۔
            </p>
            <div className="pt-2">
              <span className="inline-block bg-red-900/80 border border-amber-400/50 text-amber-200 text-xs px-3.5 py-1 rounded-lg font-mono">
                📞 Help Desk / WhatsApp: +92 315 0894064
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-red-800 text-center flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-amber-200/80 font-semibold">
          <p>© 2026 AM Unani &amp; Herbal Labs. All Rights Reserved.</p>
          <p className="text-amber-400 font-bold tracking-wide">Pure Herbal Mastery</p>
        </div>
      </footer>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-red-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-6 relative">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 border-2 border-red-700 text-red-700 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-md">
              🛒
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Confirm Your Order?
              </h3>
              <h4 className="text-lg sm:text-2xl font-bold text-red-900" style={nastaliqStyle} dir="rtl">
                کیا آپ آرڈر کی تصدیق کرنا چاہتے ہیں؟
              </h4>
            </div>

            <div className="bg-[#FAF7EE] p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700 text-left space-y-2">
              <p><strong className="text-red-900">Naam:</strong> {formData.name}</p>
              <p><strong className="text-red-900">Number:</strong> {formData.phone}</p>
              <p><strong className="text-red-900">Package:</strong> {formData.quantity}</p>
              <p><strong className="text-red-900">Address:</strong> {formData.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold py-3 rounded-xl transition-all text-xs sm:text-sm"
              >
                Nahi / بند کریں
              </button>

              <button
                type="button"
                onClick={handleFinalOrderConfirm}
                className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-3 rounded-xl shadow-lg transition-all text-xs sm:text-sm"
              >
                Haan / تصدیق کریں
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-red-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5 relative">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 border-2 border-emerald-600 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-md animate-bounce">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Order Confirmed!
              </h3>
              <h4 className="text-xl sm:text-3xl font-bold text-red-900" style={nastaliqStyle} dir="rtl">
                آرڈر کرنے کا شکریہ!
              </h4>
            </div>

            <div className="space-y-3 bg-[#FAF7EE] p-4 rounded-2xl border border-amber-200 text-xs sm:text-sm text-slate-700">
              <p className="font-semibold">
                Thank you for ordering from <strong className="text-red-900">AM Unani &amp; Herbal Labs</strong>. Your order will be delivered within <strong className="text-emerald-700">2 to 3 working days</strong> across Pakistan via Cash on Delivery.
              </p>
              <p className="pt-2 border-t border-amber-200 text-right font-bold text-sm sm:text-base" style={nastaliqStyle} dir="rtl">
                اے ایم دواخانہ سے آرڈر کرنے کا شکریہ۔ آپ کا آرڈر <strong className="text-red-900">2 سے 3 کام کے دنوں میں</strong> کیش آن ڈیلیوری کے ذریعے آپ تک پہنچا دیا جائے گا۔
              </p>

              <div className="pt-3 border-t border-amber-200 text-center space-y-2.5">
                <p className="text-xs text-slate-600 font-bold">
                  Agar mazeed maloomat darkaar hain toh WhatsApp par rabta karein:
                </p>
                <a
                  href="https://wa.me/923150894064?text=Salam,%20maine%20order%20place%20kiya%20hai%2C%20mazeed%20maloomat%20chahiye."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm w-full transition-all shadow-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Chat on WhatsApp / واٹس ایپ پر بات کریں</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-3 rounded-xl shadow-lg transition-all"
            >
              Close / بند کریں
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
