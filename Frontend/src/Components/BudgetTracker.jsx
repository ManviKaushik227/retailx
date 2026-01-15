import React from 'react';
import { Wallet, AlertCircle, CheckCircle2, PiggyBank } from 'lucide-react';

const BudgetTracker = ({ spent = 0, limit = 0 }) => {
  // ✅ Calculation for progress bar
  // Agar limit 0 hai toh 2000 default maan ke chalenge jab tak data load na ho
  const displayLimit = limit > 0 ? limit : 2000; 
  const percentage = Math.min((spent / displayLimit) * 100, 100);
  const isOverBudget = spent > displayLimit;
  const remaining = displayLimit - spent;
  
  // ✅ Check agar limit sach mein 0 hai (pehli baar ke liye)
  const isBudgetSet = limit > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-2 w-full md:w-80">
      {/* Header Section */}
      <div className={`p-3 flex items-center justify-between ${!isBudgetSet ? 'bg-slate-50' : isOverBudget ? 'bg-red-50' : 'bg-emerald-50'}`}>
        <div className="flex items-center gap-2">
          <Wallet className={!isBudgetSet ? 'text-slate-400' : isOverBudget ? 'text-red-600' : 'text-emerald-600'} size={18} />
          <h3 className="font-bold text-slate-800 text-xs md:text-sm tracking-tight">Monthly Budget</h3>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          !isBudgetSet ? 'bg-slate-200 text-slate-500' : 
          isOverBudget ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'
        }`}>
          {!isBudgetSet ? 'Syncing...' : isOverBudget ? 'Exceeded' : 'On Track'}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold leading-none mb-1">Spent</p>
            <p className="text-xl font-black text-slate-900 leading-none">₹{spent.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold leading-none mb-1">Limit</p>
            <p className="text-sm font-bold text-slate-600 leading-none">₹{displayLimit.toLocaleString()}</p>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              !isBudgetSet ? 'bg-slate-300' : 
              isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Footer Info */}
        <div className="flex items-center gap-2 min-h-[20px]">
          {!isBudgetSet ? (
            <div className="flex items-center gap-1.5 text-slate-400">
              <PiggyBank size={14} />
              <p className="text-[11px] font-medium">Budget load ho raha hai...</p>
            </div>
          ) : isOverBudget ? (
            <div className="flex items-center gap-1.5 text-red-600">
              <AlertCircle size={14} />
              <p className="text-[11px] font-medium italic">₹{Math.abs(remaining).toLocaleString()} Your spending has gone beyond the set limit.</p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle2 size={14} />
              <p className="text-[11px] font-medium italic">₹{remaining.toLocaleString()} remaining in your budget.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;