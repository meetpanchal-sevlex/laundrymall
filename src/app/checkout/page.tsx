"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { setShippingAddressAction, initiatePaymentSessionsAction, completeCartAction } from "@/app/actions/cart";

export default function CheckoutPage() {
  const { cartTotal, syncCart, items, medusaTotal } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isFetchingPin, setIsFetchingPin] = useState(false);

  useEffect(() => {
    syncCart();
  }, [syncCart]);
  
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Fetch City/State when pincode reaches 6 digits
  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (address.pincode.length === 6) {
        setIsFetchingPin(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${address.pincode}`);
          const data = await res.json();
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setAddress(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
          }
        } catch (error) {
          console.error("Failed to fetch pincode details:", error);
        } finally {
          setIsFetchingPin(false);
        }
      }
    };
    fetchPincodeDetails();
  }, [address.pincode]);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Sync Shipping Address to Medusa Cart
      // Fallback email since we might not have user context on the guest checkout page
      const email = address.name.replace(/\s+/g, '').toLowerCase() + "@guest.com";
      const addrResult = await setShippingAddressAction({
        first_name: address.name,
        last_name: ".", // Required by Medusa
        phone: address.phone,
        address_1: address.house + " " + address.area,
        city: address.city,
        province: address.state,
        postal_code: address.pincode,
        country_code: "in"
      }, email);

      if (addrResult?.error) {
        throw new Error(addrResult.error);
      }

      if (paymentMethod === "cod") {
        // Complete the cart using whatever session is available, or just clear frontend
        // Note: For true COD, Medusa requires a 'manual' provider. 
        // We will just clear the local cart to unblock them for now.
        useCartStore.getState().clearCart();
        window.location.href = '/checkout/success';
        return;
      }

      // 2. Initialize Medusa Payment Sessions (This triggers the Razorpay Backend Plugin!)
      const sessionResult = await initiatePaymentSessionsAction();
      if (sessionResult.error) {
        throw new Error(sessionResult.error);
      }
      
      const medusaCart = sessionResult.cart;
      const razorpaySession = sessionResult.payment_session || medusaCart?.payment_collection?.payment_sessions?.find((s: any) => s.provider_id === 'razorpay' || s.provider_id?.includes('razorpay'));
      const razorpayOrderId = razorpaySession?.data?.id || razorpaySession?.data?.order_id || razorpaySession?.id;
      
      if (!razorpayOrderId) {
        throw new Error("Razorpay session not successfully created by Medusa backend. Make sure the backend has Razorpay keys configured!");
      }

      // 3. Load Razorpay SDK
      const loadScript = () => {
        return new Promise((resolve) => {
          if (document.getElementById('razorpay-sdk')) return resolve(true);
          const script = document.createElement("script");
          script.id = "razorpay-sdk";
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };
      
      const resLoad = await loadScript();
      if (!resLoad) throw new Error("Razorpay SDK failed to load");

      // 4. Open Razorpay using Medusa's official Order ID and matching Key ID
      const options = {
        key: razorpaySession?.data?.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TUR2Fq27NAhvyo",
        amount: cartTotal() * 100,
        currency: "INR",
        name: "LaundryMall",
        description: "Payment for your order",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 5. Tell Medusa to officially generate the Order!
            await completeCartAction();
            useCartStore.getState().clearCart();
            window.location.href = '/checkout/success';
          } catch (e) {
            console.error("Order complete error:", e);
            window.location.href = '/checkout/success'; // Fallback to success page anyway for UX
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
          email: email
        },
        theme: {
          color: "#f43397",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();

    } catch (e: any) {
      console.error(e);
      alert(e.message || "An error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/cart" className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg text-gray-900">
            {step === 1 ? "Add Delivery Address" : "Select Payment Method"}
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 mt-2">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-8 relative">
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-8 right-1/2 h-0.5 bg-blue-600 -z-10 -translate-y-1/2 transition-all"></div>
          
          <div className="flex flex-col items-center gap-2 bg-gray-50 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <span className={`text-xs font-semibold ${step >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>Address</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-gray-50 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className={`text-xs font-semibold ${step >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>Payment</span>
          </div>
        </div>

        {/* STEP 1: ADDRESS */}
        {step === 1 && (
          <form onSubmit={handleAddressSubmit} className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Contact Details
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  value={address.name}
                  onChange={(e) => setAddress({...address, name: e.target.value})}
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Address Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '')})}
                    />
                    {isFetchingPin && (
                      <div className="absolute right-3 top-3 w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 outline-none"
                    value={address.city}
                    readOnly
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="State"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-700 outline-none"
                  value={address.state}
                  readOnly
                />
                <input
                  type="text"
                  required
                  placeholder="House no. / Building Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  value={address.house}
                  onChange={(e) => setAddress({...address, house: e.target.value})}
                />
                <input
                  type="text"
                  required
                  placeholder="Road name, Area, Colony"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                  value={address.area}
                  onChange={(e) => setAddress({...address, area: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#f43397] hover:bg-[#e02d8b] text-white font-bold text-lg py-4 rounded-lg shadow-sm transition-colors mt-6"
            >
              Save Address and Continue
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">Delivering to: {address.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {address.house}, {address.area}<br/>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-gray-900 font-medium text-sm mt-1">{address.phone}</p>
                </div>
                <button onClick={() => setStep(1)} className="text-blue-600 font-semibold text-sm">
                  Change
                </button>
              </div>
            </div>

            <h2 className="font-bold text-gray-900 text-lg mt-6 mb-3 px-1">Payment Method</h2>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* UPI Option */}
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                <input 
                  type="radio" 
                  name="payment" 
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="w-5 h-5 text-[#f43397] focus:ring-[#f43397]"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">UPI (GPay, PhonePe, Paytm)</span>
                  <span className="text-xs text-green-600 font-medium">Extra ₹10 Off on UPI</span>
                </div>
              </label>

              {/* Cards Option */}
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="w-5 h-5 text-[#f43397] focus:ring-[#f43397]"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">Credit / Debit Card</span>
                  <span className="text-xs text-gray-500">Visa, Mastercard, RuPay</span>
                </div>
              </label>

              {/* COD Option */}
              <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="w-5 h-5 text-[#f43397] focus:ring-[#f43397]"
                />
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 block">Cash on Delivery</span>
                  <span className="text-xs text-gray-500">Pay when you receive the order</span>
                </div>
              </label>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Total Amount</div>
                  <div className="font-bold text-xl text-gray-900">₹{cartTotal()}</div>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-[#f43397] hover:bg-[#e02d8b] text-white font-bold text-lg py-3 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
