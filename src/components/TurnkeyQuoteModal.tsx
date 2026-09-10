"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Phone, Sparkles, Building2, Layers } from "lucide-react";

interface TurnkeyQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}

export default function TurnkeyQuoteModal({
  isOpen,
  onClose,
  defaultPackage = "Turnkey Commercial Plant Setup",
}: TurnkeyQuoteModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [setupType, setSetupType] = useState(defaultPackage);
  const [capacity, setCapacity] = useState("200 - 500 kg/day");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello LaundryMall Team,\n\nI am interested in B2B Turnkey Setup Consultation:\n` +
      `• Name: ${name || "B2B Partner"}\n` +
      `• Business: ${businessName || "Commercial Laundry"}\n` +
      `• Phone: ${phone || "N/A"}\n` +
      `• Setup Type: ${setupType}\n` +
      `• Estimated Capacity: ${capacity}\n\n` +
      `Please connect me with a commercial plant layout engineer and share machinery packages with GST pricing.`
    );
    // Open LaundryMall WhatsApp Business hotline
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
    setIsSubmitted(true);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Turnkey Plant Setup & Consulting
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Request Commercial Laundry Quote
          </h2>
          <p className="text-xs md:text-sm text-white/85 mt-1 leading-relaxed">
            Get complete machine sizing, floor layout planning & factory-direct wholesale pricing.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Inquiry Received!</h3>
                <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Our Senior Commercial Plant Engineer will contact you within 2 hours with project blueprints and wholesale machinery rates.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-900 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-black transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Business / Hotel / Hospital Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Hospitality Laundry"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Setup Project Type
                  </label>
                  <select
                    value={setupType}
                    onChange={(e) => setSetupType(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Turnkey Commercial Plant Setup">Turnkey Commercial Plant</option>
                    <option value="Boutique Laundromat Franchise">Boutique Laundromat</option>
                    <option value="Hotel & Hospital On-Premise Laundry">Hotel / Hospital OPL</option>
                    <option value="Dry Cleaning & Wet Cleaning Unit">Dry Cleaning Setup</option>
                    <option value="Machinery Upgrade Only">Machinery Upgrade Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Daily Capacity Target
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <select
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="50 - 150 kg/day">50 - 150 kg/day</option>
                      <option value="200 - 500 kg/day">200 - 500 kg/day</option>
                      <option value="600 - 1500 kg/day">600 - 1,500 kg/day</option>
                      <option value="2000+ kg/day (Industrial)">2,000+ kg/day (Mega Plant)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Get Instant Quotation on WhatsApp
                </button>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  Request Call From Plant Engineer
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                🔒 100% Privacy. GST input credit consultation included at zero cost.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
