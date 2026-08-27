import Link from 'next/link';
import { Package, ArrowLeft, ChevronRight, Truck, CheckCircle2, Clock } from 'lucide-react';
import { getCustomerOrdersAction } from '@/app/actions/cart';
import Image from 'next/image';

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const { orders = [] } = await getCustomerOrdersAction();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10">
        <Link href="/account"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">My Orders</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 px-6 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-lg font-black text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-sm text-gray-500 mb-6">Your order history will appear here once you place your first order!</p>
            <Link href="/products" className="bg-[#f43397] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#e02d8b] transition shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const items = order.items || [];
              const total = order.total || order.summary?.total || 0;
              const status = order.status || "confirmed";
              const isPaid = order.payment_status === "captured" || order.payment_collections?.[0]?.status === "captured";

              return (
                <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-gray-500">Order ID</span>
                      <p className="font-bold text-sm text-gray-900">#{order.display_id || order.id.slice(-6)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isPaid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {isPaid ? "Paid" : "Cash on Delivery"}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 py-2">
                    {items.map((item: any) => (
                      <div key={item.id} className="py-2.5 flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image
                            src={item.thumbnail || item.variant?.product?.thumbnail || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=600&auto=format&fit=crop"}
                            alt={item.title || "Product"}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{Number(item.unit_price || 0).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500">Total Amount</span>
                      <p className="font-black text-base text-gray-900">₹{Number(total).toFixed(0)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg">
                      <Truck className="w-4 h-4" /> Processing
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}