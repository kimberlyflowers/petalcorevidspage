"use client";

import { ChevronLeft, ChevronRight, CreditCard, ShieldCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const shopifyCheckoutLink = "/api/shopify/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [showExitOffer, setShowExitOffer] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    window.history.pushState({ checkoutGuard: true }, "", window.location.href);
    const onPopState = () => {
      setShowExitOffer(true);
      window.history.pushState({ checkoutGuard: true }, "", window.location.href);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function requestExit() {
    setShowExitOffer(true);
  }

  function applyCoupon() {
    setCouponApplied(true);
    setShowExitOffer(false);
  }

  function skipAndExit() {
    router.push("/");
  }

  return (
    <main className="checkoutPage">
      <header className="checkoutHeader">
        <button type="button" onClick={requestExit} aria-label="Leave checkout">
          <ChevronLeft size={34} strokeWidth={3} />
        </button>
        <h1>Checkout</h1>
        <span />
      </header>

      <section className="privacyBanner">
        <h2><ShieldCheck size={24} /> Data privacy</h2>
        <p>Your info and data is not shared or sold without your consent.</p>
      </section>

      <section className="checkoutSection">
        <h2>Shipping address</h2>
        <button className="checkoutRow" type="button">
          <span>Add an address</span>
          <span className="requiredDot" />
          <ChevronRight size={24} />
        </button>
      </section>

      <section className="checkoutSection">
        <h2>Payment method</h2>
        <label className="paymentRow">
          <span className="payBadge">Apple Pay</span>
          <span>Apple Pay</span>
          <input type="radio" name="payment" defaultChecked />
        </label>
        <label className="paymentRow">
          <CreditCard size={32} />
          <span>Credit or debit card</span>
          <input type="radio" name="payment" />
        </label>
        <label className="paymentRow">
          <span className="payBadge payPal">P</span>
          <span>PayPal</span>
          <input type="radio" name="payment" />
        </label>
        <button className="checkoutRow mutedRow" type="button">
          <span>View 6 payment methods</span>
          <ChevronRight size={24} />
        </button>
      </section>

      <section className="checkoutSection orderSummary">
        <div className="summaryHeader">
          <h2>Shipping</h2>
          <button type="button">Add note</button>
        </div>
        <article className="checkoutProduct">
          <img src="/images/riche-creme.jpg" alt="Petalcore Riche Creme product" />
          <div>
            <strong>Petalcore Riche Creme — Pro-Aging Nourishing Face Cream</strong>
            <span>Default</span>
            <span>Free shipping</span>
            <em>{couponApplied ? "Follower coupon applied" : "Limited time deal"}</em>
            <p>
              <span>-{couponApplied ? "20" : "15"}%</span>
              <strong>${couponApplied ? "56.05" : "59.00"}</strong>
              <s>$74.00</s>
            </p>
          </div>
        </article>
      </section>

      <div className="dealCountdown">
        <span>Limited time deal ends in <strong>02:04:25</strong></span>
        <button type="button" onClick={requestExit} aria-label="Close checkout deal"><X size={24} /></button>
      </div>

      <footer className="checkoutFooter">
        <div>
          <span>Total (1 item)</span>
          <strong>${couponApplied ? "56.05" : "59.00"}</strong>
        </div>
        <span>Saved ${couponApplied ? "17.95" : "15.00"}</span>
        <a href={shopifyCheckoutLink}>{couponApplied ? "Continue with 5% off" : "Add address"}</a>
      </footer>

      {showExitOffer && (
        <div className="exitOfferOverlay" role="dialog" aria-modal="true" aria-label="Before you go offer">
          <div className="exitOfferModal">
            <h2>Before you go, save 5%</h2>
            <p>Use your follow coupon before it expires</p>
            <div className="couponCard">
              <strong>5%<span> OFF</span></strong>
              <p>Available for followers only. Available for followers only. Available for follo...</p>
              <div>
                <span>Valid for 30 days after claim...</span>
                <button type="button">Terms apply</button>
              </div>
            </div>
            <button className="applyCouponButton" type="button" onClick={applyCoupon}>
              Follow to apply
            </button>
            <button className="skipExitButton" type="button" onClick={skipAndExit}>
              Skip and exit
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
