import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  ShieldCheck
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setIsLoading(true);

    if (mode === "register") {
      if (!PASSWORD_REGEX.test(password)) {
        setIsLoading(false);
        setError("Password must be at least 8 characters long and include an uppercase letter and a special character.");
        return;
      }
      if (password !== confirmPassword) {
        setIsLoading(false);
        setError("Passwords do not match.");
        return;
      }
    }

    try {
      let url = "http://127.0.0.1:5000/api/auth/register";
      let payload = { name, email, password };

      if (mode === "login") {
        url = "http://127.0.0.1:5000/api/auth/login";
        payload = { email, password };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed");

      // --- CRITICAL LOGIC START ---

      // 1. Save token
      localStorage.setItem("userToken", data.token);

      // 2. Save full user object (important for Navbar login check)
      localStorage.setItem("user", JSON.stringify(data.user));

      // 3. Save preferences (if any)
      const userPrefs = data.user?.preferences || [];
      localStorage.setItem("user_preferences", JSON.stringify(userPrefs));

      // 4. Navigation
      if (mode === "register") {
        navigate("/preferences");
      } else {
        if (userPrefs.length > 0) {
          navigate("/customer-dashboard");
        } else {
          navigate("/preferences");
        }
      }

      // --- CRITICAL LOGIC END ---

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans text-slate-900">
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] z-10"
        >
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <div className="mb-8 text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                {mode === "login" ? "Sign in to RetailX" : "Create your account"}
              </h1>
              <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                {mode === "login"
                  ? "Enter your credentials to access your dashboard."
                  : "Join thousands of businesses managing with RetailX."}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <Input
                      label="Full Name"
                      icon={User}
                      value={name}
                      setValue={setName}
                      placeholder="e.g. John Doe"
                      field="name"
                      focusedField={focusedField}
                      setFocusedField={setFocusedField}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email Address"
                icon={Mail}
                value={email}
                setValue={setEmail}
                placeholder="name@company.com"
                field="email"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
              />

              <PasswordInput
                label="Password"
                value={password}
                setValue={setPassword}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                field="password"
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                placeholder="••••••••"
              />

              {mode === "register" && (
                <PasswordInput
                  label="Confirm Password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                  show={showConfirmPassword}
                  toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  field="confirmPassword"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  placeholder="••••••••"
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-medium transition-all duration-200 shadow-sm flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Get Started"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
              <p className="text-sm text-slate-500">
                {mode === "login" ? "New to the platform?" : "Already have an account?"}{" "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                >
                  {mode === "login" ? "Create an account" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Input component
function Input({ label, icon: Icon, value, setValue, placeholder, field, focusedField, setFocusedField }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === field ? "text-emerald-600" : "text-slate-400"}`} />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
        />
      </div>
    </div>
  );
}

// PasswordInput component
function PasswordInput({ label, value, setValue, show, toggle, field, focusedField, setFocusedField, placeholder }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center px-1">
        <label className="text-[13px] font-medium text-slate-700">{label}</label>
        {field === "password" && <button type="button" className="text-[12px] text-emerald-600 hover:underline font-medium">Forgot?</button>}
      </div>
      <div className="relative">
        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${focusedField === field ? "text-emerald-600" : "text-slate-400"}`} />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocusedField(field)}
          onBlur={() => setFocusedField(null)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
        />
        <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
