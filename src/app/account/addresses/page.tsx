import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10">
        <Link href="/account"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Manage Addresses</h1>
      </div>
      <div className="flex flex-col items-center justify-center mt-24 px-6 text-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-10 h-10 text-blue-400" />
        </div>
        <h2 className="text-lg font-black text-gray-800 mb-2">No Saved Addresses</h2>
        <p className="text-sm text-gray-500 mb-6">Addresses you enter during checkout will be saved here for quick ordering next time.</p>
        <Link href="/checkout" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
          Go to Checkout
        </Link>
      </div>
    </div>
  );
}