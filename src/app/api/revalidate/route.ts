import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify this request actually came from Medusa (Basic Auth or Secret Header)
    const secret = request.headers.get('x-medusa-signature') || request.headers.get('x-revalidate-secret');
    const expectedSecret = process.env.MEDUSA_WEBHOOK_SECRET || process.env.REVALIDATE_SECRET;
    
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    
    // 2. Revalidate the entire product catalog and homepage instantly
    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/products/[id]', 'page');

    console.log(`✅ Cache invalidated successfully. Triggered by Medusa Event: ${payload.type || 'Manual'}`);

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating cache' }, { status: 500 });
  }
}
