# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stress.spec.ts >> Extreme Stress Test - Cart & UI Glitches >> Spam clicking Add To Cart and Remove
- Location: tests\stress.spec.ts:7:7

# Error details

```
Error: elementHandle.click: Element is outside of the viewport
Call log:
  - attempting click action
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "LaundryMall" [ref=e7] [cursor=pointer]:
        - /url: /
      - generic [ref=e10]:
        - textbox "Search products..." [ref=e11]
        - button [ref=e12]
      - generic [ref=e16]:
        - link "Sign In" [ref=e17] [cursor=pointer]:
          - /url: /login
        - button "Cart 5" [ref=e22]:
          - generic [ref=e27]: Cart
          - generic [ref=e28]: "5"
    - list [ref=e31]:
      - listitem [ref=e32]:
        - link "Home" [ref=e33] [cursor=pointer]:
          - /url: /
      - listitem [ref=e34]:
        - link "All Products" [ref=e35] [cursor=pointer]:
          - /url: /products
      - listitem [ref=e36]:
        - link "Machinery" [ref=e37] [cursor=pointer]:
          - /url: /products?category=Machinery
      - listitem [ref=e38]:
        - link "Chemicals" [ref=e39] [cursor=pointer]:
          - /url: /products?category=Detergent%20Chemicals
      - listitem [ref=e40]:
        - link "Packaging" [ref=e41] [cursor=pointer]:
          - /url: /products?category=Packaging%20Materials
      - listitem [ref=e42]:
        - link "Accessories" [ref=e43] [cursor=pointer]:
          - /url: /products?category=Accessories
      - listitem [ref=e44]:
        - link "Technology" [ref=e45] [cursor=pointer]:
          - /url: /products?category=Technology
  - main [ref=e46]:
    - generic [ref=e48]:
      - generic [ref=e50]:
        - link "Featured Wholesale Machinery Up to 30% off on bulk orders Shop Now ⚙️" [ref=e51] [cursor=pointer]:
          - /url: /products
          - generic [ref=e52]:
            - paragraph [ref=e53]: Featured
            - heading "Wholesale Machinery" [level=3] [ref=e54]
            - paragraph [ref=e55]: Up to 30% off on bulk orders
            - generic [ref=e56]: Shop Now
          - generic [ref=e59]: ⚙️
        - link "Featured Eco Chemicals ISO certified, trusted quality Shop Now 🧪" [ref=e60] [cursor=pointer]:
          - /url: /products
          - generic [ref=e61]:
            - paragraph [ref=e62]: Featured
            - heading "Eco Chemicals" [level=3] [ref=e63]
            - paragraph [ref=e64]: ISO certified, trusted quality
            - generic [ref=e65]: Shop Now
          - generic [ref=e68]: 🧪
        - link "Featured Smart Packaging Branded packaging solutions Shop Now 📦" [ref=e69] [cursor=pointer]:
          - /url: /products
          - generic [ref=e70]:
            - paragraph [ref=e71]: Featured
            - heading "Smart Packaging" [level=3] [ref=e72]
            - paragraph [ref=e73]: Branded packaging solutions
            - generic [ref=e74]: Shop Now
          - generic [ref=e77]: 📦
      - generic [ref=e79]:
        - link "🏪 All" [ref=e80] [cursor=pointer]:
          - /url: /products
          - generic [ref=e81]: 🏪
          - generic [ref=e82]: All
        - link "⚙️ Machinery" [ref=e83] [cursor=pointer]:
          - /url: /products?category=Machinery
          - generic [ref=e84]: ⚙️
          - generic [ref=e85]: Machinery
        - link "🧪 Chemicals" [ref=e86] [cursor=pointer]:
          - /url: /products?category=Detergent+Chemicals
          - generic [ref=e87]: 🧪
          - generic [ref=e88]: Chemicals
        - link "📦 Packaging" [ref=e89] [cursor=pointer]:
          - /url: /products?category=Packaging+Materials
          - generic [ref=e90]: 📦
          - generic [ref=e91]: Packaging
        - link "🔧 Accessories" [ref=e92] [cursor=pointer]:
          - /url: /products?category=Accessories
          - generic [ref=e93]: 🔧
          - generic [ref=e94]: Accessories
        - link "💻 Technology" [ref=e95] [cursor=pointer]:
          - /url: /products?category=Technology
          - generic [ref=e96]: 💻
          - generic [ref=e97]: Technology
      - generic [ref=e98]:
        - generic [ref=e99]:
          - heading "Best Sellers" [level=2] [ref=e103]
          - link "See All" [ref=e104] [cursor=pointer]:
            - /url: /products
        - generic [ref=e107]:
          - link "12/18 Packaging Bag Add to cart General 12/18 Packaging Bag ₹290" [ref=e109] [cursor=pointer]:
            - /url: /products/prod_01M0DPY6YPHDDH4CY9KR9502RP
            - generic [ref=e110]:
              - img "12/18 Packaging Bag" [ref=e111]
              - button "Add to cart" [ref=e112]
            - generic [ref=e117]:
              - paragraph [ref=e118]: General
              - heading "12/18 Packaging Bag" [level=3] [ref=e119]
              - generic [ref=e120]: ₹290
          - link "14/16 Packaging Bag Add to cart General 14/16 Packaging Bag ₹290" [ref=e123] [cursor=pointer]:
            - /url: /products/prod_01M0DPYHVZP6M7XB9PEYQXX4CT
            - generic [ref=e124]:
              - img "14/16 Packaging Bag" [ref=e125]
              - button "Add to cart" [ref=e126]
            - generic [ref=e131]:
              - paragraph [ref=e132]: General
              - heading "14/16 Packaging Bag" [level=3] [ref=e133]
              - generic [ref=e134]: ₹290
          - link "Arrow Tag gun Add to cart General Arrow Tag gun ₹530" [ref=e137] [cursor=pointer]:
            - /url: /products/prod_01M0DPYX82TDDJDKCKKP57YFEQ
            - generic [ref=e138]:
              - img "Arrow Tag gun" [ref=e139]
              - button "Add to cart" [ref=e140]
            - generic [ref=e145]:
              - paragraph [ref=e146]: General
              - heading "Arrow Tag gun" [level=3] [ref=e147]
              - generic [ref=e148]: ₹530
          - link "BATCH Add to cart General BATCH ₹120" [ref=e151] [cursor=pointer]:
            - /url: /products/prod_01M0DPZ84ETYPE8270E4B9ZN7R
            - generic [ref=e152]:
              - img "BATCH" [ref=e153]
              - button "Add to cart" [ref=e154]
            - generic [ref=e159]:
              - paragraph [ref=e160]: General
              - heading "BATCH" [level=3] [ref=e161]
              - generic [ref=e162]: ₹120
          - link "Black Ribin Add to cart General Black Ribin ₹510" [ref=e165] [cursor=pointer]:
            - /url: /products/prod_01M0DPZK068RJ53F7EBGMY1R2D
            - generic [ref=e166]:
              - img "Black Ribin" [ref=e167]
              - button "Add to cart" [ref=e168]
            - generic [ref=e173]:
              - paragraph [ref=e174]: General
              - heading "Black Ribin" [level=3] [ref=e175]
              - generic [ref=e176]: ₹510
          - link "Blood/MILK/Grass Stain Remover Add to cart General Blood/MILK/Grass Stain Remover ₹0" [ref=e179] [cursor=pointer]:
            - /url: /products/prod_01M0DPZXSKSVYJAYAVPRAS00RE
            - generic [ref=e180]:
              - img "Blood/MILK/Grass Stain Remover" [ref=e181]
              - button "Add to cart" [ref=e182]
            - generic [ref=e187]:
              - paragraph [ref=e188]: General
              - heading "Blood/MILK/Grass Stain Remover" [level=3] [ref=e189]
              - generic [ref=e190]: ₹0
      - generic [ref=e192]:
        - generic [ref=e193]:
          - heading "New Arrivals" [level=2] [ref=e198]
          - link "See All" [ref=e199] [cursor=pointer]:
            - /url: /products
        - generic [ref=e202]:
          - link "Brush Hard Add to cart General Brush Hard ₹45" [ref=e204] [cursor=pointer]:
            - /url: /products/prod_01M0DQ08KNFXJ3EJ8D7JMBE5EN
            - generic [ref=e205]:
              - img "Brush Hard" [ref=e206]
              - button "Add to cart" [ref=e207]
            - generic [ref=e212]:
              - paragraph [ref=e213]: General
              - heading "Brush Hard" [level=3] [ref=e214]
              - generic [ref=e215]: ₹45
          - link "Bucket Big Add to cart General Bucket Big ₹740" [ref=e218] [cursor=pointer]:
            - /url: /products/prod_01M0DQ0KCA7YZ38J19DWNP8ZKC
            - generic [ref=e219]:
              - img "Bucket Big" [ref=e220]
              - button "Add to cart" [ref=e221]
            - generic [ref=e226]:
              - paragraph [ref=e227]: General
              - heading "Bucket Big" [level=3] [ref=e228]
              - generic [ref=e229]: ₹740
          - link "Butter paper Add to cart General Butter paper ₹306" [ref=e232] [cursor=pointer]:
            - /url: /products/prod_01M0DQ0Y9EX5QRDX21F5NY4FX8
            - generic [ref=e233]:
              - img "Butter paper" [ref=e234]
              - button "Add to cart" [ref=e235]
            - generic [ref=e240]:
              - paragraph [ref=e241]: General
              - heading "Butter paper" [level=3] [ref=e242]
              - generic [ref=e243]: ₹306
          - link "Butterfly Add to cart General Butterfly ₹51" [ref=e246] [cursor=pointer]:
            - /url: /products/prod_01M0DQ19VXPZBYT909H9VGD91F
            - generic [ref=e247]:
              - img "Butterfly" [ref=e248]
              - button "Add to cart" [ref=e249]
            - generic [ref=e254]:
              - paragraph [ref=e255]: General
              - heading "Butterfly" [level=3] [ref=e256]
              - generic [ref=e257]: ₹51
          - link "Cardboard Add to cart General Cardboard ₹3" [ref=e260] [cursor=pointer]:
            - /url: /products/prod_01M0DQ1MRWXHZS5M7YPW5F1W3Y
            - generic [ref=e261]:
              - img "Cardboard" [ref=e262]
              - button "Add to cart" [ref=e263]
            - generic [ref=e268]:
              - paragraph [ref=e269]: General
              - heading "Cardboard" [level=3] [ref=e270]
              - generic [ref=e271]: ₹3
          - link "Carry bag Add to cart General Carry bag ₹17" [ref=e274] [cursor=pointer]:
            - /url: /products/prod_01M0DQ1ZJHHR1RAWFFEQ0XGG3F
            - generic [ref=e275]:
              - img "Carry bag" [ref=e276]
              - button "Add to cart" [ref=e277]
            - generic [ref=e282]:
              - paragraph [ref=e283]: General
              - heading "Carry bag" [level=3] [ref=e284]
              - generic [ref=e285]: ₹17
      - generic [ref=e287]:
        - heading "Why LaundryMall?" [level=2] [ref=e288]
        - generic [ref=e289]:
          - generic [ref=e290]:
            - generic [ref=e291]: 🚚
            - generic [ref=e292]:
              - paragraph [ref=e293]: Pan India Delivery
              - paragraph [ref=e294]: Fast shipping to all outlets
          - generic [ref=e295]:
            - generic [ref=e296]: ✅
            - generic [ref=e297]:
              - paragraph [ref=e298]: ISO Certified
              - paragraph [ref=e299]: Guaranteed quality products
          - generic [ref=e300]:
            - generic [ref=e301]: 💰
            - generic [ref=e302]:
              - paragraph [ref=e303]: Wholesale Pricing
              - paragraph [ref=e304]: Best rates for bulk orders
          - generic [ref=e305]:
            - generic [ref=e306]: 🛡️
            - generic [ref=e307]:
              - paragraph [ref=e308]: Easy Returns
              - paragraph [ref=e309]: 7-day hassle-free policy
  - contentinfo [ref=e310]:
    - generic [ref=e311]:
      - generic [ref=e312]:
        - generic [ref=e313]:
          - heading "LaundryMall" [level=3] [ref=e314]
          - paragraph [ref=e315]: The premier B2B store for dry cleaning machinery, chemicals, and supplies.
        - generic [ref=e316]:
          - heading "Quick Links" [level=4] [ref=e317]
          - list [ref=e318]:
            - listitem [ref=e319]:
              - link "Home" [ref=e320] [cursor=pointer]:
                - /url: /
            - listitem [ref=e321]:
              - link "All Products" [ref=e322] [cursor=pointer]:
                - /url: /products
            - listitem [ref=e323]:
              - link "About Us" [ref=e324] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e325]:
              - link "Contact Sales" [ref=e326] [cursor=pointer]:
                - /url: /contact
        - generic [ref=e327]:
          - heading "Support" [level=4] [ref=e328]
          - list [ref=e329]:
            - listitem [ref=e330]:
              - link "FAQ" [ref=e331] [cursor=pointer]:
                - /url: /faq
            - listitem [ref=e332]:
              - link "Shipping Policy" [ref=e333] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e334]:
              - link "Returns" [ref=e335] [cursor=pointer]:
                - /url: /returns
            - listitem [ref=e336]:
              - link "Privacy Policy" [ref=e337] [cursor=pointer]:
                - /url: /privacy
        - generic [ref=e338]:
          - heading "Contact" [level=4] [ref=e339]
          - generic [ref=e340]:
            - paragraph [ref=e341]: "Email: info@laundrymall.com"
            - paragraph [ref=e342]: "Phone: +91 1234567890"
            - paragraph [ref=e343]: Ahmedabad, Gujarat, India
      - paragraph [ref=e345]: © 2026 LaundryMall. All rights reserved.
  - generic [ref=e346]:
    - generic [ref=e347]:
      - button "Close cart" [ref=e348]
      - generic [ref=e351]: Cart
      - generic [ref=e352]: STEP 1/3
    - generic [ref=e354]:
      - generic [ref=e356]:
        - img "12/18 Packaging Bag" [ref=e358]
        - generic [ref=e359]:
          - generic [ref=e360]:
            - paragraph [ref=e361]: 12/18 Packaging Bag
            - button "Remove item" [ref=e362]
          - generic [ref=e366]: ₹290
          - generic [ref=e368]:
            - button "Save for later" [ref=e369]
            - generic [ref=e373]:
              - button "-" [ref=e374]
              - generic [ref=e375]: "5"
              - button "+" [ref=e376]
      - generic [ref=e377]:
        - heading "Price Details (5 items)" [level=3] [ref=e378]
        - generic [ref=e379]:
          - generic [ref=e380]:
            - generic [ref=e381]: Product Price
            - generic [ref=e382]: + ₹1450
          - generic [ref=e383]:
            - generic [ref=e384]: Total Amount
            - generic [ref=e385]: ₹1450
    - generic [ref=e386]:
      - generic [ref=e387]:
        - paragraph [ref=e388]: Order Total
        - paragraph [ref=e389]: ₹1450
      - link "Proceed" [ref=e390] [cursor=pointer]:
        - /url: /checkout
  - alert [ref=e393]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Extreme Stress Test - Cart & UI Glitches', () => {
  4  |   // Use the live production site to test real Medusa latency
  5  |   const BASE_URL = 'https://laundrymall.in';
  6  | 
  7  |   test('Spam clicking Add To Cart and Remove', async ({ page }) => {
  8  |     // Listen for any hidden console errors
  9  |     const errors: string[] = [];
  10 |     page.on('console', msg => {
  11 |       if (msg.type() === 'error') {
  12 |         errors.push(`Console Error: ${msg.text()}`);
  13 |       }
  14 |     });
  15 |     page.on('pageerror', exception => {
  16 |       errors.push(`Uncaught Exception: ${exception.message}`);
  17 |     });
  18 | 
  19 |     await page.goto(BASE_URL);
  20 |     
  21 |     // Wait for the page to load products
  22 |     await page.waitForSelector('button[aria-label="Add to cart"]', { timeout: 15000 });
  23 | 
  24 |     // Find all 'Add to cart' buttons
  25 |     const addButtons = await page.$$('button[aria-label="Add to cart"]');
  26 |     expect(addButtons.length).toBeGreaterThan(0);
  27 | 
  28 |     console.log(`Found ${addButtons.length} add buttons. Slamming the first one 10 times in 1 second...`);
  29 |     
  30 |     // Spam click the first button 10 times with almost zero delay
  31 |     for (let i = 0; i < 10; i++) {
  32 |       await addButtons[0].click({ force: true });
  33 |       await page.waitForTimeout(50); // 50ms delay, superhuman speed
  34 |     }
  35 | 
  36 |     // Wait for the cart drawer to open and settle
  37 |     await page.waitForTimeout(3000);
  38 | 
  39 |     // Look for the "X" remove buttons in the cart
  40 |     const removeButtons = await page.$$('button:has(svg.lucide-x)');
  41 |     console.log(`Found ${removeButtons.length} items in the cart. Spamming the X button on all of them...`);
  42 | 
  43 |     // Spam click remove on every single item in the cart simultaneously
  44 |     for (const btn of removeButtons) {
> 45 |        await btn.click({ force: true });
     |                  ^ Error: elementHandle.click: Element is outside of the viewport
  46 |     }
  47 | 
  48 |     // Wait 5 seconds for background fetches to settle (testing for the ghost item bug)
  49 |     await page.waitForTimeout(5000);
  50 | 
  51 |     // Refresh the page
  52 |     await page.reload();
  53 |     await page.waitForTimeout(3000);
  54 | 
  55 |     // Check if the cart is truly empty
  56 |     const cartIcon = await page.$('text=Cart');
  57 |     await cartIcon?.click();
  58 |     await page.waitForTimeout(2000);
  59 | 
  60 |     const remainingItems = await page.$$('button:has(svg.lucide-x)');
  61 |     if (remainingItems.length > 0) {
  62 |       errors.push(`GHOST ITEM BUG: ${remainingItems.length} items magically reappeared in the cart after refresh!`);
  63 |     }
  64 | 
  65 |     // Output all found errors
  66 |     expect(errors).toEqual([]);
  67 |   });
  68 | });
  69 | 
```