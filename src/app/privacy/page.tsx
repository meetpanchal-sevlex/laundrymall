import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | LaundryMall",
  description: "Privacy Policy and Data Protection guidelines for LaundryMall e-commerce platform.",
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-1">Last Updated: September 2026</p>
            </div>
          </div>
        </div>

        <div className="prose prose-blue max-w-none text-gray-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong>LaundryMall</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to safeguarding your privacy and ensuring that your personal and business data is handled in a safe and responsible manner in compliance with the Information Technology Act, 2000 and applicable Indian data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal &amp; Business Identification:</strong> Name, business name, GST number (if applicable), billing address, shipping address, email address, and phone number.</li>
              <li><strong>Order &amp; Transaction Information:</strong> Products purchased, order amounts, payment status, and order identifiers. (Note: We do not store credit card numbers, debit card PINs, or netbanking passwords on our servers).</li>
              <li><strong>Technical Data:</strong> IP address, device type, operating system, and browsing activity collected automatically through standard secure cookies to maintain session continuity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We process your information for legitimate commercial purposes, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing, fulfilling, and dispatching your commercial orders.</li>
              <li>Generating tax invoices and regulatory GST documentation.</li>
              <li>Communicating order status, tracking updates, and critical operational notifications.</li>
              <li>Preventing fraudulent transactions and ensuring network security via rate limiting and firewall rules.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Payment Processing &amp; Third Parties</h2>
            <p>
              All online payments are securely processed through our certified Payment Aggregator partner, <strong>Razorpay</strong> (Razorpay Software Private Limited). Razorpay adheres to PCI-DSS Level 1 compliance standards. When paying online, your card, UPI, or netbanking details are encrypted directly via Razorpay&apos;s tokenized gateway.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention &amp; Security</h2>
            <p>
              We maintain commercial-grade encryption and access controls on our cloud infrastructure to protect against unauthorized access or alteration. Your information is retained only as long as necessary to fulfill orders and satisfy statutory tax and legal requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Grievance Redressal &amp; Contact Information</h2>
            <p>
              In accordance with Information Technology Act 2000 and rules made thereunder, if you have any questions, concerns, or grievances regarding this Privacy Policy, please contact our designated Grievance Officer:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-3 text-sm text-gray-700">
              <p><strong>Grievance Officer:</strong> Customer Privacy Team</p>
              <p><strong>Entity:</strong> LaundryMall Technologies</p>
              <p><strong>Email:</strong> support@laundrymall.in</p>
              <p><strong>Address:</strong> Ahmedabad, Gujarat, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
