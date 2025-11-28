"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import Navbar from "../homepage/navbar";
import { useCart } from "@/context/cart-context";

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState("shipping");
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (currentStep === "shipping") {
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setCurrentStep("confirmation");
      clearCart();
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  const steps = ["shipping", "payment", "confirmation"];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="flex justify-between mb-12 relative">
            {steps.map((step, idx) => {
              const isActive = currentStep === step;
              const isCompleted = steps.indexOf(currentStep) > idx;

              return (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                      isCompleted || isActive
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <Check className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div className="hidden sm:block ml-4 text-sm font-bold uppercase tracking-wider text-gray-700">
                    {step}
                  </div>
                  {idx < 2 && (
                    <div
                      className={`flex-1 h-1 mx-6 transition-all ${
                        steps.indexOf(currentStep) > idx ? "bg-black" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Shipping Step */}
          {currentStep === "shipping" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Shipping Form */}
              <div>
                <h2 className="text-3xl font-black mb-8">Shipping Address</h2>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-fit">
                <h3 className="text-2xl font-black mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between pb-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (20%)</span>
                    <span>£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-300">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-black hover:bg-gray-800 text-white py-5 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-3xl font-black mb-8">Payment Details</h2>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition font-mono text-lg tracking-wider"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-black/10 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Same Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 h-fit">
                <h3 className="text-2xl font-black mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between pb-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (20%)</span>
                    <span>£{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-3 border-t border-gray-300">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="w-full mt-8 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white py-5 rounded-xl font-bold text-lg transition shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing Payment..." : "Place Order"}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === "confirmation" && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="mb-10">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-4xl font-black mb-4">Order Confirmed!</h2>
                <p className="text-xl text-gray-600">
                  Thank you for shopping with us. Your order is on its way!
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 mb-10">
                <p className="text-sm text-gray-500 mb-2">Order Number</p>
                <p className="text-3xl font-black tracking-wider mb-8">
                  #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mb-2">Estimated Delivery</p>
                <p className="text-2xl font-bold mb-10">3–5 Business Days</p>

                <div className="text-left bg-gray-50 rounded-xl p-6">
                  <p className="font-bold mb-4">Items Ordered:</p>
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Link
                  href="/"
                  className="flex-1 bg-black hover:bg-gray-800 text-white py-5 rounded-xl font-bold text-lg transition"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/"
                  className="flex-1 border-2 border-black hover:bg-black hover:text-white text-black py-5 rounded-xl font-bold text-lg transition"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}