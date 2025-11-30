// src/components/Footer.jsx
import { Link } from "react-router-dom"
import { HelpCircle, Phone, Mail, Linkedin, Twitter, Facebook, ChevronRight, Package, Truck, Shield, CreditCard } from "lucide-react"
import logo from "../../assets/logo1080.png"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Top Help Section - Premium Dark */}
 

      {/* Main Footer - Clean White */}
      <div className="bg-white">
        <div className="px-6 py-20 mx-auto max-w-7xl">

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">

            {/* Brand Column */}
            <div className="lg:col-span-2">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 mb-8 group">
                <div className="relative">
                  <img 
                    src={logo} 
                    alt="Epasaley Logo" 
                    className="object-contain w-20 h-20"
                  />
                </div>
                <span className="text-3xl font-light tracking-tight text-gray-900">Epasaley</span>
              </Link>

              <p className="max-w-md mb-10 text-lg leading-relaxed text-gray-600">
                Nepal’s most trusted online store. Fast delivery • Easy returns • 100% genuine products
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl">
                    <Truck className="w-7 h-7 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Free Delivery Over Rs.10,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                    <Shield className="text-blue-600 w-7 h-7" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Secure Payment</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4">
                <a href="#" className="p-3 transition bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Facebook className="w-5 h-5 text-gray-700" />
                </a>
                <a href="#" className="p-3 transition bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Twitter className="w-5 h-5 text-gray-700" />
                </a>
                <a href="#" className="p-3 transition bg-gray-100 rounded-xl hover:bg-gray-200">
                  <Linkedin className="w-5 h-5 text-gray-700" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-gray-900">Shop</h4>
              <ul className="space-y-4">
                {["All Products", "New Arrivals", "Best Sellers", "Flash Sale"].map((item) => (
                  <li key={item}>
                    <Link to="/products" className="flex items-center gap-2 text-gray-600 transition hover:text-gray-900 group">
                      <ChevronRight className="w-4 h-4 text-gray-400 transition group-hover:text-gray-900" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-gray-900">Customer Care</h4>
              <ul className="space-y-4">
                {["Track Order", "Returns & Refund", "Shipping Info", "Size Guide", "FAQ"].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-2 text-gray-600 transition hover:text-gray-900 group">
                      <ChevronRight className="w-4 h-4 text-gray-400 transition group-hover:text-gray-900" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-gray-900">Company</h4>
              <ul className="space-y-4">
                {["About Us", "Careers", "Press", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="flex items-center gap-2 text-gray-600 transition hover:text-gray-900 group">
                      <ChevronRight className="w-4 h-4 text-gray-400 transition group-hover:text-gray-900" />
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
      <div className="text-gray-400 bg-gray-900">
        <div className="px-6 py-8 mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm">
              © {currentYear} Epasaley. All rights reserved. Made with love in Nepal
            </p>
            <div className="flex items-center gap-8 text-sm">
              <a href="#" className="transition hover:text-white">Privacy Policy</a>
              <a href="#" className="transition hover:text-white">Terms of Service</a>
              <a href="#" className="transition hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}