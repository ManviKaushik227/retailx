import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, ShoppingCart, User, Plus, Trash2, Edit, 
  Bell, Search, Filter, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Box, DollarSign, Clock, ChevronRight, Settings, LogOut, 
  Layers, Zap, MoreHorizontal, Download, Calendar, Command, 
  Eye, Star, MapPin, Mail, Phone, CheckCircle2 ,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // --- CONTENT RENDERING LOGIC ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewView />;
      case 'Inventory':
        return <InventoryView />;
      case 'Orders':
        return <OrdersView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Profile':
        return <ProfileView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col sticky top-0 h-screen z-20">
        <div className="px-7 py-10 flex items-center gap-3">
          <div className="h-9 w-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Command className="text-white h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 uppercase tracking-widest">RetailX</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={Box} label="Inventory" active={activeTab === 'Inventory'} onClick={() => setActiveTab('Inventory')} />
          <NavItem icon={ShoppingCart} label="Orders" active={activeTab === 'Orders'} onClick={() => setActiveTab('Orders')} />
          <NavItem icon={TrendingUp} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <NavItem icon={User} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
        
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
            <Search size={18} className="text-slate-400" />
            <input 
              placeholder={`Search in ${activeTab}...`}
              className="text-sm font-medium outline-none w-72 placeholder:text-slate-400 bg-transparent" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer">
              <Bell size={20} className="text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </div>
            <div 
              onClick={() => setActiveTab('Profile')}
              className="h-10 w-10 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shadow-sm cursor-pointer hover:ring-2 ring-emerald-500 transition-all"
            >
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-12 bg-[#FDFDFD]">
          <div className="max-w-7xl mx-auto">
            
            {/* PAGE HEADER */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 capitalize">{activeTab}</h1>
                <p className="text-sm text-slate-500 mt-2 font-medium">
                  {activeTab === 'Overview' && "Your business at a glance today."}
                  {activeTab === 'Inventory' && "Manage your products and stock levels."}
                  {activeTab === 'Orders' && "Track and process your customer shipments."}
                  {activeTab === 'Analytics' && "Deep dive into your sales performance."}
                  {activeTab === 'Profile' && "Manage your store and personal details."}
                </p>
              </div>
              {activeTab === 'Inventory' && (
                <button className="h-12 px-6 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-transform active:scale-95 flex items-center gap-2">
                  <Plus size={18} /> Add Product
                </button>
              )}
              {activeTab === 'Profile' && (
                <button className="h-12 px-6 text-sm font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-transform active:scale-95 flex items-center gap-2">
                 <Edit size={18} /> Update Profile
                </button>
              )}

            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR TABS ---

const OverviewView = () => (
  <div className="space-y-12">

    {/* ===== BUSINESS KPIs ===== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      <StatCard title="Total Revenue" value="₹1,25,000" change="+12.5%" trend="up" icon={DollarSign} />
      <StatCard title="Today's Orders" value="18" change="+3" trend="up" icon={ShoppingCart} />
      <StatCard title="Pending Orders" value="7" change="-2" trend="down" icon={Clock} />
      <StatCard title="Low Stock Items" value="5" change="+1" trend="down" icon={AlertTriangle} />
      <StatCard title="Seller Rating" value="4.8 / 5" change="+0.2" trend="up" icon={Star} />
    </div>

    {/* ===== MAIN GRID ===== */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* ===== SALES PERFORMANCE ===== */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-lg text-slate-800">Sales Performance</h3>
          <select className="text-sm border border-slate-200 rounded-lg px-3 py-1">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="h-72 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 italic">
          📊 Revenue & Orders Chart
        </div>
      </div>

      {/* ===== SIDE PANELS ===== */}
      <div className="space-y-8">

        {/* ORDER STATUS */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Order Status</h4>
          {[
            { label: 'Pending', value: 7 },
            { label: 'Shipped', value: 12 },
            { label: 'Delivered', value: 93 },
            { label: 'Cancelled', value: 4 },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-sm mb-3">
              <span className="text-slate-600">{item.label}</span>
              <span className="font-bold text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>

        {/* INVENTORY ALERTS */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4">Inventory Alerts</h4>
          {[
            { name: 'iPhone 15 Pro', status: 'Low Stock' },
            { name: 'Bluetooth Speaker', status: 'Out of Stock' },
          ].map((item) => (
            <div key={item.name} className="flex justify-between text-sm mb-3">
              <span className="text-slate-700">{item.name}</span>
              <span className="text-xs font-bold text-red-600">{item.status}</span>
            </div>
          ))}
        </div>

      </div>
    </div>

    {/* ===== BOTTOM SECTION ===== */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

      {/* RECENT REVIEWS */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <h3 className="font-extrabold text-lg text-slate-800 mb-6">Recent Customer Reviews</h3>

        {[
          { user: 'Aman', rating: 5, comment: 'Fast delivery, great product!' },
          { user: 'Neha', rating: 4, comment: 'Quality is good, packaging could be better.' },
        ].map((review, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between">
              <span className="font-bold text-slate-700">{review.user}</span>
              <span className="text-emerald-600 font-bold">{'★'.repeat(review.rating)}</span>
            </div>
            <p className="text-sm text-slate-600">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <h3 className="font-extrabold text-lg text-slate-800 mb-6">Quick Actions</h3>

        <div className="grid grid-cols-2 gap-4">
          <button className="h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800">
            ➕ Add Product
          </button>
          <button className="h-12 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">
            📦 Update Stock
          </button>
          <button className="h-12 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">
            📑 View Orders
          </button>
          <button className="h-12 rounded-xl bg-slate-100 font-bold hover:bg-slate-200">
            👤 Edit Profile
          </button>
        </div>
      </div>

    </div>
  </div>
);


const InventoryView = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors">
          <Filter size={14} /> Filter
        </button>
      </div>
    </div>
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="bg-slate-50/50 border-b border-slate-100">
          <th className="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Product Info</th>
          <th className="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Category</th>
          <th className="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Price</th>
          <th className="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest">Stock</th>
          <th className="px-8 py-4 font-bold text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {[1, 2, 3, 4, 5].map((i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
            <td className="px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                  <Package size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Premium Leather Jacket {i}</p>
                  <p className="text-[10px] text-slate-400 font-mono">SKU-29384{i}</p>
                </div>
              </div>
            </td>
            <td className="px-8 py-5 text-slate-500 font-medium">Apparel</td>
            <td className="px-8 py-5 font-bold text-slate-900">₹4,999</td>
            <td className="px-8 py-5">
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-black text-slate-500">12/20</span>
              </div>
            </td>
            <td className="px-8 py-5 text-right">
              <div className="flex justify-end gap-2">
                <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"><Edit size={16}/></button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={16}/></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const OrdersView = () => (
  <div className="space-y-6">
    <div className="flex gap-4 mb-4">
      {['All Orders', 'Pending', 'Shipped', 'Delivered'].map((status, idx) => (
        <button key={status} className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${idx === 0 ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'}`}>
          {status}
        </button>
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-6">
            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
              <ShoppingCart size={20} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h4 className="font-bold text-slate-900">#ORD-2024-00{i}</h4>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-black uppercase">Pending Ship</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Customer: <span className="font-bold text-slate-700">Aditya Verma</span> • 2 items • ₹3,240</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ordered</p>
              <p className="text-xs font-bold text-slate-900">2 mins ago</p>
            </div>
            <button className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-100 transition-all">
              Process Now
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-slate-800">Traffic Source</h3>
        <Layers size={18} className="text-slate-400" />
      </div>
      <div className="space-y-6">
        {[
          { label: 'Direct Search', value: '45%', color: 'bg-emerald-500' },
          { label: 'Social Media', value: '30%', color: 'bg-indigo-500' },
          { label: 'Referrals', value: '25%', color: 'bg-amber-500' },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-500">{item.label}</span>
              <span className="text-slate-900">{item.value}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${item.color}`} style={{ width: item.value }} />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-slate-900 p-8 rounded-2xl text-white shadow-xl shadow-slate-200 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-slate-300 mb-2">Growth Milestone</h3>
        <p className="text-3xl font-black">Top 1% Seller</p>
        <p className="text-slate-400 text-xs mt-2 font-medium">You reached the gold tier this month! 🎉</p>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <div className="flex -space-x-2">
           {[1,2,3,4].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-700" />)}
        </div>
        <button className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
          View Benefits <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

const ProfileView = () => (
  <div className="max-w-4xl space-y-8">
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-8">
      <div className="relative group">
        <div className="h-24 w-24 bg-emerald-50 rounded-2xl overflow-hidden border border-emerald-100">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
        </div>
        <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-lg shadow-md border border-slate-100 hover:bg-slate-50">
          <Edit size={12} className="text-slate-600" />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-slate-900">Felix Retailers Pvt Ltd</h2>
          <CheckCircle2 size={18} className="text-emerald-500" />
        </div>
        <p className="text-sm text-slate-500 font-medium mt-1">Premium Electronics & Gadgets Distributor</p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
            <Star size={14} className="text-amber-500 fill-amber-500" /> 4.9 Rating
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
            <Calendar size={14} className="text-blue-500" /> Joined Jan 2023
          </div>
        </div>
        
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <MapPin size={18} className="text-emerald-600" /> Shop Location
        </h3>
        <div className="space-y-4 text-sm font-medium text-slate-600">
          <p>Sector 44, Huda Market</p>
          <p>Gurugram, Haryana, 122003</p>
          <p>India</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Mail size={18} className="text-emerald-600" /> Contact Details
        </h3>
        <div className="space-y-4 text-sm font-medium text-slate-600">
          <div className="flex justify-between"><span>Email</span><span className="text-slate-900">felix@retail.com</span></div>
          <div className="flex justify-between"><span>Phone</span><span className="text-slate-900">+91 99887 76655</span></div>
          <div className="flex justify-between"><span>GSTIN</span><span className="text-slate-900 font-mono">07AAACF1234F1Z5</span></div>
        </div>
      </div>
    </div>
  </div>
);

// --- HELPER COMPONENTS ---

const StatCard = ({ title, value, change, trend, icon: Icon }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] group hover:shadow-xl transition-all duration-500">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <Icon size={18} className="text-slate-400 group-hover:text-emerald-600" />
      </div>
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {change}
      </span>
    </div>
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{title}</p>
    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h3>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all text-sm font-bold ${
      active 
        ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
    }`}
  >
    <Icon size={18} className={active ? "text-emerald-600" : "text-slate-400"} />
    <span>{label}</span>
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

export default SellerDashboard;