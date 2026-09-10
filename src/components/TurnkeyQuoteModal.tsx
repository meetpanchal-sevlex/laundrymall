"use client";

import React, { useState } from "react";
import { X, CheckCircle2, MessageCircle, Phone, Sparkles, Building2, FileText, Loader2 } from "lucide-react";

interface TurnkeyQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPackage?: string;
}

export default function TurnkeyQuoteModal({
  isOpen,
  onClose,
}: TurnkeyQuoteModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Save lead to /api/quote backend (Upstash Redis + persistent log)
  const saveLead = async (source: "whatsapp" | "callback_request") => {
    try {
      await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          businessName: businessName.trim() || undefined,
          notes: notes.trim() || undefined,
          source,
        }),
      });
    } catch (err) {
      console.error("Non-fatal: failed to persist lead:", err);
    }
  };

  const handleWhatsAppInquiry = async () => {
    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Please enter your name and phone number");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    // 1. Save lead to backend database
    await saveLead("whatsapp");

    // 2. Format WhatsApp message
    const targetWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919574707385";
    const text = encodeURIComponent(
      `Hello LaundryMall Team,\n\nI am interested in a Commercial Laundry / Machinery Quote:\n` +
      `• Name: ${name.trim()}\n` +
      `• Phone: ${phone.trim()}\n` +
      (businessName.trim() ? `• Business / Organization: ${businessName.trim()}\n` : "") +
      (notes.trim() ? `• Requirements: ${notes.trim()}\n` : "") +
      `\nPlease share pricing, catalog, and connect me with a technical sales engineer.`
    );

    // 3. Open WhatsApp chat with LaundryMall business
    window.open(`https://wa.me/${targetWhatsApp}?text=${text}`, "_blank");

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMessage("Please enter your name and phone number");
      return;
    }
    setErrorMessage("");
    setIsSubmitting(true);

    // Save lead to backend database
    await saveLead("callback_request");

    setIsSubmitting(false);
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
            Turnkey Plant Setup & Wholesale
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Request Commercial Laundry Quote
          </h2>
          <p className="text-xs md:text-sm text-white/85 mt-1 leading-relaxed">
            Get factory-direct wholesale pricing, machine sizing & setup consultation.
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
                <h3 className="text-xl font-bold text-gray-900">Quote Request Saved!</h3>
                <p className="text-sm text-gray-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-900">{name}</span>. Your request has been sent to the LaundryMall sales engineering team. We will call you at <span className="font-semibold text-gray-900">{phone}</span> shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="bg-gray-900 text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-black transition cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitRequest} className="space-y-3.5">
              {errorMessage && (
                <div className="bg-red-50 text-red-600 text-xs px-3.5 py-2 rounded-xl border border-red-100 font-semibold">
                  {errorMessage}
                </div>
              )}

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
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
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
                    className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Business / Hotel / Hospital Name <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Apex Hospitality Laundry"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Requirements / Notes <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Commercial Washers, Turnkey Plant, Chemicals"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageCircle className="w-5 h-5 fill-current" />
                  )}
                  Get Instant Quotation on WhatsApp
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60 text-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                  Request Call From Plant Engineer
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center pt-1">
                🔒 100% Privacy. Lead details are securely sent to LaundryMall B2B team.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
