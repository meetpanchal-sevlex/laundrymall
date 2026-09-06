import React from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Clock, MapPin, PackageCheck } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | LaundryMall",
  description: "Shipping and Delivery guidelines, transit timelines, and dispatch policies for LaundryMall.",
};

export default function ShippingPolicyPage() {
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
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shipping &amp; Delivery Policy</h1>
              <p className="text-sm text-gray-500 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">24-48 Hours</h3>
            <p className="text-xs text-gray-600 mt-1">Standard dispatch turnaround</p>
          </div>
          <div className="p-4 rounded-xl bg-green-50 border border-green-100">
            <MapPin className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">Pan-India Reach</h3>
            <p className="text-xs text-gray-600 mt-1">Direct shipping across all states</p>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <PackageCheck className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900 text-sm">Insured Transit</h3>
            <p className="text-xs text-gray-600 mt-1">Commercial logistics partners</p>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Order Processing &amp; Dispatch Timeline</h2>
            <p>
              All confirmed orders are processed and packed at our fulfillment centers within <strong>24 to 48 working hours</strong> (excluding Sundays and national holidays) after payment authorization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Estimated Delivery Times</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Tier 1 &amp; Metro Cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad):</strong> 3 to 5 business days.</li>
              <li><strong>Tier 2 &amp; Tier 3 Cities / Regional Towns:</strong> 4 to 7 business days.</li>
              <li><strong>Heavy Industrial Machinery &amp; Bulk Chemicals:</strong> Shipped via specialized surface freight carriers; transit time typically ranges between 5 to 9 business days depending on destination location.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Shipping Charges</h2>
            <p>
              Shipping fees are calculated dynamically at checkout based on the total weight, volumetric dimensions of the shipment, and the delivery destination pin code. Standard shipping rates or free delivery thresholds (if applicable) are clearly displayed during checkout prior to payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Order Tracking &amp; Notifications</h2>
            <p>
              Once your shipment is handed over to our courier partner (Delhivery, Blue Dart, V-Trans, or Safexpress), you will receive an automated tracking link and consignment AWB number via email and SMS to track your package in real-time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Inspection Upon Delivery</h2>
            <p>
              We advise all business customers to inspect the outer packaging of machinery and chemical drums prior to signing the delivery acknowledgment (POD). If visible physical damage is detected, please endorse the carrier receipt and notify us within 24 hours at <strong>support@laundrymall.in</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
