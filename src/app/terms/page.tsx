import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | LaundryMall",
  description: "Terms and Conditions of Service for LaundryMall e-commerce platform.",
};

export default function TermsPage() {
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
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Terms &amp; Conditions</h1>
              <p className="text-sm text-gray-500 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By accessing or using <strong>LaundryMall</strong> (&quot;laundrymall.in&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use or access our services. These terms apply to all visitors, commercial buyers, and users of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Commercial &amp; B2B Offerings</h2>
            <p>
              LaundryMall is an online platform specializing in commercial dry cleaning machinery, laundry equipment, industrial detergents, chemical formulations, and operational accessories. All product specifications, dimensions, and capacities listed on the website are provided for commercial evaluation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pricing &amp; Taxes</h2>
            <p>
              All prices displayed on the website are listed in Indian National Rupees (INR) and are inclusive or exclusive of GST as indicated on the checkout invoice. We reserve the right to revise prices, product descriptions, or specifications at any time without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Orders, Payments &amp; Invoicing</h2>
            <p>
              Orders placed on LaundryMall constitute a binding commercial purchase order. Payment may be made via Razorpay (Credit/Debit Card, Netbanking, UPI, Wallets) or Cash on Delivery (COD) where eligible. We reserve the right to cancel or decline any order in the event of stock unavailability, pricing typographical errors, or unverified contact details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p>
              All trademarks, product designs, software code, graphic elements, and brand assets on laundrymall.in are the intellectual property of LaundryMall Technologies or respective original equipment manufacturers. Unauthorized reproduction or scraping is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted under applicable law, LaundryMall shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use machinery or products sold through the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Ahmedabad, Gujarat, India</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
