import { test, expect } from '@playwright/test';

test.describe('Extreme Stress Test - Cart & UI Glitches', () => {
  // Use the live production site to test real Medusa latency
  const BASE_URL = 'https://laundrymall.in';

  test('Spam clicking Add To Cart and Remove', async ({ page }) => {
    // Listen for any hidden console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(`Console Error: ${msg.text()}`);
      }
    });
    page.on('pageerror', exception => {
      errors.push(`Uncaught Exception: ${exception.message}`);
    });

    await page.goto(BASE_URL);
    
    // Wait for the page to load products
    await page.waitForSelector('button[aria-label="Add to cart"]', { timeout: 15000 });

    // Find all 'Add to cart' buttons
    const addButtons = await page.$$('button[aria-label="Add to cart"]');
    expect(addButtons.length).toBeGreaterThan(0);

    console.log(`Found ${addButtons.length} add buttons. Slamming the first one 10 times in 1 second...`);
    
    // Spam click the first button 10 times with almost zero delay
    for (let i = 0; i < 10; i++) {
      await addButtons[0].click({ force: true });
      await page.waitForTimeout(50); // 50ms delay, superhuman speed
    }

    // Wait for the cart drawer to open and settle
    await page.waitForTimeout(3000);

    // Look for the "X" remove buttons in the cart
    const removeButtons = await page.$$('button:has(svg.lucide-x)');
    console.log(`Found ${removeButtons.length} items in the cart. Spamming the X button on all of them...`);

    // Spam click remove on every single item in the cart simultaneously
    for (const btn of removeButtons) {
       await btn.click({ force: true });
    }

    // Wait 5 seconds for background fetches to settle (testing for the ghost item bug)
    await page.waitForTimeout(5000);

    // Refresh the page
    await page.reload();
    await page.waitForTimeout(3000);

    // Check if the cart is truly empty
    const cartIcon = await page.$('text=Cart');
    await cartIcon?.click();
    await page.waitForTimeout(2000);

    const remainingItems = await page.$$('button:has(svg.lucide-x)');
    if (remainingItems.length > 0) {
      errors.push(`GHOST ITEM BUG: ${remainingItems.length} items magically reappeared in the cart after refresh!`);
    }

    // Output all found errors
    expect(errors).toEqual([]);
  });
});
