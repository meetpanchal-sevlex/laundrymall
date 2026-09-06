import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">LaundryMall</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The premier B2B store for dry cleaning machinery, chemicals, and supplies.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600 transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-blue-600 transition">All Products</Link></li>
              <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Sales</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support &amp; Policies</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-blue-600 transition">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-blue-600 transition">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-blue-600 transition">Returns &amp; Refunds</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-600 transition">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact</h4>
            <address className="text-sm not-italic space-y-2 text-gray-500">
              <p>Email: support@laundrymall.in</p>
              <p>Phone: +91 98790 00000</p>
              <p>Ahmedabad, Gujarat, India</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 mt-12 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} LaundryMall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
