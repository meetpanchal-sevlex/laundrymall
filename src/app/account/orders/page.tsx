import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10">
        <Link href="/account"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">My Orders</h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-24 px-6 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-lg font-black text-gray-800 mb-2">No Orders Yet</h2>
        <p className="text-sm text-gray-500 mb-6">Your order history will appear here once you place your first order!</p>
        <Link href="/products" className="bg-[#f43397] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#e02d8b] transition">
          Start Shopping
        </Link>
      </div>
    </div>
  );
}