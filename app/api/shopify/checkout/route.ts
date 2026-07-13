import { NextResponse } from "next/server";

const CART_CREATE_MUTATION = `
  mutation CreateCart($variantId: ID!) {
    cartCreate(input: { lines: [{ merchandiseId: $variantId, quantity: 1 }] }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
      warnings {
        code
        message
      }
    }
  }
`;

function normalizeStoreDomain(domain: string) {
  return domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function missingConfigRedirect(request: Request) {
  const fallback = process.env.NEXT_PUBLIC_SHOP_LINK;
  if (fallback && fallback !== "#checkout") {
    return NextResponse.redirect(fallback, 303);
  }

  return NextResponse.redirect(new URL("/?checkout=shopify-config-needed", request.url), 303);
}

export async function GET(request: Request) {
  return createShopifyCheckout(request);
}

export async function POST(request: Request) {
  return createShopifyCheckout(request);
}

async function createShopifyCheckout(request: Request) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const variantId = process.env.SHOPIFY_VARIANT_ID;

  if (!storeDomain || !storefrontToken || !variantId) {
    return missingConfigRedirect(request);
  }

  const endpoint = `https://${normalizeStoreDomain(storeDomain)}/api/2026-07/graphql.json`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({
      query: CART_CREATE_MUTATION,
      variables: {
        variantId,
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.redirect(new URL("/?checkout=shopify-request-failed", request.url), 303);
  }

  const payload = await response.json();
  const userErrors = payload?.data?.cartCreate?.userErrors ?? [];
  const checkoutUrl = payload?.data?.cartCreate?.cart?.checkoutUrl;

  if (userErrors.length > 0 || !checkoutUrl) {
    return NextResponse.redirect(new URL("/?checkout=shopify-cart-failed", request.url), 303);
  }

  return NextResponse.redirect(checkoutUrl, 303);
}
