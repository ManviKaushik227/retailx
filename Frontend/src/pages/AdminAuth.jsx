import { useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  KeyRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "../Components/ui/button";

export default function AdminAuth() {
  const [mode, setMode] = useState("login");
  const [adminKey, setAdminKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 Admin check
    if (adminKey) {
      if (adminKey !== "RETAILX_ADMIN_2026") {
        alert("Invalid Admin Secret Key");
        return;
      }
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      localStorage.setItem("isAdmin", "false");
      navigate("/"); // user dashboard
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-100"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {mode === "login" ? "Secure Login" : "Create Account"}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            RetailX Authentication Portal
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={Mail} placeholder="email@company.com" />
          <Input icon={Lock} type="password" placeholder="••••••••" />

          {/* OPTIONAL ADMIN KEY */}
          <Input
            icon={KeyRound}
            placeholder="Admin ID"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />

          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
          >
            {mode === "login" ? "Login Securely" : "Register Account"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* TOGGLE */}
        <div className="mt-8 text-center text-sm text-slate-500">
          {mode === "login" ? "New here?" : "Already registered?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-bold text-emerald-600 hover:underline"
          >
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ icon: Icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-sm"
        required={type !== "text" || placeholder.includes("email")}
      />
    </div>
  );
}
