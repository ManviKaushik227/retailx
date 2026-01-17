import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, ShoppingBag, ArrowRight, Minus, Plus,
  ShieldCheck, Truck, Edit3, CreditCard, AlertCircle, Sparkles
} from 'lucide-react';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import BudgetTracker from "../Components/BudgetTracker";
import Swal from "sweetalert2";

const Cart = () => {
  const { cartData, removeFromCart, updateQuantity, fetchCart, updateBudget } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!cartData) {
    return (
      <div className="h-screen bg-[#FCFCF9] flex flex-col items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full mb-8" />
        <p className="text-[10px] font-bold uppercase tracking-[1em] text-slate-900">Curating Your Selection</p>
      </div>
    );
  }

  const handleEditBudget = async () => {
    const { value: newBudget } = await Swal.fire({
      title: "Budget Intelligence",
      input: "number",
      inputLabel: "Set your monthly spending limit",
      inputValue: cartData?.monthlyBudget || 2000,
      confirmButtonText: "Save Limit",
      confirmButtonColor: "#10b981",
      showCancelButton: true,
      customClass: { popup: 'rounded-[30px] font-sans', confirmButton: 'rounded-full px-6 py-2' }
    });
    if (newBudget) updateBudget(newBudget);
  };

  const handleRemoveItem = async (productId) => {
    const result = await Swal.fire({
      title: "Remove Piece?",
      text: "This item will be removed from your curated bag.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#f43f5e",
      customClass: { popup: 'rounded-[30px]' }
    });
    if (result.isConfirmed) removeFromCart(productId);
  };

  if (!cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFCF9] flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-40 h-40 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={50} className="text-emerald-500" />
            </div>
            <h2 className="text-5xl font-serif italic mb-4 text-slate-900">Your Bag is Empty</h2>
            <Link to="/customer-dashboard" className="inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-2xl mt-6">
              Explore Collection <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#1A1A1A] font-sans selection:bg-emerald-100 overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-40 pb-20">
        
        {/* --- HEADER & BUDGET SECTION --- */}
        <section className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-200">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-600">Your Curated Selection</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic leading-none mb-4">
              The <span className="text-emerald-500">Bag.</span>
            </h1>
            <p className="text-slate-500 text-lg font-serif italic border-l-2 border-emerald-200 pl-6">
              "A selection of {cartData.items.length} pieces aligned with your style."
            </p>
          </motion.div>

          {/* Budget Tracker at the top side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-96 bg-white border border-slate-100 p-8 rounded-[40px] shadow-xl shadow-slate-200/40 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget Intelligence</span>
              <button onClick={handleEditBudget} className="p-2 hover:bg-emerald-50 rounded-full text-emerald-500 transition-all">
                <Edit3 size={14} />
              </button>
            </div>
            
            {cartData.monthlyBudget ? (
              <BudgetTracker spent={cartData.spent || 0} limit={cartData.monthlyBudget} />
            ) : (
              <button onClick={handleEditBudget} className="w-full py-3 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-emerald-100 transition-all">
                + Set Monthly Limit
              </button>
            )}

            {/* Subtle background decoration */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none">
              <CreditCard size={120} />
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- ITEMS LIST --- */}
          <div className="lg:col-span-8 space-y-12">
            <AnimatePresence>
              {cartData.items.map((item, idx) => (
                <motion.div 
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group flex flex-col md:flex-row gap-10 items-center border-b border-slate-100 pb-12"
                >
                  <div className="w-full md:w-56 aspect-square bg-[#F8F8F5] rounded-[40px] overflow-hidden p-8 group-hover:shadow-2xl transition-all duration-700">
                    <img 
                      src={item.imageURL || item.image} 
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between self-stretch py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Piece № {idx + 1}</p>
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.name}</h3>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-3 text-slate-300 hover:text-rose-500 transition-all bg-white rounded-full shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-8">
                      <div className="flex items-center bg-slate-900 rounded-full p-1 shadow-2xl">
                        <button
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-emerald-400 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                        <button
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-emerald-400"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                        <p className="text-3xl font-serif italic text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- SUMMARY PANEL --- */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-[50px] p-10 shadow-2xl shadow-slate-200/50 sticky top-40 border border-slate-50">
              <h2 className="text-2xl font-bold uppercase tracking-[0.2em] mb-10">Order Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-sans">₹{(cartData.spent || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-600">Complimentary</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-8" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-serif italic font-bold text-emerald-600">
                    ₹{(cartData.spent || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <Link to="/checkout" state={{ total: cartData.spent }}>
                <button className="group w-full bg-slate-900 text-white py-6 rounded-full font-bold text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl">
                  Process Order
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>

              {/* Secure Badges */}
              <div className="mt-10 flex justify-center gap-10 border-t border-slate-50 pt-8">
                <div className="flex flex-col items-center gap-2">
                  <Truck size={18} className="text-slate-300" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Express</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ShieldCheck size={18} className="text-slate-300" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Secure</span>
                </div>
              </div>

              {/* Alert for Budget Overrun */}
              {cartData.monthlyBudget && cartData.spent > cartData.monthlyBudget && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="mt-8 bg-rose-50 border border-rose-100 p-5 rounded-[25px] flex items-start gap-4"
                >
                  <AlertCircle className="text-rose-500 shrink-0" size={18} />
                  <div>
                    <p className="text-rose-600 font-bold text-xs uppercase tracking-wider">Budget Alert</p>
                    <p className="text-rose-400 text-[10px] mt-1">You are ₹{(cartData.spent - cartData.monthlyBudget).toLocaleString()} over limit.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}} />
    </div>
  );
};

export default Cart;