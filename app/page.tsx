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

const shopLink = process.env.NEXT_PUBLIC_SHOP_LINK || "https://petalcorebeauty.com/cart/44387093381165:1";

const clips = [
  {
    id: "gatekeeping-callout",
    src: "/videos/winner-01.mp4",
    poster: "/posters/winner-01.jpg",
    creator: "lili",
    caption: "Wait I was actually shocked",
    audio: "original sound - Petalcore Beauty",
    metrics: { likes: "674K", comments: "8,931", saves: "74.8K", shares: "22.4K", repurchased: "6.1K+" },
  },
  {
    id: "boyfriend-26",
    src: "/videos/winner-02.mp4",
    poster: "/posters/winner-02.jpg",
    creator: "lili",
    caption: "My boyfriend thought I was 26 until I changed this routine",
    audio: "Petalcore glow check",
    metrics: { likes: "1.2M", comments: "14.2K", saves: "103K", shares: "48.6K", repurchased: "9.8K+" },
  },
  {
    id: "secret-friends-collage",
    videos: [
      { src: "/videos/winner-03.mp4", poster: "/posters/winner-03.jpg" },
      { src: "/videos/winner-04.mp4", poster: "/posters/winner-04.jpg" },
      { src: "/videos/winner-06.mp4", poster: "/posters/winner-06.jpg" },
    ],
    creator: "maya",
    caption: "The secret my friends kept asking for",
    audio: "soft glam routine - Petalcore",
    metrics: { likes: "842K", comments: "6,742", saves: "58.1K", shares: "31.7K", repurchased: "7.4K+" },
  },
  {
    id: "cream-warning",
    src: "/videos/winner-05.mp4",
    poster: "/posters/winner-05.jpg",
    creator: "lili",
    caption: "Do not just slap any cream on your face",
    audio: "skin prep talk - Petalcore",
    metrics: { likes: "986K", comments: "11.6K", saves: "91.3K", shares: "39.1K", repurchased: "8.9K+" },
  },
];

const comments = [
  {
    id: "creator-pinned",
    name: "lili",
    handle: "lili",
    text: "Wait because I used way less than I thought and my skin still looked moisturized at night",
    time: "2h",
    likes: "12.4K",
    avatar: "07",
    badge: "Creator",
    pinned: true,
  },
  {
    id: "riche-question",
    name: "Maddie",
    handle: "mads_skin",
    text: "is this the riche creme?? the pink bottle on the product page?",
    time: "1h",
    likes: "8,942",
    avatar: "18",
  },
  {
    id: "seller-reply",
    name: "Petalcore Beauty",
    handle: "petalcorebeauty",
    text: "Yes, this is Riche Creme. Tap Shop and it takes you to the 50 ml face cream.",
    time: "1h",
    likes: "6,102",
    avatar: "32",
    badge: "Seller",
    replyTo: "mads_skin",
  },
  {
    id: "texture",
    name: "Talia",
    handle: "taliaglow",
    text: "mine came yesterday. it feels thick in the jar but melts down so fast",
    time: "48m",
    likes: "4,220",
    avatar: "41",
  },
  {
    id: "makeup",
    name: "Renee",
    handle: "reneegrwm",
    text: "I have dry patches around my mouth and this is the first thing that did not pill under makeup",
    time: "33m",
    likes: "2,904",
    avatar: "56",
  },
  {
    id: "routine",
    name: "Kayla",
    handle: "kaylatok",
    text: "can you use it morning and night or is it more of a night cream?",
    time: "21m",
    likes: "1,778",
    avatar: "64",
  },
  {
    id: "returns",
    name: "Jules",
    handle: "juleswithskin",
    text: "the free returns made me try it tbh but I kept it lol",
    time: "12m",
    likes: "942",
    avatar: "72",
  },
  {
    id: "reading",
    name: "Nia",
    handle: "niaarchives",
    text: "not me pausing to read every comment before buying",
    time: "6m",
    likes: "318",
    avatar: "89",
  },
];

export default function HomePage() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sheet, setSheet] = useState<"comments" | "shop" | "live" | null>(null);
  const [shareNote, setShareNote] = useState("");
  const [needsTap, setNeedsTap] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeClip = clips[activeClipIndex];

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            const nextIndex = Number(video.dataset.clipIndex ?? 0);
            setActiveClipIndex(nextIndex);
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
            <article className="feedItem" key={clip.id}>
              <button
                className={`videoTapLayer ${clip.videos ? "collageTapLayer" : ""}`}
                type="button"
                aria-label="Play or pause video"
                onClick={playVisibleVideo}
              >
                {clip.videos ? (
                  <div className="videoCollage">
                    {clip.videos.map((video, videoIndex) => (
                      <video
                        className={`feedVideo collageVideo collageVideo${videoIndex + 1}`}
                        key={video.src}
                        src={video.src}
                        poster={video.poster}
                        data-clip-index={index}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                      />
                    ))}
                  </div>
                ) : (
                  <video
                    className="feedVideo"
                    src={clip.src}
                    poster={clip.poster}
                    data-clip-index={index}
                    autoPlay={index === 0}
                    muted
                    playsInline
                    loop
                    preload="metadata"
                  />
                )}
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
                <button className="liveTab" type="button" onClick={() => { setActiveClipIndex(index); setSheet("live"); }} aria-label="Open live shopping">
                  LIVE
                </button>
                <nav className="tabs" aria-label="Feed tabs">
                  <span>Community</span>
                  <span>Local</span>
                  <span>Following</span>
                  <span>Shop</span>
                  <span className="tabActive">For You</span>
                </nav>
                <Search size={32} strokeWidth={3} />
              </header>
              <button className="shopPill" type="button" onClick={() => { setActiveClipIndex(index); setSheet("shop"); }}>
                <span className="shopIcon">
                  <ShoppingCart size={22} />
                </span>
                <span>
                  Shop · low stock
                  <span className="shopSubcopy">{clip.metrics.repurchased} repurchased</span>
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
                  <span>{clip.metrics.likes}</span>
                </button>
                <button className="railButton" type="button" onClick={() => { setActiveClipIndex(index); setSheet("comments"); }} aria-label="Open comments">
                  <MessageCircle size={39} strokeWidth={2.8} />
                  <span>{clip.metrics.comments}</span>
                </button>
                <button className={`railButton ${saved ? "isActive" : ""}`} type="button" onClick={() => setSaved((value) => !value)} aria-label="Save video">
                  <Bookmark size={38} strokeWidth={2.8} />
                  <span>{clip.metrics.saves}</span>
                </button>
                <button className="railButton" type="button" onClick={shareVideo} aria-label="Share video">
                  <Send size={38} strokeWidth={2.8} />
                  <span>{shareNote || clip.metrics.shares}</span>
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
        {sheet === "comments" && <CommentsSheet commentCount={activeClip.metrics.comments} onClose={() => setSheet(null)} />}
        {sheet === "shop" && <ShopSheet onClose={() => setSheet(null)} />}
        {sheet === "live" && <LiveShopSheet onClose={() => setSheet(null)} />}
      </section>
    </main>
  );
}

function CommentsSheet({ commentCount, onClose }: { commentCount: string; onClose: () => void }) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  function toggleCommentLike(id: string) {
    setLikedComments((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <section className="sheet" aria-label="Comments">
      <span className="sheetHandle" />
      <header className="sheetHeader">
        <h2>{commentCount} comments</h2>
        <button type="button" onClick={onClose} aria-label="Close comments"><X size={24} /></button>
      </header>
      <div className="sheetBody">
        <div className="commentList">
          {comments.map((comment) => (
            <article className={`commentRow ${comment.pinned ? "commentPinned" : ""}`} key={comment.id}>
              <span className="avatar">
                <img src={`/avatars/face-${comment.avatar}.svg`} alt="" />
              </span>
              <div>
                <p className="commentName">
                  @{comment.handle}
                  {comment.badge && <span>{comment.badge}</span>}
                </p>
                {comment.replyTo && <p className="replyContext">Replying to @{comment.replyTo}</p>}
                <p className="commentText">{comment.text}</p>
                <div className="commentMeta">
                  <span>{comment.pinned ? "Pinned" : comment.time}</span>
                  <span>Reply</span>
                </div>
              </div>
              <button
                className={`commentLike ${likedComments.has(comment.id) ? "commentLikeActive" : ""}`}
                type="button"
                aria-label={`Like ${comment.name}'s comment`}
                aria-pressed={likedComments.has(comment.id)}
                onClick={() => toggleCommentLike(comment.id)}
              >
                <Heart size={18} />
                <span>{comment.likes}</span>
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
      </div>
      <footer className="shopStickyBar" id="checkout">
        <div className="buttonRow">
          <a className="cartButton" href={shopLink}>
            Add to cart
          </a>
          <a className="payNow" href={shopLink}>
            Pay now
            <span>Free 3-day delivery</span>
          </a>
        </div>
      </footer>
    </section>
  );
}

function LiveShopSheet({ onClose }: { onClose: () => void }) {
  const liveComments = [
    ["@camilleglow", "show the texture again pls"],
    ["@skinbyren", "just got mine, checkout was fast"],
    ["@petalcorebeauty", "Riche Creme is pinned below"],
    ["@mollymakeup", "does it sit well under concealer?"],
  ];

  return (
    <section className="sheet liveSheet" aria-label="Petalcore live shopping">
      <span className="sheetHandle" />
      <header className="sheetHeader">
        <h2><span className="liveDot" /> Petalcore LIVE</h2>
        <button type="button" onClick={onClose} aria-label="Close live"><X size={24} /></button>
      </header>
      <div className="liveBody">
        <div className="liveVideoWrap">
          <video
            className="liveVideo"
            src="/videos/winner-01.mp4"
            poster="/posters/winner-01.jpg"
            autoPlay
            muted
            playsInline
            loop
          />
          <div className="liveBadge">LIVE · 2.8K watching</div>
          <div className="liveChat">
            {liveComments.map(([name, text]) => (
              <p key={name}>
                <strong>{name}</strong>
                <span>{text}</span>
              </p>
            ))}
          </div>
        </div>
        <div className="liveProductCard">
          <img src="/images/riche-creme.jpg" alt="Petalcore Riche Creme product" />
          <div>
            <strong>Riche Creme</strong>
            <span>$59 · Free 3-day delivery</span>
          </div>
        </div>
      </div>
      <footer className="shopStickyBar">
        <div className="buttonRow">
          <a className="cartButton" href={shopLink}>
            Add to cart
          </a>
          <a className="payNow" href={shopLink}>
            Pay now
            <span>Free 3-day delivery</span>
          </a>
        </div>
      </footer>
    </section>
  );
}
