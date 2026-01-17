import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
  Trash2, ShoppingBag, ArrowRight, Minus, Plus,
  ShieldCheck, Truck, Edit3, ShoppingCart, CreditCard, AlertCircle
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

  const handleEditBudget = async () => {
    const { value: newBudget } = await Swal.fire({
      title: "Update Monthly Budget",
      input: "number",
      inputLabel: "Set your monthly spending limit",
      inputValue: cartData.monthlyBudget,
      confirmButtonText: "Update",
      confirmButtonColor: "#10b981",
      showCancelButton: true,
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-6 py-2',
        cancelButton: 'rounded-xl px-6 py-2'
      }
    });

    if (newBudget) updateBudget(newBudget);
  };

  const handleRemoveItem = async (productId) => {
    const result = await Swal.fire({
      title: "Remove Item?",
      text: "This item will be removed from your selection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#f43f5e",
      cancelButtonColor: "#94a3b8",
      background: '#ffffff',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) removeFromCart(productId);
  };

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <div className="w-64 h-64 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
            <ShoppingBag size={80} className="text-emerald-500 relative z-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Your bag is empty</h2>
          <p className="text-slate-500 mb-8 max-w-sm text-center">Give it some love and add some items that make you happy!</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl hover:-translate-y-1">
            Explore Collection <ArrowRight size={20} />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-end">
          <div className="lg:col-span-2">
            <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-2 block">Premium Checkout</span>
            <h1 className="text-5xl font-black text-slate-900 mb-4">
              Your <span className="text-emerald-500 underline decoration-emerald-200 decoration-8 underline-offset-4">Bag.</span>
            </h1>
            <p className="text-slate-500 font-medium">You have {cartData.items.length} items in your selection.</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Budget Health</h4>
              <button onClick={handleEditBudget} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-500 transition-colors">
                <Edit3 size={16} />
              </button>
            </div>
            <BudgetTracker spent={cartData.spent} limit={cartData.monthlyBudget} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Items List */}
          <div className="lg:w-2/3 space-y-6">
            {cartData.items.map(item => (
              <div key={item.productId} className="group relative bg-white border border-slate-100 p-4 sm:p-6 rounded-[2.5rem] flex flex-col sm:flex-row gap-8 items-center transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:border-emerald-100">
                {/* Image Wrap */}
                <div className="w-full sm:w-44 h-44 bg-slate-50 rounded-[2rem] overflow-hidden p-6 flex items-center justify-center relative group-hover:bg-white transition-colors">
                  <img 
                    src={item.imageURL || item.image} 
                    alt={item.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>

                {/* Content Wrap */}
                <div className="flex-1 w-full flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                      <span className="text-slate-400 text-sm font-medium">SKU: {item.productId.slice(-6).toUpperCase()}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.productId)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</p>
                      <div className="flex items-center bg-slate-900 rounded-2xl p-1 shadow-inner">
                        <button
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-emerald-400 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-white text-lg">{item.quantity}</span>
                        <button
                          className="w-10 h-10 flex items-center justify-center text-white hover:text-emerald-400"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-400 text-sm font-medium mb-1">Price per unit: ₹{item.price.toLocaleString()}</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tight">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <aside className="lg:w-1/3">
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 lg:sticky lg:top-28 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <CreditCard className="text-emerald-500" /> Summary
              </h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{cartData.spent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-bold italic">Calculated at next step</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Tax (GST)</span>
                  <span className="text-slate-900">Inclusive</span>
                </div>
                
                <div className="h-px bg-slate-100 my-6"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">Grand Total</span>
                  <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                    ₹{cartData.spent?.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link to="/checkout" state={{ total: cartData.spent }}>
                <button className="group w-full bg-slate-900 text-white py-5 rounded-[2rem] font-bold text-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-200/40 active:scale-95">
                  Confirm Order
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl text-center">
                  <Truck size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl text-center">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Secure Pay</span>
                </div>
              </div>

              {cartData.spent > cartData.monthlyBudget && (
                <div className="mt-8 bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-start gap-4">
                  <AlertCircle className="text-rose-500 shrink-0" size={20} />
                  <div>
                    <p className="text-rose-600 font-bold text-sm">Budget Overrun!</p>
                    <p className="text-rose-400 text-xs mt-1">You are ₹{(cartData.spent - cartData.monthlyBudget).toLocaleString()} over your limit.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;