# Petalcore Video Sales Page

Mobile-first short-video sales page for Petalcore Beauty. The first screen is a full 9:16 feed, the shop CTA opens a product drawer, comments open a simulated proof sheet, and checkout can render through Whop once a live plan or checkout URL is configured.

## Local

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checkout

For Shopify checkout that registers orders in your store, set these in Vercel:

- `SHOPIFY_STORE_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_VARIANT_ID`

The buy buttons call `/api/shopify/checkout`, create a Shopify cart with the configured variant, and redirect to Shopify's hosted checkout URL.

Current product target: Petalcore Riche Creme, variant `gid://shopify/ProductVariant/44387093381165`.

Optional fallbacks:

- `NEXT_PUBLIC_WHOP_PLAN_ID` for the Whop checkout loader button.
- `NEXT_PUBLIC_WHOP_CHECKOUT_URL` for a hosted/embed checkout iframe.
- `NEXT_PUBLIC_SHOP_LINK` for a fallback external checkout link.
