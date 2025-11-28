import { Link } from "react-router-dom";
import {
  HelpCircle,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      {/* Help Section - Light Teal Background */}
      <div className="bg-teal-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left - Help Text */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">We're always here to help</h3>
              <p className="text-gray-500 text-sm mt-1">You can get help by choosing from any of these options</p>
            </div>
            
            {/* Right - Contact Options */}
            <div className="flex flex-wrap items-center gap-8">
              {/* Help Center */}
              <a href="#" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full border-2 border-teal-500 flex items-center justify-center group-hover:bg-teal-500 transition">
                  <HelpCircle className="w-5 h-5 text-teal-500 group-hover:text-white transition" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Help Center</p>
                  <p className="text-sm font-medium text-gray-900">help.epasaley.com</p>
                </div>
              </a>
              
              {/* Phone */}
              <a href="tel:+9779860056658" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full border-2 border-teal-500 flex items-center justify-center group-hover:bg-teal-500 transition">
                  <Phone className="w-5 h-5 text-teal-500 group-hover:text-white transition" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900">+9779860056658</p>
                </div>
              </a>
              
              {/* Email */}
              <a href="mailto:support@epasaley.com" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full border-2 border-teal-500 flex items-center justify-center group-hover:bg-teal-500 transition">
                  <Mail className="w-5 h-5 text-teal-500 group-hover:text-white transition" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email Support</p>
                  <p className="text-sm font-medium text-gray-900">support@epasaley.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer - White Background */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ePasaley</span>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex gap-3 mb-6">
                <a href="#" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">GET IT ON</p>
                    <p className="text-sm font-medium -mt-0.5">Google Play</p>
                  </div>
                </a>
                <a href="#" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] opacity-80">Download on the</p>
                    <p className="text-sm font-medium -mt-0.5">App Store</p>
                  </div>
                </a>
              </div>
              
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-500 transition">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Menu 1 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Shop</h4>
              <ul className="space-y-3">
                {[
                  { name: "All Products", path: "/products" },
                  { name: "New Arrivals", path: "/products" },
                  { name: "Flash Sales", path: "/#flashsale" },
                  { name: "Categories", path: "/#categories" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.path}
                      className="text-gray-500 hover:text-teal-600 transition text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu 2 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Shipping Info",
                  "Returns",
                  "Track Order",
                ].map((item) => (
                  <li key={item}>
                    <a 
                      href="#"
                      className="text-gray-500 hover:text-teal-600 transition text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu 3 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3">
                {[
                  "About Us",
                  "Careers",
                  "Blog",
                  "Contact",
                ].map((item) => (
                  <li key={item}>
                    <a 
                      href="#"
                      className="text-gray-500 hover:text-teal-600 transition text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {currentYear}, ePasaley. All rights reserved.
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition">Terms</a>
              <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition">Cookies</a>
              <a href="#" className="text-gray-500 hover:text-teal-600 text-sm transition">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}