"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, MapPin } from "lucide-react";
import { prepareCheckoutAction, prepareCODCheckoutAction, completeCartAction, forceNewCartAction } from "@/app/actions/cart";
import { getCustomer } from "@/app/actions/auth";

export default function CheckoutPage() {
  const { cart, clearCart, removeItem, updateQuantity, isSyncing } = useCart();
  const medusaTotal = cart.medusaTotal;
  const items = cart.items;
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isFetchingPin, setIsFetchingPin] = useState(false);

  const [address, setAddress] = useState({
    email: "",
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    house: "",
    area: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  useEffect(() => {
    
    // Attempt to auto-fill saved address for logged-in users
    const fetchSavedAddress = async () => {
      try {
        const customer = await getCustomer();
        if (customer && customer.addresses && customer.addresses.length > 0) {
          setSavedAddresses(customer.addresses);
          setIsAddingNew(false);
          const saved = customer.addresses[0]; // Use first saved address
          setAddress({
            email: customer.email || "",
            name: `${saved.first_name || ''} ${saved.last_name && saved.last_name !== '.' ? saved.last_name : ''}`.trim(),
            phone: saved.phone || "",
            pincode: saved.postal_code || "",
            city: saved.city || "",
            state: saved.province || "",
            house: saved.address_1 || "",
            area: saved.address_2 || "",
          });
        } else {
          setIsAddingNew(true);
        }
      } catch (err) {
        console.warn("Failed to fetch saved address", err);
        setIsAddingNew(true);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    
    fetchSavedAddress();
  }, []);

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

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return false;

    const lowerEmail = email.toLowerCase();
    const invalidEndings = [
      "@gmail.co",
      "@gmai.com",
      "@gamil.com",
      "@gmail.con",
      "@yahoo.co",
      "@yahoo.con",
      "@hotmail.co"
    ];
    
    for (const ending of invalidEndings) {
      if (lowerEmail.endsWith(ending)) return false;
    }
    
    if (lowerEmail.endsWith(".")) return false;
    return true;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.email || !isValidEmail(address.email)) {
      alert("Please provide a valid email address (e.g., name@gmail.com)");
      return;
    }
    setStep(2);
  };

  const handleSelectSavedAddress = (index: number) => {
    setSelectedAddressIndex(index);
    const saved = savedAddresses[index];
    setAddress((prev) => ({
      ...prev,
      name: `${saved.first_name || ''} ${saved.last_name && saved.last_name !== '.' ? saved.last_name : ''}`.trim(),
      phone: saved.phone || "",
      pincode: saved.postal_code || "",
      city: saved.city || "",
      state: saved.province || "",
      house: saved.address_1 || "",
      area: saved.address_2 || "",
    }));
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (!isValidEmail(address.email)) {
        alert("Please provide a valid and complete email address");
        setIsProcessing(false);
        return;
      }
      
      const email = address.email.toLowerCase().trim();
      const shippingAddress = {
        first_name: address.name,
        last_name: ".",
        address_1: address.house,
        address_2: address.area,
        city: address.city,
        province: address.state,
        postal_code: address.pincode,
        country_code: "in",
        phone: address.phone
      };

      if (paymentMethod === "cod") {
        const codResult = await prepareCODCheckoutAction(shippingAddress, email);
        if (codResult.error) {
          throw new Error(codResult.error);
        }
        // CRITICAL: Must call completeCartAction to register the order in Medusa.
        // Without this, the cart stays as "not_paid" and no order is created.
        await completeCartAction();
        clearCart();
        router.push(`/checkout/success`);
        return;
      }

      // 1. Single high-speed batch action to sync address and get Razorpay Order ID
      const checkoutResult = await prepareCheckoutAction(shippingAddress, email);
      if (checkoutResult.error || !checkoutResult.razorpayOrderId) {
        throw new Error(checkoutResult.error || "Failed to initialize payment session with backend");
      }
      
      const razorpayOrderId = checkoutResult.razorpayOrderId;
      const matchingKeyId = checkoutResult.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TUR2Fq27NAhvyo";

      // 2. Open Razorpay using Medusa's official Order ID and amount.
      // IMPORTANT: We use the amount from the Medusa payment collection (the source of truth),
      // NOT cart.medusaTotal (which is the client-side optimistic value and can differ).
      const verifiedAmount = checkoutResult.paymentCollection?.amount ?? cart.medusaTotal;
      const options = {
        key: matchingKeyId,
        amount: verifiedAmount * 100,
        currency: "INR",
        name: "LaundryMall",
        description: "Payment for your order",
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            const result = await completeCartAction();
            if (result.error) {
              setIsProcessing(false);
              alert("Payment was captured, but order creation failed: " + result.error);
              return;
            }
            clearCart();
            router.push('/checkout/success');
          } catch (e: any) {
            setIsProcessing(false);
            console.error("Order complete error:", e);
            alert("Payment was captured, but order creation failed: " + e.message);
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => step === 2 ? setStep(1) : router.back()} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">
            {step === 1 ? "Delivery Address" : "Payment Method"}
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
          <div className="space-y-4">
            {isLoadingAddress ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
                <div className="h-20 bg-gray-100 rounded-lg"></div>
              </div>
            ) : (
              <>
                {!isAddingNew && savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="font-bold text-gray-900 text-lg mb-3">Saved Addresses</h2>
                    {savedAddresses.map((addr, idx) => (
                  <label key={addr.id} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-blue-300">
                    <input 
                      type="radio" 
                      name="saved_address" 
                      className="mt-1 w-4 h-4 text-blue-600"
                      checked={selectedAddressIndex === idx}
                      onChange={() => handleSelectSavedAddress(idx)}
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{addr.first_name} {addr.last_name !== "." ? addr.last_name : ""}</h3>
                      <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                        {addr.address_1}, {addr.address_2}<br/>
                        {addr.city}, {addr.province} - {addr.postal_code}
                      </p>
                      {addr.phone && <p className="text-gray-900 font-medium text-sm mt-1">{addr.phone}</p>}
                    </div>
                  </label>
                ))}

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-[#f43397] hover:bg-[#e02d8b] text-white font-bold text-lg py-4 rounded-lg shadow-sm transition-colors mt-6"
                >
                  Deliver Here
                </button>

                <div className="pt-4 border-t border-gray-200 mt-6">
                  <button 
                    onClick={() => setIsAddingNew(true)}
                    className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-lg border border-blue-100"
                  >
                    + Add New Address
                  </button>
                </div>
              </div>
            )}

            {isAddingNew && (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                {savedAddresses.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to saved addresses
                  </button>
                )}
                
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Contact Details
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none"
                      value={address.email}
                      onChange={(e) => setAddress({...address, email: e.target.value})}
                    />
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
            </>
            )}
          </div>
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

            {/* Order Summary — shows exactly what Medusa says is in the cart */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-gray-900">Order Summary ({items.length} items)</h2>
                <span className="font-black text-gray-900">₹{cart.medusaTotal}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={item.lineItemId} className="flex justify-between items-center px-4 py-2.5 text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-900 font-medium">{item.name}</span>
                      <span className="text-gray-500 text-xs">₹{item.price.toLocaleString('en-IN')} / item</span>
                    </div>
                    <div className="flex items-center gap-6">
                      {/* Qty Controls */}
                      <div className="flex items-center gap-2 bg-gray-50 rounded-full border border-gray-200 p-0.5">
                        <button
                          disabled={isSyncing}
                          onClick={() => item.quantity === 1 
                            ? removeItem(item.lineItemId) 
                            : updateQuantity(item.lineItemId, item.quantity - 1)
                          }
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 font-bold hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center tabular-nums text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          disabled={isSyncing}
                          onClick={() => updateQuantity(item.lineItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-gray-600 font-bold hover:bg-white hover:shadow-sm transition-all disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <span className="font-bold text-gray-900 w-16 text-right">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* Wrong items? Nuclear reset option */}
            <div className="text-center">
              <button
                onClick={async () => {
                  if (confirm("This will clear your cart and start fresh. Are you sure?")) {
                    await forceNewCartAction();
                    clearCart();
                    router.push("/");
                  }
                }}
                className="text-xs text-gray-400 underline hover:text-red-500"
              >
                Wrong items? Reset cart
              </button>
            </div>

            <h2 className="font-bold text-gray-900 text-lg px-1">Payment Method</h2>
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
                  <div className="font-bold text-xl text-gray-900">₹{cart.medusaTotal}</div>
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
