import { useState } from "react";
import { Mail, Lock, Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function SellerAuth() {
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ MOCK AUTH (replace later with backend)
    localStorage.setItem("isSeller", "true");

    navigate("/seller");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Store className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-extrabold">
            {mode === "login" ? "Seller Login" : "Seller Registration"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Access your Seller Dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={Mail} placeholder="seller@email.com" />
          <Input icon={Lock} type="password" placeholder="Password" />

          {mode === "register" && (
          <>
              <Input icon={Store} placeholder="Store Name" />
              <Input icon={Store} placeholder="Shop Registration ID" />
            </>
          )}  
            <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2">
                {mode === "login" ? "Login" : "Create Seller Account"}
              <ArrowRight size={18} />
              </Button>
          </form>


        {/* TOGGLE */}
        <div className="mt-8 text-center text-sm text-slate-500">
          {mode === "login" ? "New seller?" : "Already registered?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold text-blue-600 hover:underline"
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ icon: Icon, type = "text", placeholder }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-sm"
        required
      />
    </div>
  );
}
