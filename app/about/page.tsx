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
            Petalcore Beauty creates soft-glow products designed for close-up routines, creator demos, and real-life skin days. Bloom Shield is built to feel light, photograph clean, and make the final step of a beauty routine look finished.
          </p>
          <p>
            This profile is connected to the video shopping page so viewers can move from a creator clip to comments, product proof, and checkout without leaving the mobile experience.
          </p>
          <Link className="fallbackLink" href="/#checkout">
            <ShoppingBag size={19} />
            Shop Bloom Shield
          </Link>
        </div>
      </section>
    </main>
  );
}
