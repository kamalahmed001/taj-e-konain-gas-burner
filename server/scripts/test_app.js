// Server is already running in background or loaded conditionally
import { getCartCheckoutUrl, getProductOrderUrl, normalizeWhatsAppNumber } from '../../client/src/services/whatsapp.js';

async function runTests() {
  console.log('\n===============================================================');
  console.log('🧪 RUNNING COMPREHENSIVE TAJ-E-KONAIN VERIFICATION TEST SUITE');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  const BASE = 'http://localhost:5000';

  try {
    // 1. Health check
    const healthRes = await (await fetch(`${BASE}/api/health`)).json();
    assert(healthRes.status === 'ok', 'Health Check API returns ok');

    // 2. Products listing
    const prodRes = await (await fetch(`${BASE}/api/products?limit=50`)).json();
    assert(prodRes.success && prodRes.data.length >= 18, `Fetched ${prodRes.data?.length} demonstration products (expected >= 18)`);
    assert(prodRes.pagination.total >= 18, `Pagination reports total >= 18 products`);

    // 3. Category Filter
    const catFilterRes = await (await fetch(`${BASE}/api/products?category=double-burner-gas-stoves`)).json();
    assert(catFilterRes.success && catFilterRes.data.length >= 1, `Category filtering works for double burner stoves`);

    // 4. Product Search
    const searchRes = await (await fetch(`${BASE}/api/products?search=tempered`)).json();
    assert(searchRes.success && searchRes.data.some(p => p.name.includes('Tempered Glass')), `Product search for "tempered" returns matching stoves`);

    // 5. Single Product & Specifications & Related
    const singleRes = await (await fetch(`${BASE}/api/products/taj-premium-tempered-glass-double-burner-stove`)).json();
    assert(singleRes.success && singleRes.data.sku === 'TK-DG-201', `Fetched single product by slug (TK-DG-201)`);
    assert(singleRes.data.specifications['Body Material']?.includes('Tempered Glass'), `Product specifications JSON parsed properly`);
    assert(singleRes.related && singleRes.related.length > 0, `Related products returned for product page`);

    // 6. Categories List
    const catListRes = await (await fetch(`${BASE}/api/categories`)).json();
    assert(catListRes.success && catListListHasCount(catListRes.data), `Categories list with product counts returned`);

    function catListListHasCount(cats) {
      return cats && cats.length >= 8 && cats.some(c => c.product_count > 0);
    }

    // 7. Store Settings
    const settingsRes = await (await fetch(`${BASE}/api/settings`)).json();
    assert(settingsRes.success && settingsRes.data.whatsapp_number === '923432833991', `Store settings returns correct WhatsApp number 923432833991`);
    assert(settingsRes.data.store_name === 'Taj-e-Konain Gas Burner', `Store name is "Taj-e-Konain Gas Burner"`);

    // 8. Testimonials
    const testRes = await (await fetch(`${BASE}/api/testimonials`)).json();
    assert(testRes.success && testRes.data.length >= 4, `Public testimonials returned with sample flag`);

    // 9. Content Blocks & FAQs
    const aboutRes = await (await fetch(`${BASE}/api/content/blocks/about`)).json();
    assert(aboutRes.success && aboutRes.data[0]?.content.includes('Taj-e-Konain'), `About Us content block fetched`);
    const faqsRes = await (await fetch(`${BASE}/api/content/faqs`)).json();
    assert(faqsRes.success && faqsRes.data.length >= 6, `FAQs fetched (${faqsRes.data.length} FAQs available)`);

    // 10. Dynamic Sitemap
    const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
    const sitemapXml = await sitemapRes.text();
    assert(sitemapRes.status === 200 && sitemapXml.includes('<urlset') && sitemapXml.includes('/product/taj-premium-tempered-glass-double-burner-stove'), `Dynamic XML Sitemap generated with product URLs`);

    // 11. Robots.txt
    const robotsRes = await fetch(`${BASE}/robots.txt`);
    const robotsTxt = await robotsRes.text();
    assert(robotsRes.status === 200 && robotsTxt.includes('Disallow: /admin') && robotsTxt.includes('Sitemap:'), `Robots.txt served with /admin disallow and sitemap declaration`);

    // 12. Contact Form Submission
    const contactPost = await (await fetch(`${BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        phone: '03001234567',
        email: 'test@example.com',
        subject: 'Inquiry',
        message: 'Looking for a heavy duty 2 burner stove.'
      })
    })).json();
    assert(contactPost.success, `Contact form message submitted to database`);

    // 13. Admin Login & JWT
    const loginRes = await (await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'TajGasBurnerAdmin2026!'
      })
    })).json();
    assert(loginRes.success && Boolean(loginRes.token), `Admin authentication successful with JWT token`);
    const adminToken = loginRes.token;

    // 14. Admin Verify
    const verifyRes = await (await fetch(`${BASE}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })).json();
    assert(verifyRes.success && verifyRes.admin.username === 'admin', `Admin token verified`);

    // 15. Dashboard Stats
    const statsRes = await (await fetch(`${BASE}/api/stats/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    })).json();
    assert(statsRes.success && statsRes.data.totalProducts >= 18, `Admin dashboard KPI statistics returned (${statsRes.data.totalProducts} products, ${statsRes.data.availableProducts} available)`);

    // 16. Admin Product CRUD
    const createRes = await (await fetch(`${BASE}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Automated Test Burner Unit',
        sku: 'TEST-BURNER-999',
        price: 5500,
        discount_price: 4900,
        stock_quantity: 5,
        short_description: 'Automated test product for CRUD validation'
      })
    })).json();
    assert(createRes.success && createRes.data.sku === 'TEST-BURNER-999', `Admin product creation works`);

    const createdId = createRes.data.id;

    const updateRes = await (await fetch(`${BASE}/api/products/${createdId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: 5200,
        stock_quantity: 8
      })
    })).json();
    assert(updateRes.success && updateRes.data.price === 5200, `Admin product update works`);

    const deleteRes = await (await fetch(`${BASE}/api/products/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` }
    })).json();
    assert(deleteRes.success, `Admin product deletion works`);

    // 17. WhatsApp Utility Tests
    const testNormalizedNumber = normalizeWhatsAppNumber('03432833991');
    assert(testNormalizedNumber === '923432833991', `WhatsApp number normalization converts 03432833991 to 923432833991`);

    const singleOrderUrl = getProductOrderUrl({
      product: { name: 'Double Burner Gas Stove', sku: 'TK-DG-201', price: 9950 },
      quantity: 2,
      phoneNumber: '923432833991'
    });
    assert(singleOrderUrl.startsWith('https://wa.me/923432833991?text='), `Single product WhatsApp order URL generated with proper prefix`);
    assert(singleOrderUrl.includes(encodeURIComponent('Double Burner Gas Stove')), `WhatsApp URL encodes product name properly`);

    const cartOrderUrl = getCartCheckoutUrl({
      items: [
        { name: 'Double Burner Gas Stove', sku: 'TK-DG-201', price: 9950, quantity: 1 },
        { name: 'Steel-Wire Braided Gas Hose (2m)', sku: 'TK-GH-111', price: 990, quantity: 2 }
      ],
      customerInfo: {
        name: 'Kamran Akram',
        phone: '03001234567',
        address: 'House 14, F-8/2, Islamabad',
        notes: 'Please verify nozzle size'
      },
      phoneNumber: '923432833991'
    });
    assert(cartOrderUrl.includes('923432833991'), `Cart checkout WhatsApp URL uses international number`);
    assert(cartOrderUrl.includes(encodeURIComponent('Kamran Akram')), `Cart checkout WhatsApp message contains customer name`);
    assert(cartOrderUrl.includes(encodeURIComponent('TK-DG-201')), `Cart checkout WhatsApp message contains item SKU`);

    // 18. Frontend production build serving
    const frontendRes = await fetch(`${BASE}/`);
    const frontendHtml = await frontendRes.text();
    assert(frontendRes.status === 200 && frontendHtml.includes('Taj-e-Konain'), `Frontend production build served directly by server at /`);

    console.log('\n===============================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('===============================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runTests();
