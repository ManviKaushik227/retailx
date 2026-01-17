import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, ChevronLeft, ChevronRight, Sparkles, 
  TrendingUp, Compass, Heart, ArrowRight, Scan, Plus, X, User, Flame
} from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const API_BASE = "http://127.0.0.1:5000";

const CustomerDashboard = () => {
  const [feedData, setFeedData] = useState({ mind_reader: [], signature_styles: [], discovery_radar: [] });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const navigate = useNavigate();

  const userName = localStorage.getItem("user_name") || "Guest";
  const userPrefs = JSON.parse(localStorage.getItem("user_preferences")) || [];
  const lastViewedId = localStorage.getItem("last_viewed_product_id");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [allRes, recRes] = await Promise.all([
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/recommendations/feed?prefs=${userPrefs.join(",")}${lastViewedId ? `&last_viewed=${lastViewedId}` : ""}`)
        ]);
        setAllProducts(allRes.data);
        setFeedData(recRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchDashboardData();
  }, []);

  const getImgUrl = (item) => {
    const path = item?.imageURL || item?.imageUrl || item?.image_url || item?.image;
    if (!path || path.includes("photo-1490481651871")) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop";
    }
    return path.startsWith("http") ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleProductClick = (product) => {
    localStorage.setItem("last_viewed_product_id", product.id || product._id);
    navigate(`/product/${product.id || product._id}`);
  };

  const nextHero = () => setHeroIdx((prev) => (prev + 1) % (feedData.mind_reader.length || 1));
  const prevHero = () => setHeroIdx((prev) => (prev - 1 + feedData.mind_reader.length) % (feedData.mind_reader.length || 1));

  if (loading) return <Loader name={userName} />;

  // ✅ FIXED TRENDING LOGIC: User ki preference waale products, warna fallback to all products
  const trendingItems = allProducts
    .filter(p => userPrefs.some(pref => p.category?.toLowerCase().includes(pref.toLowerCase())))
    .length > 0 
      ? allProducts.filter(p => userPrefs.some(pref => p.category?.toLowerCase().includes(pref.toLowerCase()))).slice(0, 8)
      : allProducts.slice(10, 18); // Fallback agar user prefs match na karein

  const budgetPicks = [...allProducts].sort((a, b) => a.finalPrice - b.finalPrice).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#1A1A1A] font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      <Navbar />

      <main>
        {/* --- SECTION 0: PERSONALIZED WELCOME VIBE --- */}
        <section className="pt-32 pb-20 px-6 md:px-20 bg-gradient-to-b from-emerald-50/50 to-transparent">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-600">Your Daily Curated Feed</span>
                </div>
                <h2 className="text-6xl md:text-8xl font-serif italic leading-none mb-6">
                    Namaste, <br/> {userName}
                </h2>
                <p className="max-w-xl text-slate-500 text-lg font-serif italic border-l-2 border-emerald-200 pl-6">
                    "We've analyzed your interest in {userPrefs.length > 0 ? userPrefs.join(" & ") : "Premium Lifestyle"}. Today's selection is focused on timeless aesthetics."
                </p>
            </motion.div>
        </section>

        {/* --- SECTION 1: THE AI HERO (Parker Pen / High Priority) --- */}
        <section className="h-[90vh] w-full relative overflow-hidden flex items-center bg-[#F4F4F1] rounded-[60px] mx-auto max-w-[98%] shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={heroIdx}
              initial={{ opacity: 0, scale: 1.1 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
            >
              <img src={getImgUrl(feedData.mind_reader[heroIdx])} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 px-6 md:px-20 w-full">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} className="max-w-3xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-600 mb-4 block">Neural Highlight</span>
              <h1 className="text-7xl md:text-9xl font-serif italic mb-10 leading-none text-slate-900">
                {feedData.mind_reader[heroIdx]?.name || "The Core Piece"}
              </h1>
              <button onClick={() => handleProductClick(feedData.mind_reader[heroIdx])} className="group flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-full hover:bg-emerald-600 transition-all shadow-2xl">
                Explore Piece <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </div>
          <div className="absolute bottom-12 right-12 z-20 flex gap-4">
            <button onClick={prevHero} className="p-5 bg-white/80 hover:bg-white text-slate-900 transition-all rounded-full shadow-lg border border-white">
              <ChevronLeft size={24} />
            </button>
            <button onClick={nextHero} className="p-5 bg-white/80 hover:bg-white text-slate-900 transition-all rounded-full shadow-lg border border-white">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>

        {/* --- SECTION 2: TRENDING FOR YOU (Fixed & Working) --- */}
        <section className="py-40 px-6 md:px-20">
            <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                        <Flame className="text-orange-500 fill-orange-500" size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold uppercase tracking-widest text-slate-800">Trending Now</h3>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Based on your category interests</p>
                    </div>
                </div>
                <div className="h-[1px] flex-grow mx-10 bg-slate-100 hidden md:block" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {trendingItems.map((p) => (
                    <motion.div 
                        key={p.id || p._id}
                        whileHover={{ y: -10 }}
                        onClick={() => handleProductClick(p)}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-slate-50 mb-6 border border-slate-100 shadow-sm transition-all group-hover:shadow-emerald-100 group-hover:shadow-2xl">
                            <img src={getImgUrl(p)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{p.category}</p>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                        <p className="text-sm font-serif italic text-emerald-600 font-bold">₹{p.finalPrice}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* --- SECTION 3: SIGNATURE STYLES (Dark Premium) --- */}
        <section className="py-40 px-6 md:px-20 bg-emerald-950 text-white rounded-[60px] mx-auto max-w-[98%] shadow-3xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end mb-32">
            <div className="md:col-span-5">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-emerald-400 mb-6 block">01 / Your Signature</span>
               <h3 className="text-5xl font-serif italic leading-tight">Your {userPrefs[0] || "Style"} Boutique.</h3>
            </div>
            <div className="md:col-span-7 h-[1px] bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-32 gap-x-12">
            {feedData.signature_styles.slice(0, 6).map((p, idx) => (
              <motion.div 
                key={p.id || p._id}
                className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
                onClick={() => handleProductClick(p)}
              >
                <div className="aspect-[2/3] overflow-hidden bg-white/5 mb-8 relative rounded-2xl">
                   <img src={getImgUrl(p)} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                   <div className="absolute top-6 left-6 text-emerald-400 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="text-[8px] font-bold uppercase tracking-widest tracking-[0.5em]">№ 00{idx + 1}</span>
                   </div>
                </div>
                <div className="flex justify-between items-baseline px-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-1 text-white">{p.name}</h4>
                    <p className="text-[10px] text-emerald-500 uppercase tracking-widest">{p.category}</p>
                  </div>
                  <p className="text-lg italic font-serif text-emerald-400 font-bold">₹{p.finalPrice}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- SECTION 4: DISCOVERY RADAR --- */}
        <section className="py-40 px-6 md:px-20 bg-white">
          <div className="flex justify-between items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-slate-900">Discovery Radar</h3>
              <p className="text-[10px] text-emerald-600 uppercase mt-2 font-bold tracking-widest">Selected by Neural Logic</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 cursor-pointer">Explore All</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {feedData.discovery_radar.map((p) => (
              <div key={p.id || p._id} className="group cursor-pointer" onClick={() => handleProductClick(p)}>
                <div className="aspect-square overflow-hidden mb-6 relative rounded-3xl bg-[#F8F8F5]">
                  <img src={getImgUrl(p)} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="text-center px-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">{p.category}</p>
                    <h5 className="text-[11px] font-bold uppercase mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors">{p.name}</h5>
                    <p className="text-sm font-serif italic text-emerald-700 font-bold">₹{p.finalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 5: BUDGET INTELLIGENCE --- */}
        <section className="py-32 px-6 md:px-20 bg-[#F8F8F5]">
           <div className="mb-16">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-900">Budget Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 italic font-serif">Maximum style at optimized price points.</p>
           </div>
           <div className="flex gap-10 overflow-x-auto pb-10 scrollbar-hide">
              {budgetPicks.map(p => (
                <div key={p.id || p._id} onClick={() => handleProductClick(p)} className="min-w-[280px] group cursor-pointer">
                  <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500 border border-slate-100">
                    <img src={getImgUrl(p)} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">{p.name}</h4>
                  <p className="text-xs font-serif italic text-emerald-600 mt-1">₹{p.finalPrice}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

const Loader = ({ name }) => (
  <div className="h-screen bg-[#FCFCF9] flex flex-col items-center justify-center text-center px-10">
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
      className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
    />
    <p className="text-[10px] font-bold uppercase tracking-[1em] text-slate-900 animate-pulse">Personalizing Your Boutique</p>
  </div>
);

export default CustomerDashboard;