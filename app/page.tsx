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

  // 9:16 Video Carousel States
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  // Secondary Videos States (Video 1 & Video 2)
  const [isVideo1Playing, setIsVideo1Playing] = useState(false);
  const [isVideo2Playing, setIsVideo2Playing] = useState(false);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });
  const [recentOrder, setRecentOrder] = useState({ name: 'Ali Nawaz', city: 'Karachi', time: 'Just now' });
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
    lineHeight: '2.2',
  };

  // Auto pause videos when scrolled out of view
  useEffect(() => {
    const handleScroll = () => {
      videoRefs.forEach((ref, idx) => {
        if (ref.current && !ref.current.paused) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top < -200 || rect.bottom > window.innerHeight + 200) {
            ref.current.pause();
            if (idx === currentVideoIndex) setIsPlayingVideo(false);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentVideoIndex]);

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

  // Live Recent Order Toast Notification
  useEffect(() => {
    const buyers = [
      { name: 'Ali Nawaz', city: 'Karachi' },
      { name: 'Usman Malik', city: 'Islamabad' },
      { name: 'Tariq Khan', city: 'Lahore' },
      { name: 'Bilal Ahmed', city: 'Faisalabad' },
      { name: 'Kamran Akram', city: 'Rawalpindi' },
      { name: 'Zain Ul Abideen', city: 'Multan' },
      { name: 'Hamza Sheikh', city: 'Peshawar' },
      { name: 'Rehan Ali', city: 'Quetta' },
      { name: 'Fahad Mustafa', city: 'Sialkot' },
      { name: 'Danish Ali', city: 'Gujranwala' },
    ];

    const orderInterval = setInterval(() => {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      const randomMinutes = Math.floor(Math.random() * 4) + 1;
      setRecentOrder({
        name: randomBuyer.name,
        city: randomBuyer.city,
        time: `${randomMinutes} Minutes ago`,
      });
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 4500);
    }, 7000);

    return () => clearInterval(orderInterval);
  }, []);

  const images = ['/1.jpg', '/2.jpg', '/3.jpg', '/4.jpg', '/5.jpg', '/6.jpg', '/7.jpg', '/8.jpg', '/9.jpg'];
  const extraImages = ['/10.jpg', '/11.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);

    const extraTimer = setInterval(() => {
      setExtraImageIndex((prevIndex) => (prevIndex + 1) % extraImages.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(extraTimer);
    };
  }, [images.length, extraImages.length]);

  // 9:16 Slider Controls
  const handleNextVideo = () => {
    videoRefs.forEach((ref) => ref.current?.pause());
    setIsPlayingVideo(false);
    setCurrentVideoIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const handlePrevVideo = () => {
    videoRefs.forEach((ref) => ref.current?.pause());
    setIsPlayingVideo(false);
    setCurrentVideoIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const toggleCurrentVideo = () => {
    const currentRef = videoRefs[currentVideoIndex].current;
    if (currentRef) {
      if (currentRef.paused) {
        currentRef.play();
        setIsPlayingVideo(true);
      } else {
        currentRef.pause();
        setIsPlayingVideo(false);
      }
    }
  };

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

  // Step 1: Trigger Confirmation Modal on Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Step 2: Final Submission after clicking "YES" (Meta Purchase Event Added Here)
  const handleFinalOrderConfirm = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    // 1. Determine price based on selected quantity text
    const isTwoBottles = formData.quantity.includes('4,400');
    const orderValue = isTwoBottles ? 4400 : 2299;

    // 2. Trigger Meta Purchase Event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        currency: 'PKR',
        value: orderValue,
        content_name: 'AM Vitality Tablet',
        contents: [
          {
            id: isTwoBottles ? 'am_vitality_2x' : 'am_vitality_1x',
            quantity: isTwoBottles ? 2 : 1,
            item_price: orderValue,
          }
        ],
      });
    }

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    <div className="relative min-h-screen bg-gradient-to-b from-emerald-950 via-teal-950 to-stone-950 text-stone-100 font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black pb-28 sm:pb-0">
      
      {/* Hogwarts Ambient Luxury Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[380px] sm:w-[700px] h-[380px] sm:h-[700px] bg-emerald-600/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute top-[25%] right-[-10%] w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-amber-500/15 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[15%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-teal-700/20 rounded-full blur-[180px] animate-pulse"></div>
      </div>

      {/* Top Urgency Banner */}
      <div className="relative z-50 bg-gradient-to-r from-emerald-900 via-amber-600 to-emerald-900 text-white text-center py-2.5 px-2 sm:px-4 font-bold text-[11px] sm:text-sm shadow-2xl border-b border-amber-400/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded-full text-[9px] sm:text-xs tracking-wider animate-bounce shadow">
              DEAL
            </span>
            <span className="font-extrabold text-amber-200 text-[11px] sm:text-sm">50% OFF + Free Home Delivery</span>
          </div>
          
          <div className="flex items-center gap-1 bg-emerald-950/90 px-2.5 py-0.5 rounded-full text-amber-300 font-mono text-[11px] sm:text-sm border border-amber-400/50 shadow-inner">
            <span className="text-stone-200 font-sans font-bold text-[10px] sm:text-xs">Waqt Baqi:</span>
            <span className="font-bold text-white bg-emerald-800 px-1.5 py-0.5 rounded border border-amber-400/30">0{timeLeft.hours}</span>:
            <span className="font-bold text-white bg-emerald-800 px-1.5 py-0.5 rounded border border-amber-400/30">{timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}</span>:
            <span className="font-bold text-white bg-emerald-800 px-1.5 py-0.5 rounded border border-amber-400/30">{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}</span>
          </div>
        </div>
      </div>

      {/* Fully Responsive Header */}
      <header className="relative z-40 py-3 sm:py-4 px-3 sm:px-6 border-b border-amber-400/40 bg-emerald-950/95 backdrop-blur-md sticky top-0 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-2">
          
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 overflow-hidden rounded-full border-2 border-amber-400 bg-emerald-900 shadow-lg shadow-amber-500/20 shrink-0">
              <Image
                src="/logo.png"
                alt="AM Dawakhana Logo"
                fill
                sizes="(max-width: 640px) 40px, 56px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <div className="text-xs sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-200 tracking-wide leading-tight">
                AM Unani & Herbal Labs
              </div>
              <div className="text-sm sm:text-lg text-amber-200 font-extrabold mt-0.5" style={nastaliqStyle} dir="rtl">
                اے ایم دواخانہ
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/923150894064?text=Salam,%20mujhe%20AM%20Dawakhana%20ke%20bary%20mein%20puchna%20hai."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-sm transition-all flex items-center gap-1.5 shadow-md border border-emerald-400/50"
              title="WhatsApp Chat"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span className="hidden xs:inline">WhatsApp</span>
            </a>

            <a
              href="#order-form"
              className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 text-stone-950 font-black px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[11px] sm:text-sm transition-all transform hover:scale-105 shadow-lg shadow-amber-500/30 tracking-wider uppercase border border-amber-300 shrink-0"
            >
              Order Karein
            </a>
          </div>

        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        
        {/* Main Hero Section */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center mb-12 sm:mb-16">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-900 via-teal-900 to-amber-950 border border-amber-400/60 text-amber-300 font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>100% Khalis Aur Mehfooz Nuskha</span>
              <span>•</span>
              <span style={nastaliqStyle} className="text-amber-200">20 ٹیبلٹس</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-amber-400/30 pb-5">
              <div className="text-left border-l-4 border-amber-400 pl-3.5 space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-wide drop-shadow-md">
                  Taqat Ka Khazana
                </h1>
                <p className="text-amber-300 font-black text-xs sm:text-sm tracking-wide">
                  Mardana Quwwat Ka Asli Hal
                </p>
              </div>

              <div className="text-right border-r-4 border-amber-400 pr-3.5 space-y-1" style={nastaliqStyle} dir="rtl">
                <h2 className="text-2xl sm:text-4xl font-black text-amber-200 drop-shadow-md">
                  طاقت کا خزانہ
                </h2>
                <p className="text-emerald-300 font-extrabold text-base sm:text-xl">
                  مردانہ قوت کا بااعتماد حل
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-gradient-to-br from-emerald-900/95 via-teal-900/90 to-stone-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/40 text-left shadow-2xl hover:border-amber-400 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-amber-300 font-black text-[10px] uppercase tracking-widest bg-amber-400/15 px-2.5 py-0.5 rounded border border-amber-400/30">
                    Product Overview
                  </span>
                  <span className="text-amber-400">✨</span>
                </div>
                <p className="text-stone-100 font-medium text-xs sm:text-sm leading-relaxed">
                  AM Vitality Tablet is a master blend of rare Himalayan herbs designed to deliver absolute vigor, peak stamina, and enduring performance.
                </p>
              </div>
              
              <div className="bg-gradient-to-bl from-emerald-900/95 via-teal-900/90 to-stone-900 p-4 sm:p-5 rounded-2xl border-2 border-amber-400/40 text-right shadow-2xl hover:border-amber-400 transition-all" style={nastaliqStyle} dir="rtl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-300">🌿</span>
                  <span className="text-amber-300 font-black text-xs bg-amber-400/15 px-2.5 py-0.5 rounded border border-amber-400/30">
                    پروڈکٹ کا تعارف
                  </span>
                </div>
                <p className="text-stone-50 text-base sm:text-lg font-bold">
                  اے ایم وائٹلٹی ٹیبلٹ نایاب دیسی جڑی بوٹیوں کا شاہکار مرکب ہے، جو دیتا ہے بھرپور طاقت اور دیرپا اسٹیمنا۔
                </p>
              </div>
            </div>

            {/* Q&A Section */}
            <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/60 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-teal-800/60">
                <div className="text-left space-y-1">
                  <div className="text-amber-300 font-black text-xs sm:text-sm flex items-center gap-1.5">
                    <span>⚡</span> Sawaal: Asar kab tak hota hai?
                  </div>
                  <p className="text-stone-200 text-xs font-semibold pl-5">
                    Jawab: Sirf 1 se 2 ghante mein mukammal josh mehsoos hota hai.
                  </p>
                </div>

                <div className="text-right space-y-1" style={nastaliqStyle} dir="rtl">
                  <div className="text-amber-300 font-black text-base sm:text-lg flex items-center justify-start gap-1.5">
                    <span>⚡</span> <span>سوال: اثر کب تک ہوتا ہے؟</span>
                  </div>
                  <p className="text-stone-50 text-sm sm:text-base font-bold pr-5">
                    جواب: صرف 1 سے 2 گھنٹے میں مکمل جوش محسوس ہوتا ہے۔
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left space-y-1">
                  <div className="text-amber-300 font-black text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🛡️</span> Sawaal: Koi nuqsaan hai?
                  </div>
                  <p className="text-stone-200 text-xs font-semibold pl-5">
                    Jawab: Bilkul nahi, 100% natural aur herbal nuskha hai.
                  </p>
                </div>

                <div className="text-right space-y-1" style={nastaliqStyle} dir="rtl">
                  <div className="text-amber-300 font-black text-base sm:text-lg flex items-center justify-start gap-1.5">
                    <span>🛡️</span> <span>سوال: کیا کوئی نقصان ہے؟</span>
                  </div>
                  <p className="text-stone-50 text-sm sm:text-base font-bold pr-5">
                    جواب: بالکل نہیں، 100% قدرتی اور دیسی نسخہ ہے۔
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-900/90 border border-amber-400/50 p-3 rounded-xl text-center shadow-lg">
                <div className="text-amber-300 font-extrabold text-xs sm:text-sm">20 Tablets</div>
                <div className="text-stone-200 text-xs mt-1 font-bold" style={nastaliqStyle}>20 ٹیبلٹس</div>
              </div>
              <div className="bg-emerald-900/90 border border-amber-400/50 p-3 rounded-xl text-center shadow-lg">
                <div className="text-emerald-300 font-extrabold text-xs sm:text-sm">100% Herbal</div>
                <div className="text-stone-200 text-xs mt-1 font-bold" style={nastaliqStyle}>بغیر نقصان</div>
              </div>
              <div className="bg-emerald-900/90 border border-amber-400/50 p-3 rounded-xl text-center shadow-lg">
                <div className="text-amber-300 font-extrabold text-xs sm:text-sm">Free Delivery</div>
                <div className="text-stone-200 text-xs mt-1 font-bold" style={nastaliqStyle}>مفت ڈلیوری</div>
              </div>
            </div>

          </div>

          {/* Right Column: Image Sliders */}
          <div className="flex flex-col gap-6 w-full">
            <div className="relative w-full bg-emerald-950/90 border-2 border-amber-400/60 rounded-2xl sm:rounded-3xl p-3.5 shadow-2xl group hover:border-amber-400 transition-all">
              <div className="relative w-full aspect-[4/3] max-h-[420px] overflow-hidden rounded-xl bg-emerald-900/50 flex items-center justify-center border border-teal-800 shadow-inner">
                <Image
                  src={images[currentImageIndex]}
                  alt={`AM Dawakhana Slide ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain p-2 transition-all duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              <div className="flex justify-center gap-1.5 mt-3.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-teal-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative w-full bg-emerald-950/90 border-2 border-amber-400/60 rounded-2xl sm:rounded-3xl p-3.5 shadow-2xl group hover:border-amber-400 transition-all">
              <div className="relative w-full aspect-[4/3] max-h-[380px] overflow-hidden rounded-xl bg-emerald-900/50 flex items-center justify-center border border-teal-800 shadow-inner">
                <Image
                  src={extraImages[extraImageIndex]}
                  alt={`AM Dawakhana Extra Slide ${extraImageIndex + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain p-2 transition-all duration-700 group-hover:scale-105"
                  priority
                />
              </div>

              <div className="flex justify-center gap-1.5 mt-3.5">
                {extraImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setExtraImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      extraImageIndex === idx ? 'w-6 bg-amber-400' : 'w-2 bg-teal-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* 🎬 9:16 OPTIMIZED PROMINENT SIZE VERTICAL VIDEO CAROUSEL WITH ARROWS */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/60 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-center">
            
            <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              Featured Video Presentation
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Product Results & Demonstration
            </h3>
            <p className="text-stone-300 text-sm mt-1 mb-6 font-bold" style={nastaliqStyle}>
              اگلی یا پچھلی ویڈیو دیکھنے کے لیے سائیڈ والے تیر (Arrows) پر کلک کریں
            </p>

            <div className="max-w-[280px] sm:max-w-[320px] mx-auto relative px-6">
              <div className="relative w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl flex items-center justify-center">
                
                {/* Video 1 */}
                <video
                  ref={videoRefs[0]}
                  controls
                  preload="metadata"
                  playsInline
                  poster="/1.jpg"
                  onPlay={() => setIsPlayingVideo(true)}
                  onPause={() => setIsPlayingVideo(false)}
                  className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-500 ${currentVideoIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <source src="/video3.mp4" type="video/mp4" />
                  Aap ka browser video support nahi karta.
                </video>

                {/* Video 2 */}
                <video
                  ref={videoRefs[1]}
                  controls
                  preload="metadata"
                  playsInline
                  poster="/1.jpg"
                  onPlay={() => setIsPlayingVideo(true)}
                  onPause={() => setIsPlayingVideo(false)}
                  className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-500 ${currentVideoIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <source src="/video4.mp4" type="video/mp4" />
                  Aap ka browser video support nahi karta.
                </video>

                {/* Video 3 */}
                <video
                  ref={videoRefs[2]}
                  controls
                  preload="metadata"
                  playsInline
                  poster="/2.jpg"
                  onPlay={() => setIsPlayingVideo(true)}
                  onPause={() => setIsPlayingVideo(false)}
                  className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-500 ${currentVideoIndex === 2 ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                >
                  <source src="/video5.mp4" type="video/mp4" />
                  Aap ka browser video support nahi karta.
                </video>

                {!isPlayingVideo && (
                  <div 
                    onClick={toggleCurrentVideo}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 cursor-pointer group hover:bg-black/20 transition-all"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white transform group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 fill-stone-950 ml-1" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); handlePrevVideo(); }}
                className="absolute left-[-2px] top-1/2 -translate-y-1/2 z-30 bg-emerald-900/95 hover:bg-amber-500 hover:text-stone-950 text-amber-300 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 shadow-2xl flex items-center justify-center text-lg font-black transition-all"
                title="Pichli Video"
              >
                ❮
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleNextVideo(); }}
                className="absolute right-[-2px] top-1/2 -translate-y-1/2 z-30 bg-emerald-900/95 hover:bg-amber-500 hover:text-stone-950 text-amber-300 w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-400 shadow-2xl flex items-center justify-center text-lg font-black transition-all"
                title="Agli Video"
              >
                ❯
              </button>

              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      videoRefs.forEach((ref) => ref.current?.pause());
                      setIsPlayingVideo(false);
                      setCurrentVideoIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentVideoIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-teal-800'
                    }`}
                  />
                ))}
              </div>

              <p className="text-amber-300 font-bold text-xs sm:text-sm mt-2">
                Video {currentVideoIndex + 1} of 3 (Official Result)
              </p>
            </div>
          </div>
        </section>

        {/* SECONDARY VIDEOS SECTION */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-center">
            <span className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest inline-block mb-2">
              Extra Demonstration
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Product Videos
            </h3>
            <p className="text-stone-300 text-sm mt-1 mb-6 font-bold" style={nastaliqStyle}>
              مزید ویڈیوز اور کسٹمرز کے تجربات ملاحظہ کریں
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-emerald-900/40 border border-teal-700 p-3.5 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-amber-400/40 group flex items-center justify-center">
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
                      <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
                        <svg className="w-7 h-7 fill-stone-950 ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-amber-300 font-extrabold text-sm sm:text-base mt-3">
                  Official Introduction & Results
                </p>
              </div>

              <div className="bg-emerald-900/40 border border-teal-700 p-3.5 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative border border-amber-400/40 group flex items-center justify-center">
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
                      <div className="w-14 h-14 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl border-2 border-white">
                        <svg className="w-7 h-7 fill-stone-950 ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-amber-300 font-extrabold text-sm sm:text-base mt-3">
                  Unboxing & Customer Feedback
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 12 Key Ingredients Section */}
        <section className="mb-12 sm:mb-16">
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <span className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-widest">
                Khaas Unani Nuskha
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                Key Ingredients / <span style={nastaliqStyle} className="text-amber-300">نایاب دیسی اجزاء کی تفصیل</span>
              </h3>
              <p className="text-stone-200 text-xs sm:text-sm mt-1.5 font-semibold">
                Har tablet mein shamil 12 behtareen qudrati aur kamil ajza jo aap ko dein mukammal quwwat.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Zafran (زعفران)</div>
                <div className="text-stone-300 text-[11px] font-medium">Energy & Blood Circulation</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Salab Misri (ثعلب مصری)</div>
                <div className="text-stone-300 text-[11px] font-medium">Stamina & Muscle Strength</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Shilajit (شیلاجیت)</div>
                <div className="text-stone-300 text-[11px] font-medium">Pure Himalayan Mineral Tonic</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Akarkara (عقرقرحا)</div>
                <div className="text-stone-300 text-[11px] font-medium">Nerve Stimulation & Josh</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Kasturi (کستوری)</div>
                <div className="text-stone-300 text-[11px] font-medium">Maximum Strength Booster</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Jund Bedastar (جند بدستر)</div>
                <div className="text-stone-300 text-[11px] font-medium">Physical Power & Vigor</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Asgandh (اسگندھ ناگوری)</div>
                <div className="text-stone-300 text-[11px] font-medium">Stress Relief & Stamina</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Maghaz Chilgoza (مغز جلغوزہ)</div>
                <div className="text-stone-300 text-[11px] font-medium">Natural Body Warmth</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Tukhm E Rehan (تخم ریحان)</div>
                <div className="text-stone-300 text-[11px] font-medium">Cooling & Energy Balance</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Darchini (دارچینی)</div>
                <div className="text-stone-300 text-[11px] font-medium">Metabolism & Circulation</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Jaifal & Javitri (جائفل و جوتری)</div>
                <div className="text-stone-300 text-[11px] font-medium">Vitality & Performance</div>
              </div>
              <div className="bg-emerald-950/80 border border-amber-400/30 p-4 rounded-xl text-center space-y-1 hover:border-amber-400 transition-all shadow-md">
                <div className="text-amber-300 font-extrabold text-sm sm:text-base">Kushta Tilla (کشتہ طلا)</div>
                <div className="text-stone-300 text-[11px] font-medium">Ultimate Strength Formula</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Grid */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-3xl font-black text-white">
              Why Choose AM Dawakhana?
            </h3>
            <p className="text-amber-300 text-base sm:text-xl mt-1 font-bold" style={nastaliqStyle} dir="rtl">
              اے ایم دواخانہ ہی کیوں منتخب کریں؟
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-950/70 border border-teal-800 p-4.5 rounded-2xl text-center space-y-2 hover:border-amber-400 transition-all shadow-lg">
              <div className="text-3xl">🌿</div>
              <div className="text-amber-300 font-extrabold text-sm sm:text-base">100% Organic</div>
              <p className="text-stone-200 text-xs font-medium">Pure Herbal Formula</p>
            </div>
            <div className="bg-emerald-950/70 border border-teal-800 p-4.5 rounded-2xl text-center space-y-2 hover:border-amber-400 transition-all shadow-lg">
              <div className="text-3xl">⚡</div>
              <div className="text-amber-300 font-extrabold text-sm sm:text-base">Fast Action</div>
              <p className="text-stone-200 text-xs font-medium">Asar 1-2 Ghante Mein</p>
            </div>
            <div className="bg-emerald-950/70 border border-teal-800 p-4.5 rounded-2xl text-center space-y-2 hover:border-amber-400 transition-all shadow-lg">
              <div className="text-3xl">📦</div>
              <div className="text-amber-300 font-extrabold text-sm sm:text-base">Discreet Packing</div>
              <p className="text-stone-200 text-xs font-medium">Full Raazdaari Ke Saath</p>
            </div>
            <div className="bg-emerald-950/70 border border-teal-800 p-4.5 rounded-2xl text-center space-y-2 hover:border-amber-400 transition-all shadow-lg">
              <div className="text-3xl">🚚</div>
              <div className="text-amber-300 font-extrabold text-sm sm:text-base">Free Delivery</div>
              <div className="text-stone-200 text-xs font-medium">Cash On Delivery</div>
            </div>
          </div>
        </section>

        {/* Pricing Packages Box */}
        <section className="bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/60 text-stone-100 rounded-2xl sm:rounded-3xl p-5 sm:p-10 mb-12 sm:mb-16 text-center relative overflow-hidden shadow-2xl">
          <div className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs px-4 py-1.5 rounded-full mb-3 shadow-lg uppercase tracking-wider animate-pulse">
            Khaas Riayat Offer
          </div>

          <h2 className="text-2xl sm:text-4xl font-black mb-2 text-white">
            AM Dawakhana Price Packages
          </h2>
          <p className="text-amber-300 text-base sm:text-xl mb-6 font-bold" style={nastaliqStyle} dir="rtl">
            قیمت کی تفصیلات - پورے پاکستان میں مفت ہوم ڈیلیوری
          </p>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="bg-emerald-900/90 border border-teal-800 p-5 sm:p-6 rounded-2xl text-center shadow-lg">
              <div className="text-stone-100 font-extrabold text-sm sm:text-base">1 Bottle (20 Tablets)</div>
              <div className="text-amber-300 text-sm sm:text-lg font-bold mt-0.5" style={nastaliqStyle} dir="rtl">ایک بوتل (20 ٹیبلٹس)</div>
              <div className="text-amber-400 text-3xl sm:text-4xl font-black my-2.5">Rs. 2,299</div>
              <div className="text-[11px] sm:text-xs text-stone-200 font-semibold">Free Delivery Included</div>
            </div>

            <div className="bg-gradient-to-br from-teal-900 to-emerald-950 border-2 border-amber-400 p-5 sm:p-6 rounded-2xl text-center shadow-2xl relative">
              <div className="absolute -top-3.5 right-3 sm:right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[10px] sm:text-xs px-3.5 py-1 rounded-full shadow-lg">
                Bachat Offer
              </div>
              <div className="text-amber-200 font-extrabold text-sm sm:text-base">2 Bottles (40 Tablets)</div>
              <div className="text-amber-300 text-sm sm:text-lg font-bold mt-0.5" style={nastaliqStyle} dir="rtl">دو بوتلیں (40 ٹیبلٹس - مکمل کورس)</div>
              <div className="text-amber-400 text-3xl sm:text-4xl font-black my-2.5">Rs. 4,400</div>
              <div className="text-[11px] sm:text-xs text-amber-200 font-bold">Special Discount + Free Delivery</div>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="mb-12 sm:mb-16">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-2xl font-black text-amber-400 uppercase tracking-wider">
              Customer Reviews & Ratings / کسٹمرز کی رائے
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 font-semibold">100% Mutmaeen Sarfeen Across Pakistan (4.9 / 5.0 Star Rating)</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-emerald-950/80 border border-teal-800 p-5 rounded-2xl space-y-2.5 shadow-md">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed">"Bohot zabardast result hai. 1 se 2 ghante mein asar mehsoos hua. Highly recommended!"</p>
              <div className="text-[11px] text-amber-300 font-bold">— Tariq Khan (Lahore)</div>
            </div>
            <div className="bg-emerald-950/80 border border-teal-800 p-5 rounded-2xl space-y-2.5 text-right shadow-md" style={nastaliqStyle} dir="rtl">
              <div className="flex justify-end text-amber-400 text-sm">★★★★★</div>
              <p className="text-sm sm:text-base text-stone-100 font-bold">"اے ایم دواخانہ کی پروڈکٹ نے مایوس نہیں کیا۔ بہت ہی شاندار اور قدرتی رزلٹ ہے۔"</p>
              <div className="text-xs text-amber-300 font-bold">— محمد عثمان (کراچی)</div>
            </div>
            <div className="bg-emerald-950/80 border border-teal-800 p-5 rounded-2xl space-y-2.5 shadow-md">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs sm:text-sm text-stone-100 font-medium leading-relaxed">"Zero nuqsaan hai. Delivery bhi bohot fast aur secret packing mein mili."</p>
              <div className="text-[11px] text-amber-300 font-bold">— Kamran Ahmed (Rawalpindi)</div>
            </div>
          </div>
        </section>

        {/* Order Form Section */}
        <section id="order-form" className="max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400/60 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl relative">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-3xl font-black text-white">
                Order Form / <span style={nastaliqStyle} className="text-amber-300">آرڈر فارم</span>
              </h2>
              <p className="text-stone-200 text-sm sm:text-lg mt-2 font-bold" style={nastaliqStyle} dir="rtl">
                اپنی تفصیلات درج کریں، ہم آپ سے تصدیق کے لیے رابطہ کریں گے۔
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-stone-200 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Full Name</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-amber-300 text-sm">پورا نام *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apna poora naam likhein / اپنا نام لکھیں"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-emerald-900/60 border border-teal-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-stone-200 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Mobile / WhatsApp Number</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-amber-300 text-sm">موبائل نمبر *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="03XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-emerald-900/60 border border-teal-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-stone-200 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Complete Address & City</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-amber-300 text-sm">مکمل پتہ اور شہر کا نام *</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="House/Shop No, Street, Area, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-emerald-900/60 border border-teal-700 rounded-xl px-4 py-3.5 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
                ></textarea>
              </div>

              {/* HIGHLY STYLISH CUSTOM DROPDOWN */}
              <div>
                <label className="block text-stone-200 font-extrabold text-xs sm:text-base mb-1.5 flex justify-between items-center">
                  <span>Select Deal / Package</span>
                  <span style={nastaliqStyle} dir="rtl" className="text-amber-300 text-sm">پیکج منتخب کریں *</span>
                </label>

                <div className="relative">
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 border-2 border-amber-400/80 rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-amber-200 font-black cursor-pointer flex justify-between items-center shadow-xl hover:border-amber-400 transition-all"
                  >
                    <span className="truncate pr-2">{formData.quantity}</span>
                    <span className={`text-amber-400 transform transition-transform duration-300 text-lg ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                      ▼
                    </span>
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-emerald-950 border-2 border-amber-400 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-fadeIn">
                      <div 
                        onClick={() => {
                          setFormData({ ...formData, quantity: '1 Bottle (20 Tablets) - Rs. 2,299' });
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3.5 text-xs sm:text-sm text-stone-100 font-bold hover:bg-amber-500 hover:text-stone-950 cursor-pointer border-b border-teal-900 transition-all flex items-center justify-between"
                      >
                        <span>1 Bottle (20 Tablets) - Rs. 2,299</span>
                        <span className="text-[10px] bg-emerald-900 px-2 py-0.5 rounded text-amber-300 font-mono">Free Delivery</span>
                      </div>

                      <div 
                        onClick={() => {
                          setFormData({ ...formData, quantity: '2 Bottles (40 Tablets) - Rs. 4,400' });
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-3.5 text-xs sm:text-sm text-amber-300 font-black hover:bg-amber-500 hover:text-stone-950 cursor-pointer transition-all flex items-center justify-between"
                      >
                        <span>2 Bottles (40 Tablets) - Rs. 4,400</span>
                        <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded font-extrabold">Bachat Offer</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-stone-950 font-black text-sm sm:text-lg py-4 rounded-xl shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 uppercase tracking-wider border border-amber-300"
              >
                {loading ? 'Submitting...' : 'CONFIRM ORDER NOW / آرڈر کی تصدیق کریں'}
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* 🔔 LIVE RECENT ORDER TOAST POPUP */}
      {showToast && (
        <div className="fixed bottom-24 sm:bottom-6 left-4 z-50 bg-gradient-to-r from-emerald-900 to-teal-950 border-2 border-amber-400 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transition-all duration-500 max-w-xs animate-pulse">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 font-black flex items-center justify-center shrink-0 shadow">
            📦
          </div>
          <div>
            <p className="text-xs font-bold text-amber-300">Naya Order Moosool Hua!</p>
            <p className="text-xs text-stone-100 font-semibold">
              <strong className="text-white">{recentOrder.name}</strong> ne <span className="text-amber-200">{recentOrder.city}</span> se order kiya.
            </p>
            <span className="text-[10px] text-emerald-300">{recentOrder.time}</span>
          </div>
        </div>
      )}

      {/* Floating WhatsApp Chat Button with Slightly Larger Logo */}
      <a
        href="https://wa.me/923150894064?text=Salam,%20mujhe%20AM%20Dawakhana%20ke%20bary%20mein%20puchna%20hai."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-4 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 border-2 border-amber-400/80 shadow-emerald-500/30"
        title="Chat on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.124-.669-1.612-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/* Mobile Sticky Footer Button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-emerald-950/95 border-t border-amber-400/50 backdrop-blur-md">
        <a
          href="#order-form"
          className="block text-center w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-stone-950 font-black py-3 rounded-xl shadow-lg text-sm tracking-wider uppercase border border-amber-300"
        >
          ⚡ ORDER NOW (CASH ON DELIVERY)
        </a>
      </div>

      {/* Luxury Footer */}
      <footer className="relative z-10 border-t-2 border-amber-400/40 bg-gradient-to-b from-emerald-950 via-teal-950 to-black pt-12 pb-16 sm:pb-8 text-stone-300 mt-16 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border border-amber-400 overflow-hidden bg-emerald-900">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1" />
              </div>
              <h4 className="font-black text-white text-lg sm:text-xl">AM Unani & Herbal Labs</h4>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-semibold">
              Pakistan ka bharpoor aur qabil-e-itminan idara jo faraham karta hai 100% khalis aur behtareen herbal nuskha-jat.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h5 className="font-black text-amber-300 text-sm uppercase tracking-wider">Quality Assurance</h5>
            <ul className="space-y-2 text-xs font-semibold text-stone-200">
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> 100% Pure Himalayan Herbs</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Zero Chemical Side Effects</li>
              <li className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Free Discreet Delivery Across Pakistan</li>
            </ul>
          </div>

          <div className="space-y-3 text-right" style={nastaliqStyle} dir="rtl">
            <h5 className="font-black text-amber-300 text-xl">اے ایم دواخانہ</h5>
            <p className="text-sm text-stone-200 font-bold">
              اعتماد، صحت اور قدرت کا بہترین امتزاج۔ 100٪ دیسی اور محفوظ نسخہ جات۔
            </p>
            <div className="pt-2">
              <span className="inline-block bg-emerald-900/80 border border-amber-400/40 text-amber-300 text-xs px-3 py-1 rounded-lg font-mono">
                📞 Help Desk: Cash on Delivery Available
              </span>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-teal-800/60 text-center flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-400 font-semibold">
          <p>© 2026 AM Unani & Herbal Labs. All Rights Reserved.</p>
          <p className="text-amber-400">Pure Herbal Mastery</p>
        </div>
      </footer>

      {/* ❓ STEP 1: ORDER CONFIRMATION MODAL (Haan / Nahi) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-6 relative">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-500/20 border-2 border-amber-400 text-amber-400 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-lg">
              🛒
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Confirm Your Order?
              </h3>
              <h4 className="text-lg sm:text-2xl font-bold text-amber-300" style={nastaliqStyle} dir="rtl">
                کیا آپ آرڈر کی تصدیق کرنا چاہتے ہیں؟
              </h4>
            </div>

            <div className="bg-emerald-900/60 p-4 rounded-2xl border border-teal-700 text-xs sm:text-sm text-stone-200 text-left space-y-2">
              <p><strong className="text-amber-300">Naam:</strong> {formData.name}</p>
              <p><strong className="text-amber-300">Number:</strong> {formData.phone}</p>
              <p><strong className="text-amber-300">Package:</strong> {formData.quantity}</p>
              <p><strong className="text-amber-300">Address:</strong> {formData.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-extrabold py-3 rounded-xl border border-stone-600 transition-all text-xs sm:text-sm"
              >
                Nahi / بند کریں
              </button>

              <button
                type="button"
                onClick={handleFinalOrderConfirm}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-stone-950 font-black py-3 rounded-xl shadow-lg border border-amber-300 transition-all text-xs sm:text-sm"
              >
                Haan / تصدیق کریں
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🎉 STEP 2: ORDER SUCCESS POPUP (Shukriya / Complete) */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-gradient-to-b from-emerald-950 via-teal-950 to-stone-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-5 relative">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 border-2 border-amber-400 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl sm:text-4xl shadow-lg animate-bounce">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Order Confirmed!
              </h3>
              <h4 className="text-xl sm:text-3xl font-bold text-amber-300" style={nastaliqStyle} dir="rtl">
                آرڈر کرنے کا شکریہ!
              </h4>
            </div>

            <div className="space-y-3 bg-emerald-900/60 p-4 rounded-2xl border border-teal-700 text-xs sm:text-sm text-stone-200">
              <p className="font-semibold">
                Thank you for ordering from <strong className="text-amber-300">AM Unani & Herbal Labs</strong>. Your order will be delivered within <strong className="text-emerald-300">2 to 3 working days</strong> across Pakistan via Cash on Delivery.
              </p>
              <p className="pt-2 border-t border-teal-800 text-right font-bold text-sm sm:text-base" style={nastaliqStyle} dir="rtl">
                اے ایم دواخانہ سے آرڈر کرنے کا شکریہ۔ آپ کا آرڈر <strong className="text-amber-300">2 سے 3 کام کے دنوں میں</strong> کیش آن ڈیلیوری کے ذریعے آپ تک پہنچا دیا جائے گا۔
              </p>

              <div className="pt-3 border-t border-teal-800 text-center space-y-2.5">
                <p className="text-xs text-stone-200 font-bold">
                  Agar mazeed maloomat darkaar hain toh WhatsApp par rabta karein:
                </p>
                <a
                  href="https://wa.me/923150894064?text=Salam,%20maine%20order%20place%20kiya%20hai%2C%20mazeed%20maloomat%20chahiye."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 px-4 rounded-xl text-xs sm:text-sm w-full transition-all shadow-lg border border-emerald-400/40"
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
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-stone-950 font-black py-3 rounded-xl shadow-lg transition-all"
            >
              Close / بند کریں
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
