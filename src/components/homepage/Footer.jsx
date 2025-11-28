import {
  Heart,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Paintbrush as Pinterest,
  TrendingUp,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="px-8 py-16 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Newsletter Signup */}
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-8">
              STAY UP TO DATE
              <br />
              WITH NEWS, EVENTS
              <br />
              AND MORE!
            </h3>
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-6 py-2 max-w-sm">
              <input
                type="text"
                placeholder="NEWSLETTER"
                className="flex-1 py-3 bg-transparent text-sm font-semibold outline-none"
              />
              <button className="bg-black rounded-full p-2 hover:bg-gray-800 transition">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Customer Service */}
            <div>
              <h4 className="font-black text-sm mb-4">CUSTOMER SERVICE</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Help centre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Form Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Complaints
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Payment methods
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Shipping status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Shipping Information
                  </a>
                </li>
              </ul>
            </div>

            {/* Business */}
            <div>
              <h4 className="font-black text-sm mb-4">BUSINESS</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    KoRo for business
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Sponsoring & collaborations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    KoRo Source
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-black text-sm mb-4">LEGAL</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Imprint
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Cancellation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Cookie settings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* KoRo */}
            <div>
              <h4 className="font-black text-sm mb-4">KORO</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Our team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Sustainability at KoRo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900 transition">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          {/* Branding */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-black text-gray-900">KoRo</span>
            <span>is made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>in Berlin</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <Pinterest className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <TrendingUp className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-500 text-center md:text-right">
            All prices incl. VAT plus shipping costs and possible delivery charges, if not stated otherwise.
            <br />
            KoRo 2024 © All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}