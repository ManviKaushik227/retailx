import { useState, useEffect } from "react";
import { 
  Users, Package, BarChart3, Tag, LogOut, Bell, Search, Plus, Command, Clock, Trash2, ShoppingBag, CreditCard 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* --- SHARED API HELPER --- */
const apiRequest = async (endpoint, method = "GET", body = null) => {
  let token = localStorage.getItem("adminToken")?.replace(/^"(.*)"$/, '$1');
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);
  
const res = await fetch(`http://127.0.0.1:5000${endpoint}`, config);
  return res.ok ? await res.json() : null;
};

/* --- VIEWS --- */
const getHeaders = () => {
  let token = localStorage.getItem("adminToken")?.replace(/^"(.*)"$/, '$1');
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

const UsersView = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch("http://127.0.0.1:5000/api/admin/users", { headers: getHeaders() })
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  };

  useEffect(() => { fetchUsers(); }, []);

  // --- 🗑️ DELETE FUNCTION ---
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: getHeaders(),
        });

        if (res.ok) {
          // Remove the user from the UI state so it disappears instantly
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          alert("Failed to delete user");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
              <td className="p-4 font-bold text-slate-700">{u.name || "Customer"}</td>
              <td className="p-4 text-slate-500 text-sm">{u.email}</td>
              <td className="p-4 text-right">
                {/* --- CLICK HANDLER ADDED HERE --- */}
                <button 
                  onClick={() => handleDelete(u._id)}
                  className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="p-10 text-center text-slate-400 font-medium">No users found.</div>
      )}
    </div>
  );
};
const OrdersView = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // Kyunki orders ka blueprint alag hai, fetch use karo ya apiRequest ko bypass karo
    const fetchOrders = async () => {
      let token = localStorage.getItem("adminToken")?.replace(/^"(.*)"$/, '$1');
      const res = await fetch(`http://127.0.0.1:5000/api/orders`, { // Change this URL
        headers: { "Authorization": `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    };
    fetchOrders();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4">
      {data?.map(o => (
        <div key={o._id} className="bg-white p-6 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><ShoppingBag size={20}/></div>
            <div>
              <p className="font-bold text-slate-800">{o.email}</p>
              <p className="text-xs text-slate-400">Order ID: {o._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-slate-900">${o.total}</p>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase tracking-tighter">{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
/* --- SUB-VIEW: MANAGE SELLERS --- */
const SellersView = () => {
  const [sellers, setSellers] = useState([]);

  const fetchSellers = () => {
    fetch("http://127.0.0.1:5000/api/admin/sellers", { headers: getHeaders() })
      .then(res => res.json())
      .then(data => setSellers(Array.isArray(data) ? data : []))
      .catch(err => console.error("Seller fetch error:", err));
  };

  useEffect(() => { fetchSellers(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Remove this seller and their store access?")) {
      const res = await fetch(`http://127.0.0.1:5000/api/admin/sellers/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) setSellers(sellers.filter(s => s._id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <tr>
            <th className="p-4">Store Name</th>
            <th className="p-4">Registration ID</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map(s => (
            <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50">
              <td className="p-4 font-bold text-slate-800">{s.storeName}</td>
              <td className="p-4 text-xs font-mono text-slate-400">{s.registrationId}</td>
              <td className="p-4 text-slate-500 text-sm">{s.email}</td>
              <td className="p-4 text-right">
                <button onClick={() => handleDelete(s._id)} className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sellers.length === 0 && <div className="p-10 text-center text-slate-400">No sellers registered yet.</div>}
    </div>
  );
};

const InsightsView = () => {
  const [stats, setStats] = useState({ users: 0, sellers: 0, products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await apiRequest("/api/admin/stats");
      if (data) setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Sellers", value: stats.sellers, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Products", value: stats.products, icon: Search, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold">Loading Stats...</div>;

  return (
    <div className="space-y-8">
      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-12 w-12 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value.toLocaleString()}</h3>
          </div>
        ))}
      </div>

      {/* --- REVENUE BANNER --- */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex justify-between items-center overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Gross Platform Revenue</p>
          <h2 className="text-5xl font-black mt-2">{stats.revenue.toLocaleString()}</h2>
        </div>
        <div className="opacity-20 relative z-10">
           <BarChart3 size={80} />
        </div>
        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

const DealsView = () => {
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]); // Dynamic categories state
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    title: "", 
    discount: "", 
    expiry: "", 
    category: "" 
  });

  // 1. Load All Data (Deals + Categories)
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [dealsData, catsData] = await Promise.all([
        apiRequest("/api/admin_ops/deals"),      // Prefix ke sath likho
        apiRequest("/api/admin_ops/categories")  // Prefix ke sath likho
      ]);

      if (dealsData) setDeals(Array.isArray(dealsData) ? dealsData : []);
      if (catsData) setCategories(Array.isArray(catsData) ? catsData : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // 2. Filter Active Deals
  const activeDeals = deals.filter(deal => {
    if (!deal.expiry) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(deal.expiry);
    return expiryDate >= today;
  });

  // 3. Handle Submit New Deal
  const submit = async (e) => {
    e.preventDefault();
    if (!formData.category) return alert("Please select a category");

    const res = await apiRequest("/api/admin_ops/deals", "POST", formData);
    if (res) {
      setShowModal(false);
      setFormData({ title: "", discount: "", expiry: "", category: "" });
      loadAllData(); // Refresh list
    }
  };

  // 4. Handle Delete Deal
  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to remove this deal?")) {
      let token = localStorage.getItem("adminToken")?.replace(/^"(.*)"$/, '$1');
      const res = await fetch(`http://127.0.0.1:5000/api/admin_ops/deals/${dealId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      if (res.ok) {
        setDeals(deals.filter(d => d._id !== dealId));
      } else {
        alert("Failed to delete deal");
      }
    }
  };

  if (loading && deals.length === 0) {
    return <div className="p-20 text-center animate-pulse text-slate-400 font-bold">Fetching Platform Deals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* --- DEALS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDeals.map(d => (
          <div key={d._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-emerald-200 transition-all">
            <button 
              onClick={() => handleDeleteDeal(d._id)} 
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
            
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">
              {d.category || "General"}
            </span>
            
            <h3 className="font-bold text-slate-900 pr-8 truncate">{d.title}</h3>
            <p className="text-3xl font-black text-emerald-600 my-2">{d.discount}% OFF</p>
            
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Clock size={14}/> 
              <span>Expires: {new Date(d.expiry).toLocaleDateString("en-IN")}</span>
            </div>
          </div>
        ))}

        {/* --- ADD NEW DEAL CARD --- */}
        <button 
          onClick={() => setShowModal(true)} 
          className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-slate-400 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50/30 transition-all flex flex-col items-center justify-center min-h-[160px]"
        >
          <Plus size={32}/> 
          <span className="font-bold mt-2">New Promotion</span>
        </button>
      </div>

      {activeDeals.length === 0 && !loading && (
        <div className="p-10 text-center bg-slate-50 rounded-2xl text-slate-400 border border-dashed border-slate-200">
          No active promotions. Click "New Promotion" to start one.
        </div>
      )}

      {/* --- CREATE DEAL MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.form 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            onSubmit={submit} 
            className="bg-white p-8 rounded-3xl w-full max-w-md space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-slate-900">Create Promotion</h3>
              <Tag className="text-emerald-500" size={20} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Promotion Title</label>
                <input 
                  placeholder="e.g. Weekend Electronics Sale" 
                  className="w-full p-3 mt-1 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all" 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Target Category</label>
                <select 
                  className="w-full p-3 mt-1 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-[10px] text-orange-500 mt-1">⚠️ No categories found in your products.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Discount %</label>
                  <input 
                    type="number" 
                    placeholder="20" 
                    className="w-full p-3 mt-1 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    onChange={e => setFormData({...formData, discount: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Expiry Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 mt-1 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    onChange={e => setFormData({...formData, expiry: e.target.value})} 
                    required 
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="flex-1 font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                Publish Deal
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

/* --- MAIN DASHBOARD --- */

export default function AdminDashboard() {
  const [active, setActive] = useState("insights");
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Dropdown control

  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Token clear karo
    window.location.href = "/admin/login"; // Login page par bhejo
  };

  const menu = [
    { id: "insights", label: "Dashboard", icon: BarChart3 },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "sellers", label: "Manage Sellers", icon: Package },
    { id: "orders", label: "Global Orders", icon: Search },
    { id: "offers", label: "Platform Deals", icon: Tag },
    { id: "complaints", label: "Support", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
      <aside className="w-64 border-r border-slate-100 flex flex-col sticky top-0 h-screen bg-white">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100"><Command size={24}/></div>
          <span className="font-black text-xl tracking-tighter">RETAIL<span className="text-emerald-600">X</span></span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menu.map(item => (
            <div key={item.id} onClick={() => setActive(item.id)} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer transition-all text-sm font-bold ${active === item.id ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm" : "text-slate-400 hover:bg-slate-50"}`}>
              <item.icon size={18}/> {item.label}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-12 max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
  <div>
    <h1 className="text-4xl font-black tracking-tight capitalize">{active}</h1>
    <p className="text-slate-400 font-medium">Platform management and monitoring.</p>
  </div>

  {/* --- PROFILE & LOGOUT SECTION --- */}
  <div className="relative">
    <button 
      onClick={() => setShowProfileMenu(!showProfileMenu)}
      className="h-12 w-12 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-all overflow-hidden shadow-sm"
    >
      <Users size={20} /> {/* Yahan user icon ya profile image daal sakte ho */}
    </button>

    {/* Dropdown Menu */}
    <AnimatePresence>
      {showProfileMenu && (
        <>
          {/* Overlay to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowProfileMenu(false)} 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-20"
          >
            <div className="px-4 py-2 mb-2 border-b border-slate-50">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Admin Access</p>
              <p className="text-sm font-bold text-slate-700 truncate">admin@retailx.com</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold"
            >
              <LogOut size={16} />
              Logout Session
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
</header>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {active === "insights" && <InsightsView />}
            {active === "users" && <UsersView />}
            {active === "orders" && <OrdersView />}
            {active === "offers" && <DealsView />}
            {active === "sellers" && <SellersView />}
            {active === "complaints" && <div className="p-20 text-center text-slate-300 font-bold">No Support Requests</div>}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}