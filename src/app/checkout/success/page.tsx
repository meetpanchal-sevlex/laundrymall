import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Truck } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden text-center">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-400 to-green-600 p-8 flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-white">Order Confirmed!</h1>
          <p className="text-green-50 font-medium mt-2">Thank you for shopping with LaundryMall</p>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <div className="space-y-4 text-left mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Estimated Delivery</p>
                <p className="text-xs text-gray-500 mt-0.5">3-5 Business Days</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            We've received your order and are getting it ready to be shipped. We will send you an email with tracking details shortly!
          </p>

          <div className="space-y-3">
            <Link 
              href="/products"
              className="block w-full bg-[#f43397] hover:bg-[#e02d8b] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/"
              className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-xl border-2 border-gray-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}