import { NextRequest, NextResponse } from "next/server";
import { completeCartAction } from "@/app/actions/cart";

export async function POST(req: NextRequest) {
  try {
    // Razorpay sends payment details as form data in a POST request
    const formData = await req.formData();
    const razorpay_payment_id = formData.get("razorpay_payment_id");
    const razorpay_order_id = formData.get("razorpay_order_id");
    const razorpay_signature = formData.get("razorpay_signature");

    if (razorpay_payment_id) {
      console.log(`Razorpay Callback Received for Order: ${razorpay_order_id}`);
      
      // Attempt to force complete the cart on the Medusa backend
      // Even if this fails (e.g. webhook already did it), we want to redirect to success
      try {
        await completeCartAction();
      } catch (err: any) {
        console.warn("Cart completion in callback returned an error (might be completed by webhook):", err.message);
      }
    }

    // Redirect the user to the success page using an absolute URL
    return NextResponse.redirect(new URL("/checkout/success?source=callback", req.url));
  } catch (error) {
    console.error("Razorpay callback error:", error);
    return NextResponse.redirect(new URL("/checkout/success?error=callback_failed", req.url));
  }
}
