"use client";

import Link from "next/link";
import {
  Bookmark,
  ChevronDown,
  Heart,
  Home,
  MessageCircle,
  Music2,
  Plus,
  Search,
  Send,
  ShoppingCart,
  UserRound,
  UsersRound,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const whopPlanId = process.env.NEXT_PUBLIC_WHOP_PLAN_ID;
const whopCheckoutUrl = process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL;
const shopLink = process.env.NEXT_PUBLIC_SHOP_LINK || "/api/shopify/checkout";

const clips = [
  {
    src: "/videos/winner-01.mp4",
    poster: "/posters/winner-01.jpg",
    creator: "lili",
    caption: "Wait I was actually shocked",
    audio: "original sound - Petalcore Beauty",
  },
  {
    src: "/videos/winner-02.mp4",
    poster: "/posters/winner-02.jpg",
    creator: "lili",
    caption: "My boyfriend thought I was 26 until I changed this routine",
    audio: "Petalcore glow check",
  },
  {
    src: "/videos/winner-03.mp4",
    poster: "/posters/winner-03.jpg",
    creator: "maya",
    caption: "The secret my friends kept asking for",
    audio: "soft glam routine - Petalcore",
  },
  {
    src: "/videos/winner-04.mp4",
    poster: "/posters/winner-04.jpg",
    creator: "maya",
    caption: "Part two because everyone wanted the exact order",
    audio: "get ready with me",
  },
  {
    src: "/videos/winner-05.mp4",
    poster: "/posters/winner-05.jpg",
    creator: "lili",
    caption: "Do not just slap any cream on your face",
    audio: "skin prep talk - Petalcore",
  },
];

const comments = [
  ["Ari", "I ordered after seeing this exact video and the texture is actually so pretty", "2h", "12.4K"],
  ["Mel", "The low stock tag got me moving faster than I want to admit", "1h", "8,942"],
  ["Jules", "Can confirm it gives that glassy finish without feeling sticky", "45m", "6,331"],
  ["Nia", "The before and after in part two sold me", "38m", "4,220"],
  ["Liv", "I need the shade name because this looks expensive", "31m", "2,904"],
  ["Kay", "Mine came in 3 days and the packaging is so cute", "18m", "1,778"],
  ["Bri", "Finally a beauty ad that shows the product up close", "12m", "942"],
];

export default function HomePage() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState<"comments" | "shop" | null>(null);
  const [shareNote, setShareNote] = useState("");
  const [needsTap, setNeedsTap] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.62 },
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, []);

  async function shareVideo() {
    const url = window.location.href;
    const text = "Watch this Petalcore Beauty video sales page";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Petalcore Beauty", text, url });
        setShareNote("Shared");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
    } catch {
      setShareNote("");
    }
    window.setTimeout(() => setShareNote(""), 1800);
  }

  function playVisibleVideo() {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    const visibleVideo = videos.find((video) => {
      const rect = video.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
    });
    visibleVideo?.play().then(() => setNeedsTap(false)).catch(() => setNeedsTap(true));
  }

  return (
    <main className="mobileShell">
      <section className="phoneViewport" aria-label="Petalcore video shopping feed">
        <div className="feedScroller" ref={scrollerRef}>
          {clips.map((clip, index) => (
            <article className="feedItem" key={clip.src}>
              <button className="videoTapLayer" type="button" aria-label="Play or pause video" onClick={playVisibleVideo}>
                <video
                  className="feedVideo"
                  src={clip.src}
                  poster={clip.poster}
                  autoPlay={index === 0}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
                {needsTap && index === 0 && <span className="tapToPlay">Tap to play</span>}
              </button>
              <div className="scrimTop" />
              <div className="scrimBottom" />
              <div className="statusBar">
                <span>10:25</span>
              </div>
              <div className="systemIcons">
                <span className="signal">SOS</span>
                <Wifi size={18} strokeWidth={3} />
                <span className="battery" />
              </div>
              <header className="tabBar">
                <span aria-hidden>LIVE</span>
                <nav className="tabs" aria-label="Feed tabs">
                  <span>Community</span>
                  <span>Local</span>
                  <span>Following</span>
                  <span>Shop</span>
                  <span className="tabActive">For You</span>
                </nav>
                <Search size={32} strokeWidth={3} />
              </header>
              <button className="shopPill" type="button" onClick={() => setSheet("shop")}>
                <span className="shopIcon">
                  <ShoppingCart size={22} />
                </span>
                <span>
                  Shop · low stock
                  <span className="shopSubcopy">6.1K+ repurchased</span>
                </span>
              </button>
              <div className="videoMeta">
                <div className="creatorLine">
                  <strong>{clip.creator}</strong>
                  <span>💫</span>
                </div>
                <p className="caption">{clip.caption}</p>
                <span className="sponsored">Ad</span>
              </div>
              <div className="musicLine">
                <Music2 size={15} />
                <span className="marquee">{clip.audio}</span>
              </div>
              <aside className="actionRail" aria-label="Video actions">
                <Link className="profileButton" href="/about" aria-label="Open Petalcore profile">
                  <img src="/images/product-hero.png" alt="" />
                  <span className="followDot">+</span>
                </Link>
                <button className={`railButton ${liked ? "isActive" : ""}`} type="button" onClick={() => setLiked((value) => !value)} aria-label="Like video">
                  <Heart size={39} strokeWidth={2.8} />
                  <span>71.2K</span>
                </button>
                <button className="railButton" type="button" onClick={() => setSheet("comments")} aria-label="Open comments">
                  <MessageCircle size={39} strokeWidth={2.8} />
                  <span>1,569</span>
                </button>
                <button className={`railButton ${saved ? "isActive" : ""}`} type="button" onClick={() => setSaved((value) => !value)} aria-label="Save video">
                  <Bookmark size={38} strokeWidth={2.8} />
                  <span>23.2K</span>
                </button>
                <button className="railButton" type="button" onClick={shareVideo} aria-label="Share video">
                  <Send size={38} strokeWidth={2.8} />
                  <span>{shareNote || "3,640"}</span>
                </button>
                <span className="disc">
                  <img src="/images/petalcore-logo.png" alt="" />
                </span>
              </aside>
            </article>
          ))}
        </div>
        <nav className="bottomNav" aria-label="App navigation">
          <span className="navItem navItemActive"><Home size={28} fill="currentColor" />Home</span>
          <span className="navItem"><UsersRound size={28} />Friends</span>
          <span className="navItem"><span className="postButton"><Plus size={25} strokeWidth={3.5} /></span></span>
          <button className="navItem" type="button" onClick={() => setSheet("comments")}><MessageCircle size={28} />Inbox</button>
          <Link className="navItem" href="/about"><UserRound size={28} />Profile</Link>
        </nav>
        {sheet && <button className="drawerBackdrop" type="button" aria-label="Close sheet" onClick={() => setSheet(null)} />}
        {sheet === "comments" && <CommentsSheet onClose={() => setSheet(null)} />}
        {sheet === "shop" && <ShopSheet onClose={() => setSheet(null)} />}
      </section>
    </main>
  );
}

function CommentsSheet({ onClose }: { onClose: () => void }) {
  return (
    <section className="sheet" aria-label="Comments">
      <span className="sheetHandle" />
      <header className="sheetHeader">
        <h2>1,569 comments</h2>
        <button type="button" onClick={onClose} aria-label="Close comments"><X size={24} /></button>
      </header>
      <div className="sheetBody">
        <div className="commentList">
          {comments.map(([name, text, time, likes]) => (
            <article className="commentRow" key={`${name}-${text}`}>
              <span className="avatar">{name.slice(0, 1)}</span>
              <div>
                <p className="commentName">@{name.toLowerCase()}.beauty</p>
                <p className="commentText">{text}</p>
                <div className="commentMeta">
                  <span>{time}</span>
                  <span>Reply</span>
                </div>
              </div>
              <button className="commentLike" type="button" aria-label={`Like ${name}'s comment`}>
                <Heart size={18} />
                <span>{likes}</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopSheet({ onClose }: { onClose: () => void }) {
  return (
    <section className="sheet shopSheet" aria-label="Shop Petalcore">
      <span className="sheetHandle" />
      <header className="sheetHeader">
        <h2>Petalcore Beauty</h2>
        <button type="button" onClick={onClose} aria-label="Close shop"><ChevronDown size={28} /></button>
      </header>
      <div className="sheetBody">
        <div className="shopTop">
            <img src="/images/riche-creme.jpg" alt="Petalcore Riche Creme product" />
            <div>
            <p className="shopTitle">[Petalcore] Riche Creme — Pro-Aging Nourishing Face Cream</p>
            <div className="rating">
              <strong>3.5 ★</strong>
              <span>(9.7K)</span>
              <span>·</span>
              <span>91.5K sold</span>
            </div>
          </div>
        </div>
        <div className="priceLine">
          <strong className="price">$59</strong>
          <span className="compare">$74</span>
          <span>Free 3-day delivery</span>
        </div>
        <div className="promoBox">Free & easy returns · Low stock · 6.1K+ repurchased</div>
        <div className="productDetail">
          <img className="productHero" src="/images/riche-creme.jpg" alt="Petalcore Riche Creme bottle on a white background" />
          <h3>Riche Creme</h3>
          <p>Pro-aging nourishing face cream in a 1.7 oz / 50 ml bottle. Built for a soft, hydrated finish that fits the routine shown in the videos.</p>
        </div>
        <div className="checkoutBox" id="checkout">
          {whopCheckoutUrl ? (
            <iframe className="checkoutFrame" src={whopCheckoutUrl} title="Petalcore checkout" />
          ) : whopPlanId ? (
            <button className="buyNow" data-whop-checkout-plan-id={whopPlanId} type="button">
              Buy now
            </button>
          ) : (
            <form action="/api/shopify/checkout" method="post">
              <button className="fallbackLink" type="submit">
                Buy now · Free 3-day delivery
              </button>
            </form>
          )}
          <div className="buttonRow">
            <form action="/api/shopify/checkout" method="post">
              <button className="cartButton" type="submit">Add to cart</button>
            </form>
            <form action={shopLink} method="post">
              <button className="buyNow" type="submit">Buy now</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
