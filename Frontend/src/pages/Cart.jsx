import React, { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
  Trash2, ShoppingBag, ArrowRight, Minus, Plus,
  ShieldCheck, Truck, Edit2, ShoppingCart, CreditCard, Info
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
      inputLabel: "Plan your expenses better",
      inputValue: cartData.monthlyBudget,
      showCancelButton: true,
      confirmButtonColor: "#10b981",
    });

    if (newBudget) {
      updateBudget(newBudget);
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await Swal.fire({
      title: "Remove from cart?",
      text: "You can always add it back later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Remove",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: '#ffffff',
      borderRadius: '20px'
    });

    if (result.isConfirmed) {
      removeFromCart(productId);
    }
  };

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="relative mb-8">
             <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
             <div className="relative w-32 h-32 bg-white shadow-2xl rounded-full flex items-center justify-center">
                <ShoppingBag className="text-emerald-500" size={48} />
             </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Your bag is empty.</h2>
          <p className="text-slate-500 mb-10 text-lg max-w-sm">Looks like you haven't discovered our latest arrivals yet.</p>
          <Link to="/" className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-emerald-200">
            Start Shopping <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <Navbar />

      {/* Main Content: pt-24 provides enough space for fixed navbar without pushing content too low */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        
        {/* HEADER SECTION - Reduced vertical padding and balanced layout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <ShoppingCart size={12} /> My Selection
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Shopping <span className="text-emerald-600">Bag.</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              Review your items and proceed to a secure checkout.
            </p>
          </div>

          {/* Budget Display - Compact for header alignment */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 min-w-[320px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Monthly Spending Goal</span>
              <button onClick={handleEditBudget} className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
                <Edit2 size={14} />
              </button>
            </div>
            <BudgetTracker spent={cartData.spent} limit={cartData.monthlyBudget} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* ITEMS LIST */}
          <div className="lg:w-2/3 w-full space-y-4">
            {cartData.items.map(item => (
              <div key={item.productId} className="group bg-white rounded-3xl p-5 border border-slate-100 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                {/* Product Image */}
                <div className="w-full sm:w-36 h-36 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                  <img 
                    src={item.imageURL || item.image} 
                    alt={item.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{item.name}</h3>
                      <button 
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-emerald-600 font-black text-2xl tracking-tight">₹{item.price.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 shadow-sm">
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-700">{item.quantity}</span>
                      <button
                        className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <div className="text-right">
                       <p className="text-[10px] uppercase text-slate-400 font-bold">Subtotal</p>
                       <p className="font-bold text-slate-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SIDEBAR */}
          <aside className="lg:w-1/3 w-full lg:sticky lg:top-24">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h2 className="text-xl font-black text-slate-900 mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">₹{cartData.spent?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Shipping Estimate</span>
                  <span className="text-emerald-600 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-slate-900 font-bold text-lg">Total Amount</div>
                  <div className="text-slate-900 font-black text-2xl">₹{cartData.spent?.toLocaleString()}</div>
                </div>
              </div>

              <Link to="/checkout" state={{ total: cartData.spent }}>
                <button className="group w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all duration-300 shadow-lg hover:shadow-emerald-200 flex items-center justify-center gap-3">
                  Checkout Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <div className="mt-8 flex flex-col gap-3">
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <Truck size={16} className="text-emerald-500" />
                    Express Delivery Included
                 </div>
                 <div className="flex items-center gap-3 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Verified Secure Checkout
                 </div>
              </div>

              {cartData.spent > cartData.monthlyBudget && (
                <div className="mt-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-[11px] font-bold flex items-center gap-2 animate-pulse">
                  <Info size={14} />
                  Budget limit exceeded by ₹{(cartData.spent - cartData.monthlyBudget).toLocaleString()}
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














