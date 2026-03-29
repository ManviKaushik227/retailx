import { useState, useContext, useEffect } from "react";
import { ShoppingCart, Heart, User, ChevronDown, LogOut, Package, LayoutDashboard, Search, LayoutGrid, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext"; 

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { cartData, fetchCart } = useContext(CartContext);

  // Helper function to get user from storage safely
  const getStoredUser = () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser || savedUser === "undefined" || savedUser === "null") return null;
    try {
      return JSON.parse(savedUser);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    // 1. Initial check
    const currentUser = getStoredUser();
    setUser(currentUser);
    if (currentUser) fetchCart();

    // 2. Listen for changes in localStorage (Login/Logout across tabs or components)
    const handleStorageChange = () => {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
      if (updatedUser) fetchCart();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event listener agar same window mein update ho raha hai
    window.addEventListener("userLoginStateChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userLoginStateChange", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const isLoggedIn = !!user;
  const cartCount = cartData?.items?.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
    // Reload zaroori hai agar context clear karna ho
    window.location.reload();
  };

  const CATEGORIES = [
    "Fashion", "Electronics", "Grocery", "Beauty", "Home & Living", "Sports",
    "Books", "Toys", "Health & Wellness", "Jewellery", "Watches", "Shoes",
    "Bags & Accessories", "Kids & Baby", "Pet Supplies", "Automotive",
    "Music & Instruments", "Gaming", "Stationery", "Office Supplies",
    "Kitchen & Dining", "Furniture", "Garden & Outdoors", "Art & Craft",
    "Photography", "Travel & Luggage", "Footwear", "Mobile Accessories",
    "Smart Home", "Computer Accessories", "Cameras & Drones", "Fitness Equipment",
    "Camping & Hiking", "Cycling", "Swimming & Water Sports", "Sportswear",
    "Hair Care", "Skin Care", "Makeup", "Fragrances", "Eyewear", "Sunglasses",
    "Watches & Clocks", "Home Decor", "Lighting", "Bedding & Linen",
    "Cleaning Supplies", "Gourmet Food", "Beverages", "Snacks & Confectionery",
    "Vitamins & Supplements", "Stationery & Office Equipment", "Smartphones",
    "Tablets", "Laptops", "Printers & Scanners"
  ].sort();

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-10">
          <Link to={isLoggedIn ? "/customer-dashboard" : "/"} className="text-xl font-bold text-slate-900 tracking-tight">
            Retail<span className="text-emerald-600">X</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-emerald-600" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 pl-10 pr-4 py-2 w-[300px] text-sm rounded-xl border border-transparent focus:bg-white focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
            />
          </form>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-7">
            <NavLink to={isLoggedIn ? "/customer-dashboard" : "/"}>Home</NavLink>

            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors py-5">
                Categories <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              <div className="absolute top-[calc(100%-5px)] left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50">
                <div className="bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-2xl border border-slate-100 w-[750px] overflow-hidden">
                  <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Browse All categories</span>
                    </div>
                  </div>

                  <div className="p-8 grid grid-cols-3 gap-x-10 gap-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/search?category=${encodeURIComponent(cat)}`}
                        className="group/item flex items-center py-1.5 text-[13px] text-slate-500 hover:text-emerald-600 transition-colors"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-200 mr-3 group-hover/item:bg-emerald-400 group-hover/item:scale-150 transition-all" />
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <NavLink to="/deals">Deals</NavLink>
            <NavLink to="/admin-auth" className="italic text-slate-500">Admin</NavLink>
            <NavLink to="/seller-auth" className="italic text-slate-500">Seller</NavLink>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-slate-50">
              <ShoppingCart className="h-5 w-5 text-slate-600 hover:text-emerald-600" />
              {cartCount > 0 && (
                <span className={`absolute top-1 right-1 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white 
                  ${cartData?.spent > cartData?.monthlyBudget ? "bg-red-500 animate-pulse" : "bg-emerald-600"} text-white`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {!isLoggedIn ? (
              <Link to="/auth">
                <Button className="rounded-xl px-4 h-9 flex gap-2">
                  <User className="h-4 w-4" /> Login
                </Button>
              </Link>
            ) : (
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-slate-100">
                  <UserCircle className="h-7 w-7 text-slate-700" />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{user.email || 'User'}</p>
                  </div>
                  <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 text-slate-700">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 text-slate-700">
                    <Heart className="h-4 w-4" /> Wishlist
                  </Link>
                  <div className="border-t border-slate-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`relative text-sm font-medium text-slate-600 hover:text-emerald-600 transition py-1 group ${className}`}>
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full" />
    </Link>
  );
}