import Chatbot from "../Components/Chatbot";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SLIDES = [
  { id: 1, title: "FUTURE STYLE", desc: "AI-Curated Fashion for the 2026 Season.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" },
  { id: 2, title: "PRECISION TECH", desc: "Experience software that predicts your needs.", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000" },
  { id: 3, title: "MODERN HOME", desc: "Essentials for the modern sanctuary.", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" }
];

export default function RetailXHome() {
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- REPLACED THIS USEEFFECT FOR CATEGORY DIVERSITY ---
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:5000/api/products/");
      const allProducts = res.data;

      console.log("Data check:", allProducts[0]); // Console mein dekho 'id' aa raha hai ya '_id'

      if (allProducts && allProducts.length > 0) {
        const diverseSelection = [];
        const pickedIds = new Set();
        const foundCategories = new Set();

        allProducts.forEach(product => {
          // Backend kabhi 'id' bhejta hai kabhi '_id', hum dono check karenge
          const productId = product._id || product.id; 
          const cat = product.category ? product.category.toString().toLowerCase().trim() : "other";
          
          if (!foundCategories.has(cat) && diverseSelection.length < 8) {
            diverseSelection.push(product);
            foundCategories.add(cat);
            pickedIds.add(productId);
          }
        });

        if (diverseSelection.length < 8) {
          allProducts.forEach(product => {
            const productId = product._id || product.id;
            if (diverseSelection.length < 8 && !pickedIds.has(productId)) {
              diverseSelection.push(product);
              pickedIds.add(productId);
            }
          });
        }
        setProducts(diverseSelection);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, []);
  // Timer for Hero Slider (Keep this as is)
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ---------- 1. HERO SECTION ---------- */}
      <section className="relative h-screen w-full flex items-center overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0 w-full h-full">
            <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8 }} className="absolute inset-0 w-full h-full">
              <img src={SLIDES[index].img} className="w-full h-full object-cover" alt="Hero" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </motion.div>
            <div className="relative z-10 h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
              <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                <p className="text-emerald-400 font-black tracking-[0.5em] text-xs mb-6 uppercase">RetailX Intelligence</p>
                <h1 className="text-6xl md:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                  {SLIDES[index].title.split(" ")[0]} <br />
                  <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>{SLIDES[index].title.split(" ")[1]}</span>
                </h1>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ---------- 2. PRODUCT GRID ---------- */}
      <section id="product-grid" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-gray-100 pb-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 leading-none uppercase">
              Curated <br /> <span className="text-emerald-600">Categories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {loading ? (
              <div className="col-span-full flex flex-col items-center py-20 gap-4">
                 <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="font-mono text-slate-400 text-xs tracking-[0.3em] uppercase">Sorting by Category...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <motion.div 
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="relative overflow-hidden bg-[#F7F7F7] aspect-[3/4] rounded-sm flex items-center justify-center p-8">
                    <img 
                      src={product.imageURL || product.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000"} 
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-1000" 
                      alt={product.name}
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <button className="absolute bottom-6 right-6 bg-white text-black p-4 rounded-full shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="mt-6 space-y-1">
                    {/* ADDED CATEGORY LABEL HERE */}
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                      {product.category}
                    </p>
                    <h3 className="text-sm font-medium text-black truncate uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm font-light text-gray-900">
                      ₹{(product.finalPrice || product.price)?.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <ShoppingBag className="mx-auto text-gray-200" size={48} />
                <p className="text-gray-400 mt-4 uppercase tracking-widest">Vault is currently empty.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-32 bg-zinc-50 flex justify-center items-center px-6">
        <div className="text-center max-w-xl">
          <h2 className="text-3xl font-light tracking-[0.2em] text-zinc-900 mb-8 uppercase">Join RetailX</h2>
          <button 
            onClick={() => navigate("/auth")}
            className="group flex items-center gap-4 mx-auto px-10 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-emerald-800 transition-all duration-500 shadow-xl"
          >
            Create Account <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      <Chatbot />
      <Footer />
    </div>
  );
}