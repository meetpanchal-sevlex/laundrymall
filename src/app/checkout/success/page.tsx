import Link from 'next/link';
import { CheckCircle2, Truck, Package, ArrowRight, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {/* Floating Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-100/60 overflow-hidden">
          
          {/* Top Green Wave */}
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-400 pt-12 pb-16 flex flex-col items-center">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            {/* Check icon */}
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-green-300/50 ring-4 ring-white/50">
              <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-white mt-5 tracking-tight">Order Confirmed!</h1>
            <p className="text-green-100 font-medium mt-1.5 text-sm">Your order is on its way 🎉</p>
          </div>

          {/* Scalloped wave separator */}
          <div className="h-6 bg-gradient-to-r from-green-500 to-emerald-400 relative">
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-[50%]" />
          </div>

          {/* Body */}
          <div className="px-8 pt-2 pb-8">

            {/* Status Timeline */}
            <div className="flex items-center gap-2 my-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-[10px] font-bold text-green-600">Confirmed</span>
              </div>
              <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-green-400 to-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Packing</span>
              </div>
              <div className="flex-1 h-1 rounded-full bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Shipped</span>
              </div>
              <div className="flex-1 h-1 rounded-full bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Home className="w-4 h-4 text-gray-400" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">Delivered</span>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-200">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Estimated Delivery</p>
                  <p className="text-blue-600 font-semibold text-xs mt-0.5">3–5 Business Days</p>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm text-center leading-relaxed mb-8">
              We'll send you an email with tracking details as soon as your order ships. Thank you for trusting LaundryMall! 🙏
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link 
                href="/products"
                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#f43397] to-pink-500 hover:from-[#e02d8b] hover:to-pink-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-pink-200/50 active:scale-95"
              >
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/"
                className="flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-3.5 rounded-2xl border border-gray-200 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* LaundryMall branding below card */}
        <p className="text-center text-gray-400 text-xs font-medium mt-6">
          LaundryMall · India's B2B Laundry Wholesale Store
        </p>
      </div>
    </div>
  );
}