import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="mobileShell">
      <section className="phoneViewport aboutPage" aria-label="Petalcore profile">
        <div className="aboutHero">
          <Link className="backLink" href="/" aria-label="Back to videos">
            <ArrowLeft size={24} />
          </Link>
          <img className="aboutLogo" src="/images/petalcore-logo.png" alt="Petalcore Beauty" />
          <h1>Beauty that moves like your feed.</h1>
        </div>
        <div className="aboutContent">
          <div className="aboutStats">
            <div className="aboutStat">
              <strong>91.5K</strong>
              <span>sold</span>
            </div>
            <div className="aboutStat">
              <strong>9.7K</strong>
              <span>reviews</span>
            </div>
            <div className="aboutStat">
              <strong>6.1K+</strong>
              <span>repurchased</span>
            </div>
          </div>
          <p>
            Petalcore Beauty makes skincare and beauty essentials for skin that wants to look soft, hydrated, smooth, and naturally lit.
          </p>
          <p>
            Our products are made for everyday routines: comforting dry-looking skin, boosting a healthy glow, helping makeup sit better, and giving your skin a fresh finish without feeling heavy.
          </p>
          <Link className="fallbackLink" href="/#checkout">
            <ShoppingBag size={19} />
            Shop Petalcore
          </Link>
        </div>
      </section>
    </main>
  );
}
