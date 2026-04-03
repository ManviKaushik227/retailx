import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">RetailX</h2>
          <p className="mt-4 text-sm text-gray-400">
            RetailX is an AI-driven immersive shopping platform offering personalized
            recommendations, smart search, and budget-friendly shopping.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer"><Link to={"/help-center"}>Help & Support</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to={"/deals"}>Deals</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer"><Link to={"/privacy"}>Privacy Policy</Link></li>
            <li className="hover:text-white cursor-pointer"><Link to={"/terms"}>Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-sm text-gray-400">
            Email: support@retailx.com
          </p>

          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        © 2026 RetailX. AI-Driven Immersive Retail Experience.
      </div>
    </footer>
  );
}