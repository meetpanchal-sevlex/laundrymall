import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | LaundryMall",
  description: "Frequently Asked Questions regarding orders, shipping, GST invoices, and machinery on LaundryMall.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Do you provide GST tax invoices for business input credit?",
      a: "Yes! Every single commercial order placed on LaundryMall comes with an official GST-compliant tax invoice showing your registered business name and GSTIN, allowing you to claim full input tax credit (ITC)."
    },
    {
      q: "What payment methods are supported on LaundryMall?",
      a: "We accept all major online payment methods via Razorpay, including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards, Debit Cards, and Netbanking from all Indian banks. Cash on Delivery (COD) is also available for eligible supply items."
    },
    {
      q: "How long does delivery take across India?",
      a: "Standard supplies and chemicals typically arrive within 3 to 5 business days in metro cities, and 4 to 7 business days in regional areas. Heavy commercial machinery is shipped via dedicated surface transport and takes 5 to 9 business days."
    },
    {
      q: "Can I cancel an order after placing it?",
      a: "Yes, you may cancel your order at any time before it has been dispatched from our warehouse for a 100% full refund. Once dispatched, you may initiate a return within 7 days of delivery if the item is damaged or defective."
    },
    {
      q: "Are the chemicals and detergents commercial grade?",
      a: "Absolutely. All chemicals, stain spotters, emulsifiers, and solvents sold on LaundryMall are engineered specifically for industrial wet cleaning and dry cleaning operations."
    },
    {
      q: "How do I track my order status?",
      a: "Once your shipment is dispatched, you will receive an SMS and email notification with your carrier AWB number and a direct live tracking link. You can also track your order directly in your 'My Orders' dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h1>
              <p className="text-sm text-gray-500 mt-1">Quick answers to common questions about orders, shipping, and payments.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-base mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-100 text-center">
          <h3 className="font-semibold text-gray-900 text-sm">Still have questions?</h3>
          <p className="text-xs text-gray-600 mt-1 mb-4">Our support team is ready to help you with bulk orders and machinery queries.</p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
}
