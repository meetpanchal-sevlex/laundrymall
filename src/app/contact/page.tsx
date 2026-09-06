import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ArrowLeft, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Contact Us | LaundryMall",
  description: "Get in touch with LaundryMall customer support and commercial sales team.",
};

export default function ContactUsPage() {
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
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
              <p className="text-sm text-gray-500 mt-1">We are here to assist with your commercial equipment and supply inquiries.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Operating Office &amp; Hub</h3>
                <p className="text-sm text-gray-600 mt-1">
                  LaundryMall Technologies<br />
                  Commercial Tower, SG Highway<br />
                  Ahmedabad, Gujarat - 380054, India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Email Inquiries</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Support: <a href="mailto:support@laundrymall.in" className="text-blue-600 hover:underline">support@laundrymall.in</a><br />
                  Sales: <a href="mailto:info@laundrymall.in" className="text-blue-600 hover:underline">info@laundrymall.in</a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Customer Helpline</h3>
                <p className="text-sm text-gray-600 mt-1">
                  +91 98790 00000 / +91 79 4000 0000<br />
                  Available Mon-Sat for B2B dispatch inquiries
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-white rounded-xl shadow-xs text-blue-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Working Hours</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Monday to Saturday: 9:00 AM – 7:00 PM IST<br />
                  Sunday: Closed (Online orders processed next business day)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Have a Wholesale Requirement?</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              If you operate a commercial dry cleaning chain, institutional laundry, or hospital wash facility, our technical sales engineers can provide customized bulk quotation sheets and machinery layout drawings.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:support@laundrymall.in?subject=Wholesale%20Machinery%20Inquiry"
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                Send Direct Email Inquiry
              </a>
              <Link
                href="/products"
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50 transition"
              >
                Browse Online Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
