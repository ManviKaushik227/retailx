import React from 'react';
import { Wallet, AlertCircle } from 'lucide-react';

const BudgetTracker = ({ spent = 0, limit = 0, cartTotal = 0 }) => {
  // 1. Default limit agar 0 hai toh
  const displayLimit = limit > 0 ? limit : 2000; 
  const totalImpact = spent + cartTotal;
  
  // 2. Logic: Blue bar hamesha 'spent' dikhayega
  const spentWidth = (spent / displayLimit) * 100;
  
  // 3. Logic: Cart bar kitna lamba hoga
  // Agar spent + cart budget ke bahar hai, toh ye bar ko end tak stretch karega
  const cartWidth = (cartTotal / displayLimit) * 100;
  
  const isOverBudget = totalImpact > displayLimit;
  const remaining = displayLimit - totalImpact;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-2 w-full">
      {/* Header */}
      <div className={`p-3 flex items-center justify-between ${isOverBudget ? 'bg-red-50' : 'bg-blue-50'}`}>
        <div className="flex items-center gap-2">
          <Wallet className={isOverBudget ? 'text-red-600' : 'text-blue-600'} size={18} />
          <h3 className="font-bold text-slate-800 text-xs tracking-tight">Budget Tracker</h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
          isOverBudget ? 'bg-red-200 text-red-700' : 'bg-blue-200 text-blue-700'
        }`}>
          {isOverBudget ? 'Limit Exceeded' : 'On Track'}
        </span>
      </div>

      <div className="p-4">
        {/* Labels */}
        <div className="flex justify-between items-end mb-3">
          <div className="flex gap-4">
            <div>
              <p className="text-blue-500 text-[9px] uppercase font-black mb-1">Paid</p>
              <p className="text-sm font-bold text-slate-700 leading-none">₹{spent.toLocaleString()}</p>
            </div>
            {cartTotal > 0 && (
              <div className="border-l border-slate-200 pl-4">
                <p className={`${isOverBudget ? 'text-red-500' : 'text-emerald-500'} text-[9px] uppercase font-black mb-1`}>Cart</p>
                <p className={`text-sm font-bold leading-none ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
                  +₹{cartTotal.toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[9px] uppercase font-black mb-1">Limit</p>
            <p className="text-sm font-bold text-slate-900 leading-none">₹{displayLimit.toLocaleString()}</p>
          </div>
        </div>

        {/* --- DUAL COLOR BAR --- */}
        <div className="flex w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-4 shadow-inner">
          {/* 1. Blue Bar (Spent) */}
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out border-r border-white/20 shrink-0"
            style={{ width: `${Math.min(spentWidth, 100)}%` }}
          />
          
          {/* 2. Color Bar (Cart) - Iska width tabhi dikhega jab cart mein kuch ho */}
          <div 
            className={`h-full transition-all duration-700 ease-in-out shrink-0 ${
              isOverBudget ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(cartWidth, 100 - spentWidth)}%` }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Paid</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">In Cart</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {isOverBudget ? (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle size={12} />
                <p className="text-[10px] font-black uppercase italic">Over ₹{Math.abs(remaining).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-[10px] font-black text-emerald-600 uppercase italic">₹{remaining.toLocaleString()} Safe</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;