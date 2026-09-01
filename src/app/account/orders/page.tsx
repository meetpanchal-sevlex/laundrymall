import Link from 'next/link';
import { Package, ArrowLeft, CheckCircle2, Clock, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { getCustomerOrdersAction } from '@/app/actions/cart';
import Image from 'next/image';

export const dynamic = "force-dynamic";

// Maps Medusa's raw fulfillment + payment statuses to a single user-facing status
function getOrderStatus(order: any): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  step: number; // 1-4 for the progress bar
} {
  const fulfillment = order.fulfillment_status || "not_fulfilled";
  const payment = order.payment_status || "not_paid";

  // Canceled
  if (order.status === "canceled") {
    return {
      label: "Canceled",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: <XCircle className="w-3.5 h-3.5" />,
      step: 0,
    };
  }

  // Delivered
  if (fulfillment === "delivered") {
    return {
      label: "Delivered",
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      step: 4,
    };
  }

  // Shipped / Awaiting delivery
  if (fulfillment === "shipped" || fulfillment === "partially_shipped") {
    return {
      label: "Shipped",
      color: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      icon: <Truck className="w-3.5 h-3.5" />,
      step: 3,
    };
  }

  // Fulfilled (Admin clicked "Create Fulfillment") but not shipped yet
  if (fulfillment === "fulfilled" || fulfillment === "partially_fulfilled") {
    return {
      label: "Processing Order",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      step: 2,
    };
  }

  // Payment captured but not yet fulfilled
  if (payment === "captured") {
    return {
      label: "Processing Order",
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: <ShoppingBag className="w-3.5 h-3.5" />,
      step: 2,
    };
  }

  // Payment authorized / pending — default state right after checkout
  return {
    label: "Payment Processing",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    icon: <Clock className="w-3.5 h-3.5" />,
    step: 1,
  };
}

const STEPS = ["Payment Processing", "Processing Order", "Shipped", "Delivered"];

export default async function OrdersPage() {
  const { orders = [] } = await getCustomerOrdersAction();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
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
            <Link href="/products" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const items = order.items || [];
              const total = order.total ?? order.summary?.total ?? 0;
              const status = getOrderStatus(order);
              const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric"
              });

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                  {/* Order Header */}
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <div>
                      <span className="text-xs text-gray-400">Order</span>
                      <p className="font-black text-sm text-gray-900">#{order.display_id || order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{orderDate}</p>
                    </div>
                    {/* Status Badge */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.color} ${status.bgColor} ${status.borderColor}`}>
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  {/* Progress Bar — only show for active (non-canceled) orders */}
                  {status.step > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        {STEPS.map((step, index) => {
                          const stepNumber = index + 1;
                          const isCompleted = status.step >= stepNumber;
                          const isCurrent = status.step === stepNumber;
                          return (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                                isCompleted
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-gray-300 text-gray-400"
                              } ${isCurrent ? "ring-2 ring-blue-200 ring-offset-1" : ""}`}>
                                {isCompleted ? "✓" : stepNumber}
                              </div>
                              <span className={`text-[9px] mt-1 text-center leading-tight font-semibold ${
                                isCompleted ? "text-blue-600" : "text-gray-400"
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {/* Connector line */}
                      <div className="relative h-0.5 bg-gray-200 mx-3 -mt-7 mb-6 rounded-full">
                        <div
                          className="absolute left-0 top-0 h-0.5 bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${((status.step - 1) / (STEPS.length - 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="divide-y divide-gray-100 px-4">
                    {items.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center gap-3">
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
                          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ₹{Number(item.unit_price ?? 0).toFixed(0)}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                          ₹{Number((item.unit_price ?? 0) * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                      <span className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? "s" : ""}</span>
                      <p className="font-black text-base text-gray-900">₹{Number(total).toFixed(0)}</p>
                    </div>
                    <span className="text-xs text-gray-400 capitalize">
                      {(order.payment_status || "").replace(/_/g, " ")}
                    </span>
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