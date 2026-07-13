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
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const checkoutLink = "/checkout";

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

const feedClips = [...clips, ...clips];
const liveInviteDelayMs = 1800;
const liveInviteVisibleMs = 5200;
const liveInviteRepeatMs = 30000;

function formatViewerCount(count: number) {
  return `${(count / 1000).toFixed(1)}K`;
}

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
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [showLiveInvite, setShowLiveInvite] = useState(false);
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
            video.play().catch(() => undefined);
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

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function loopFeed() {
      if (!scroller) return;
      const loopPoint = scroller.clientHeight * clips.length;
      if (loopPoint > 0 && scroller.scrollTop >= loopPoint) {
        scroller.scrollTop -= loopPoint;
      }
    }

    scroller.addEventListener("scroll", loopFeed, { passive: true });
    return () => scroller.removeEventListener("scroll", loopFeed);
  }, []);

  useEffect(() => {
    if (sheet) {
      setShowLiveInvite(false);
      return;
    }

    let hideTimer: number | undefined;
    let repeatTimer: number | undefined;

    function showInvite() {
      setShowLiveInvite(true);
      hideTimer = window.setTimeout(() => {
        setShowLiveInvite(false);
      }, liveInviteVisibleMs);
      repeatTimer = window.setTimeout(showInvite, liveInviteRepeatMs);
    }

    const firstTimer = window.setTimeout(showInvite, liveInviteDelayMs);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(hideTimer);
      window.clearTimeout(repeatTimer);
    };
  }, [sheet]);

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
    visibleVideo?.play().catch(() => undefined);
  }

  return (
    <main className="mobileShell">
      <section className="phoneViewport" aria-label="Petalcore video shopping feed">
        <div className="feedScroller" ref={scrollerRef}>
          {feedClips.map((clip, index) => {
            const logicalIndex = index % clips.length;

            return (
              <article className="feedItem" key={`${clip.id}-${index}`}>
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
                          data-clip-index={logicalIndex}
                          autoPlay
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
                      data-clip-index={logicalIndex}
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />
                  )}
                </button>
                <div className="scrimTop" />
                <div className="scrimBottom" />
                <header className="tabBar">
                  <button className="liveTab" type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("live"); }} aria-label="Open live shopping">
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
                <button className="shopPill" type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("shop"); }}>
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
                </div>
                <div className="musicLine">
                  <Music2 size={15} />
                  <span className="marquee">{clip.audio}</span>
                </div>
                <aside className="actionRail" aria-label="Video actions">
                  <div className="profileStack">
                    <button className="profileLiveCue" type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("live"); }} aria-label="Open Petalcore live">
                      LIVE
                    </button>
                    <Link className="profileButton" href="/about" aria-label="Open Petalcore profile">
                      <img src="/images/product-hero.png" alt="" />
                      <span className="followDot">+</span>
                    </Link>
                  </div>
                  <button className={`railButton ${liked ? "isActive" : ""}`} type="button" onClick={() => setLiked((value) => !value)} aria-label="Like video">
                    <Heart size={39} strokeWidth={2.8} />
                    <span>{clip.metrics.likes}</span>
                  </button>
                  <button className="railButton" type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("comments"); }} aria-label="Open comments">
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
            );
          })}
        </div>
        <nav className="bottomNav" aria-label="App navigation">
          <span className="navItem navItemActive"><Home size={28} fill="currentColor" />Home</span>
          <span className="navItem"><UsersRound size={28} />Friends</span>
          <span className="navItem"><span className="postButton"><Plus size={25} strokeWidth={3.5} /></span></span>
          <button className="navItem" type="button" onClick={() => setSheet("comments")}><MessageCircle size={28} />Inbox</button>
          <Link className="navItem" href="/about"><UserRound size={28} />Profile</Link>
        </nav>
        {showLiveInvite && !sheet && (
          <div className="liveInviteToast" role="status">
            <img src="/images/product-hero.png" alt="" />
            <div>
              <strong>Petalcore Beauty</strong>
              <span>is inviting you to watch their live shopping</span>
            </div>
            <button type="button" onClick={() => { setShowLiveInvite(false); setSheet("live"); }}>
              Watch
            </button>
            <button className="liveInviteClose" type="button" onClick={() => setShowLiveInvite(false)} aria-label="Dismiss live invite">
              <X size={15} />
            </button>
          </div>
        )}
        {sheet && sheet !== "live" && <button className="drawerBackdrop" type="button" aria-label="Close sheet" onClick={() => setSheet(null)} />}
        {sheet === "comments" && <CommentsSheet commentCount={activeClip.metrics.comments} onClose={() => setSheet(null)} />}
        {sheet === "shop" && <ShopSheet onClose={() => setSheet(null)} />}
        {sheet === "live" && <LiveShopPage onClose={() => setSheet(null)} />}
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
                <img src={`/avatars/face-${comment.avatar}.jpg`} alt="" />
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
          <a className="cartButton" href={checkoutLink}>
            Add to cart
          </a>
          <a className="payNow" href={checkoutLink}>
            Pay now
            <span>Free 3-day delivery</span>
          </a>
        </div>
      </footer>
    </section>
  );
}

function LiveShopPage({ onClose }: { onClose: () => void }) {
  const [viewerCount, setViewerCount] = useState(6024);
  const liveCommentPool = [
    { name: "L.A", text: "Love how glowy this looks", gems: "21" },
    { name: "Nemisis", text: "joined", gems: "10" },
    { name: "skinbyren", text: "wait show the texture again pls" },
    { name: "petalcorebeauty", text: "Riche Creme is pinned below" },
    { name: "mollymakeup", text: "does it sit well under concealer?" },
    { name: "taliaglow", text: "I need this for night routine" },
    { name: "bri.skin", text: "cart is open omg" },
    { name: "nycbeauty", text: "how much do you use?" },
    { name: "lena", text: "it looks so smooth on camera" },
    { name: "arielle", text: "free shipping sold me" },
    { name: "kaylatok", text: "show the jar again" },
    { name: "petalcorebeauty", text: "Tap Buy for the Riche Creme checkout" },
    { name: "softglam", text: "mine just arrived today" },
    { name: "mads_skin", text: "does this work before makeup?" },
    { name: "jules", text: "the glow is actually insane" },
    { name: "reneegrwm", text: "ok this texture looks expensive" },
  ];
  const [liveComments, setLiveComments] = useState(() =>
    liveCommentPool.slice(0, 5).map((comment, index) => ({ ...comment, id: `initial-${index}` })),
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setViewerCount((current) => {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const movement = direction * (90 + Math.floor(Math.random() * 171));
        const nextCount = current + movement;
        return Math.min(6520, Math.max(5580, nextCount));
      });
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let commentIndex = 5;
    const timer = window.setInterval(() => {
      const comment = liveCommentPool[commentIndex % liveCommentPool.length];
      setLiveComments((current) => [
        ...current.slice(-5),
        { ...comment, id: `${comment.name}-${commentIndex}-${Date.now()}` },
      ]);
      commentIndex += 1;
    }, 1450);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="livePage" aria-label="Petalcore live shopping">
      <video
        className="livePageVideo"
        src="/videos/winner-02.mp4"
        poster="/posters/winner-02.jpg"
        autoPlay
        muted
        playsInline
        loop
      />
      <div className="scrimTop" />
      <div className="scrimBottom" />
      <header className="livePageHeader">
        <div className="liveHost">
          <img src="/avatars/face-04.jpg" alt="" />
          <div>
            <strong>Petalcore Beauty</strong>
            <span>Gold Star Seller</span>
          </div>
        </div>
        <button className="liveFollowButton" type="button">+ Follow</button>
        <span className="liveViewerPill">{formatViewerCount(viewerCount)}</span>
        <button className="liveRoundButton" type="button" aria-label="Minimize live">⌄</button>
        <button className="liveCloseX" type="button" onClick={onClose} aria-label="Close live"><X size={34} /></button>
      </header>
      <div className="liveTopBadges">
        <span className="dailyRanking">Daily Ranking</span>
        <span className="viewerLabel">Viewers</span>
        <button className="liveMiniProduct" type="button" aria-label="Live product preview">
          <img src="/images/riche-creme.jpg" alt="" />
          <span>11:04</span>
        </button>
        <button className="liveCouponChip" type="button" aria-label="Live coupon">%</button>
      </div>
      <div className="liveCommercePanel">
        <div className="liveViewingToast">1 user is viewing products</div>
        <div className="liveChat">
          {liveComments.map((comment) => (
            <p key={comment.id}>
              {comment.gems && <span className="gemCount">{comment.gems}</span>}
              <strong>@{comment.name}</strong>
              <span>{comment.text}</span>
            </p>
          ))}
        </div>
      </div>
      <footer className="liveBuyBar">
        <article className="liveCheckoutCard">
          <span className="liveItemNumber">1</span>
          <img src="/images/riche-creme.jpg" alt="Petalcore Riche Creme product" />
          <div>
            <strong>(Live) Petalcore Riche Creme — Pro-Aging Nourishing Face Cream</strong>
            <span className="liveDealText">Extra $5 off orders $30+</span>
            <span className="liveShipText">Free shipping | Free returns</span>
            <p><span>From </span><strong>$59</strong> <s>$74</s> <em>(-20%)</em></p>
          </div>
          <a href={checkoutLink}>Buy</a>
        </article>
        <div className="liveInputDock">
          <span className="liveBag">1</span>
          <span className="liveInput">Type...</span>
          <span>☺</span>
          <span>🎁</span>
          <button type="button" onClick={() => navigator.share?.({ title: "Petalcore LIVE", url: window.location.href })}>↗</button>
        </div>
      </footer>
    </section>
  );
}
