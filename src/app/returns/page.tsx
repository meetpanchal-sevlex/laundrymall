import React from "react";
import Link from "next/link";
import { RotateCcw, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Cancellation & Refund Policy | LaundryMall",
  description: "Cancellation, return, and refund policies for LaundryMall e-commerce orders.",
};

export default function ReturnsRefundsPage() {
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
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Cancellation &amp; Refund Policy</h1>
              <p className="text-sm text-gray-500 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Order Cancellation Policy</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 space-y-2">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span><strong>Before Dispatch:</strong> You may cancel your order at any time before it has been handed over to the courier partner by contacting our support team or via your account dashboard. A 100% full refund will be initiated immediately.</span>
              </p>
              <p className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>After Dispatch:</strong> Once an order is in transit or dispatched with the carrier, it cannot be directly cancelled. Customers may request a return upon delivery in accordance with our return eligibility criteria below.</span>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Return &amp; Replacement Eligibility (7 Days Window)</h2>
            <p>
              We accept returns or replacements within <strong>7 days</strong> of delivery under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The item received is damaged, defective, or non-functional upon initial unboxing.</li>
              <li>The incorrect product, size, or variant was shipped in error compared to your invoice.</li>
              <li>The product must be unused, in its original packaging, with all manuals, warranty cards, and intact manufacturer seals.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Non-Returnable Items</h2>
            <p>For safety, hygiene, and chemical stability standards, the following products cannot be returned once unsealed:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Opened liquid chemicals, spotters, and dry cleaning solvents.</li>
              <li>Custom-manufactured machinery or special-order electrical spare parts specifically commissioned for the buyer.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Refund Processing Timelines</h2>
            <p>
              Once a returned item is received at our facility and verified by our technical inspection team:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Prepaid Orders (Card / UPI / Netbanking via Razorpay):</strong> The refund will be credited back directly to the original source bank account / card within <strong>5 to 7 working days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> Refunds will be transferred via NEFT/IMPS bank transfer or UPI within 5 working days upon verification of the customer&apos;s nominated bank account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How to Initiate a Return</h2>
            <p>
              To initiate a return or replacement, please email us at <strong>support@laundrymall.in</strong> with your Order Number (#) and photographs or a video clip of the defect/damage. Our logistics team will arrange a reverse pickup.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
