"use client";

import { useState } from "react";
import { addAddressAction } from "@/app/actions/addresses";

export default function AddAddressForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const res = await addAddressAction(formData);
    
    if (res.error) {
      setError(res.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm font-medium p-3 bg-red-50 rounded-lg">{error}</div>}
      
      <div className="grid grid-cols-2 gap-3">
        <input name="first_name" required placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
        <input name="last_name" placeholder="Last Name (Optional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      </div>
      
      <input name="phone" required type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      
      <input name="address_1" required placeholder="House No, Building, Street" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      
      <input name="address_2" placeholder="Area, Landmark (Optional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      
      <div className="grid grid-cols-2 gap-3">
        <input name="postal_code" required placeholder="Pincode" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
        <input name="city" required placeholder="City" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      </div>
      
      <input name="province" required placeholder="State" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-600 outline-none text-sm" />
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#f43397] hover:bg-[#e02d8b] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}