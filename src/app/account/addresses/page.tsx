import Link from 'next/link';
import { MapPin, ArrowLeft, Plus } from 'lucide-react';
import { getCustomer } from '@/app/actions/auth';
import AddAddressForm from './AddAddressForm';

export const dynamic = 'force-dynamic';

export default async function AddressesPage() {
  const customer = await getCustomer();
  const addresses = customer?.addresses || [];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <div className="bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10">
        <Link href="/account"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
        <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Manage Addresses</h1>
      </div>

      <div className="p-4 space-y-4">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-lg font-black text-gray-800 mb-2">No Saved Addresses</h2>
            <p className="text-sm text-gray-500 mb-6">Add an address to make your checkout faster!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address: any) => (
              <div key={address.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900">{address.first_name} {address.last_name !== "." ? address.last_name : ""}</h3>
                  {address.phone && <span className="text-xs font-semibold text-gray-500">{address.phone}</span>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {address.address_1}
                  {address.address_2 && <>, {address.address_2}</>}
                  <br />
                  {address.city}, {address.province} - {address.postal_code}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" /> Add New Address
          </h3>
          <AddAddressForm />
        </div>
      </div>
    </div>
  );
}