import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const userId = params.get("id"); // ID uthao
    const redirectPath = params.get("redirect");

    if (token && userId) {
      // 1. Token aur Name save karo
      const cleanToken = token.replace(/^"(.*)"$/, '$1'); 
      localStorage.setItem("userToken", cleanToken);
      
      localStorage.setItem("user", JSON.stringify({ id: userId, name: name }));
      localStorage.setItem("user_name", name);

      // 2. Pure app ko notify karo (Navbar update ke liye)
      window.dispatchEvent(new Event("userLoginStateChange"));

      console.log("Token received, redirecting to:", redirectPath);

      // 3. Redirect Logic with a tiny delay (taaki storage settle ho jaye)
      setTimeout(() => {
        if (redirectPath) {
          navigate(redirectPath, { replace: true });
        } else {
          // Default fallback
          navigate("/customer-dashboard", { replace: true });
        }
      }, 100);

    } else {
      console.error("No token found in URL");
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 text-sm font-medium">Verifying credentials...</p>
    </div>
  );
}