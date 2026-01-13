import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const CustomerDashboard = () => {
  // Buckets ke liye alag-alag states
  const [feedData, setFeedData] = useState({
    mind_reader: [],
    signature_styles: [],
    discovery_radar: []
  });
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // User Context
  const userPrefs = JSON.parse(localStorage.getItem("user_preferences")) || [];
  const lastViewedId = localStorage.getItem("last_viewed_product_id");
  const userName = localStorage.getItem("user_name") || "Shopper";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Backend API calls
        const [allRes, recRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/products"),
          axios.get(`http://127.0.0.1:5000/api/recommendations/feed?prefs=${userPrefs.join(",")}${lastViewedId ? `&last_viewed=${lastViewedId}` : ""}`)
        ]);

        setAllProducts(allRes.data);
        // Backend se aaya hua bucket data set karna
        setFeedData(recRes.data); 
        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleProductClick = (product) => {
    localStorage.setItem("last_viewed_product_id", product.id || product._id);
    navigate(`/product/${product.id || product._id}`);
  };

  if (loading) return <LoadingScreen name={userName} />;

  // Smart Sorting for Static Sections
  const budgetPicks = [...allProducts].sort((a, b) => a.finalPrice - b.finalPrice).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* --- DYNAMIC HERO --- */}
        <section className="relative pt-32 pb-20 px-6 md:px-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
          <div className="max-w-5xl">
            <span className="text-emerald-500 font-mono tracking-widest text-sm uppercase mb-4 block">Neural Engine Active</span>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              Curated for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {userName}
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              We've synced your DNA with our latest collection. Exploring <span className="text-white font-bold">{feedData.mind_reader[0]?.category || "Trending"}</span> today?
            </p>
          </div>
        </section>

        <div className="container mx-auto px-6 space-y-32 pb-32">
          
          {/* SECTION 1: MIND READER (Similarity Bucket) */}
          {feedData.mind_reader?.length > 0 && (
            <SectionWrapper title="The Mind Reader" subtitle="Deep-learning predictions based on your recent activity">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {feedData.mind_reader.slice(0, 4).map(p => (
                  <ProductCard key={p.id} product={p} badge="98% Match" isAI onClick={() => handleProductClick(p)} />
                ))}
              </div>
            </SectionWrapper>
          )}

          {/* SECTION 2: SIGNATURE STYLES (Preference Bucket) */}
          {feedData.signature_styles?.length > 0 && (
            <section className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 p-12 rounded-[50px] border border-slate-700/50 shadow-2xl backdrop-blur-sm">
              <SectionWrapper title="Your Signature Styles" subtitle={`Exclusive picks from ${userPrefs.join(", ")}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {feedData.signature_styles.slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} badge="Personalized" onClick={() => handleProductClick(p)} />
                  ))}
                </div>
              </SectionWrapper>
            </section>
          )}

          {/* SECTION 3: SYNERGY (Discovery Mix) */}
          <SectionWrapper title="Style Synergy" subtitle="Complementary items you might have missed">
            <div className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide">
              {feedData.discovery_radar?.slice(0, 6).map(p => (
                <div key={p.id} className="min-w-[300px]">
                  <ProductCard product={p} badge="Discover" onClick={() => handleProductClick(p)} />
                </div>
              ))}
            </div>
          </SectionWrapper>

          {/* SECTION 4: BUDGET INTELLIGENCE (Static Logic) */}
          <SectionWrapper title="Budget Intelligence" subtitle="High-rated luxury at optimized price points">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {budgetPicks.map(p => (
                <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} />
              ))}
            </div>
          </SectionWrapper>

          {/* SECTION 5: TRENDING RADAR */}
          <SectionWrapper title="The Discovery Radar" subtitle="What's trending in the RetailX ecosystem right now">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {feedData.discovery_radar?.slice(6, 16).map(p => (
                <ProductCard key={p.id} product={p} onClick={() => handleProductClick(p)} />
              ))}
            </div>
          </SectionWrapper>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// --- HELPER COMPONENTS (NO CHANGE NEEDED) ---

const SectionWrapper = ({ title, subtitle, children }) => (
  <div className="animate-in fade-in duration-1000">
    <div className="mb-10">
      <h2 className="text-3xl font-black text-white flex items-center gap-3">
        <span className="w-2 h-8 bg-emerald-500 rounded-full" /> {title}
      </h2>
      <p className="text-slate-500 mt-2 font-medium">{subtitle}</p>
    </div>
    {children}
  </div>
);

const ProductCard = ({ product, badge, isAI, onClick }) => (
  <div onClick={onClick} className="group cursor-pointer">
    <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-slate-800 border border-slate-700 transition-all duration-500 group-hover:border-emerald-500/50 group-hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)]">
      <img 
        src={product.imageURL || "https://via.placeholder.com/400x500"} 
        alt={product.name} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      {badge && (
        <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter z-10 ${isAI ? 'bg-cyan-500 text-black' : 'bg-emerald-500 text-black'}`}>
          {badge}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
    </div>
    <div className="mt-4 px-2">
      <h3 className="text-white font-bold truncate group-hover:text-emerald-400 transition-colors">{product.name}</h3>
      <div className="flex justify-between items-center mt-1">
        <span className="text-emerald-400 font-black text-lg">₹{product.finalPrice}</span>
        <span className="text-[10px] text-slate-600 font-bold uppercase">{product.category}</span>
      </div>
    </div>
  </div>
);

const LoadingScreen = ({ name }) => (
  <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
    <div className="w-20 h-20 relative">
      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
      <div className="absolute inset-0 border-t-4 border-emerald-500 rounded-full animate-spin" />
    </div>
    <p className="text-emerald-500 mt-8 font-mono tracking-[0.2em] uppercase animate-pulse text-center">
      Scanning Styles... <br/>
      <span className="text-slate-500 text-xs">Calibrating for {name}</span>
    </p>
  </div>
);

export default CustomerDashboard;