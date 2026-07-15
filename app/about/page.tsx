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
            Petalcore Beauty makes skincare for skin that wants to look soft, hydrated, and naturally lit before makeup or on its own.
          </p>
          <p>
            Riche Creme helps comfort dry-looking skin, smooth the look of texture, and leave your face with a healthy glow that feels rich without feeling heavy.
          </p>
          <Link className="fallbackLink" href="/#checkout">
            <ShoppingBag size={19} />
            Shop Riche Creme
          </Link>
        </div>
      </section>
    </main>
  );
}
