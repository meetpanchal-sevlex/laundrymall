import React from "react";
import Link from "next/link";
import { Building2, ArrowLeft, Award, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "About Us | LaundryMall",
  description: "About LaundryMall - India's premier B2B marketplace for dry cleaning machinery and laundry supplies.",
};

export default function AboutPage() {
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
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">About LaundryMall</h1>
              <p className="text-sm text-gray-500 mt-1">Empowering India&apos;s Dry Cleaning &amp; Laundry Industry</p>
            </div>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            <strong>LaundryMall</strong> is India&apos;s dedicated B2B e-commerce platform engineered specifically for commercial laundries, dry cleaners, institutions, hospitals, and hospitality groups.
          </p>
          <p>
            We bridge the gap between world-class machinery manufacturers, chemical formulators, and local laundry operators. By providing direct access to premium dry cleaning solvents, spotting agents, packaging supplies, and industrial washing equipment, LaundryMall enables businesses across India to operate with maximum efficiency and quality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 not-prose">
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <Award className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-base">Certified Quality</h3>
              <p className="text-xs text-gray-600 mt-1">Authentic industrial formulations and tested commercial machinery.</p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <Zap className="w-8 h-8 text-amber-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-base">High-Speed Dispatch</h3>
              <p className="text-xs text-gray-600 mt-1">Rapid logistics network covering all industrial corridors across India.</p>
            </div>
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <ShieldCheck className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-gray-900 text-base">Secure Commerce</h3>
              <p className="text-xs text-gray-600 mt-1">Encrypted digital payments and verified B2B GST tax invoices.</p>
            </div>
          </div>

          <p>
            Headquartered in Gujarat with regional distribution hubs, our mission is to drive digital transformation and supply chain transparency for over 100,000 laundry enterprises nationwide.
          </p>
        </div>
      </div>
    </div>
  );
}
