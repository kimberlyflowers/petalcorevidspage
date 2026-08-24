"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import {
  Bookmark,
  ChevronDown,
  Heart,
  Home,
  Menu,
  MessageCircle,
  Music2,
  Plus,
  Search,
  Send,
  ShoppingCart,
  Sparkles,
  UserRound,
  UsersRound,
  Wand2,
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
    id: "petalcore-live-preview",
    src: "/videos/live-shopping.mp4",
    poster: "/posters/live-shopping.jpg",
    creator: "Petalcore Beauty",
    caption: "Live now with skincare routine help and product questions",
    audio: "Petalcore LIVE shopping",
    livePreview: true,
    metrics: { likes: "1220", comments: "295", saves: "6.1K", shares: "2", repurchased: "6.1K+" },
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
const liveInviteDelayMs = 15000;
const liveInviteVisibleMs = 5200;
const liveInviteRepeatMs = 30000;

function FeedLiveIcon() {
  return (
    <svg className="feedLiveSvg" viewBox="0 0 52 48" aria-hidden="true" focusable="false">
      <path className="feedLiveStroke" d="M17.8 5.9 25.9 13.9 34.1 5.9" />
      <path className="feedLiveStroke" d="M11.9 16.9H40" />
      <path className="feedLiveStroke" d="M8.7 24.1v10.2" />
      <path className="feedLiveStroke" d="M43.2 24.1v10.2" />
      <path className="feedLiveStroke" d="M10.8 41.1h30.3" />
      <text className="feedLiveText" x="26" y="35.7" textAnchor="middle">LIVE</text>
    </svg>
  );
}

function TikTokShareIcon() {
  return (
    <svg className="liveShareSvg" viewBox="0 0 64 50" aria-hidden="true" focusable="false">
      <path
        d="M39.4 5.1 60 20.3 39.4 35.5v-9.1c-12.6.2-23.5 5.7-31.1 17.5C10.4 25 21.5 12.5 39.4 11.1V5.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

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
  const [sheet, setSheet] = useState<"comments" | "shop" | "live" | "assistant" | "tiktokLogin" | null>(null);
  const [shareNote, setShareNote] = useState("");
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [storyParts, setStoryParts] = useState<Record<string, number>>({});
  const [showLiveInvite, setShowLiveInvite] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeClip = clips[activeClipIndex];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("live") === "1") {
      setSheet("live");
    }
  }, []);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            const nextIndex = Number(video.dataset.clipIndex ?? 0);
            setActiveClipIndex(nextIndex);
            video.currentTime = 0;
            if (!sheet) {
              video.play().catch(() => undefined);
            }
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.62 },
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [sheet]);

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

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    videos.forEach((video) => {
      video.muted = sheet === "live" || !soundOn;
      if (sheet === "live") {
        video.pause();
      }
    });
  }, [soundOn, sheet]);

  useEffect(() => {
    if (sheet) return;

    const storyVideos = Array.from(document.querySelectorAll<HTMLVideoElement>(".storyVideo"));
    const visibleStoryVideo = storyVideos.find((video) => {
      const rect = video.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.65;
    });

    if (!visibleStoryVideo) return;
    visibleStoryVideo.muted = !soundOn;
    visibleStoryVideo.currentTime = 0;
    visibleStoryVideo.play().catch(() => undefined);
  }, [storyParts, soundOn, sheet]);

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

  function enableFeedSound() {
    setSoundOn(true);
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>(".feedVideo"));
    const visibleVideo = videos.find((video) => {
      const rect = video.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.6;
    });
    if (!visibleVideo) return;
    const visibleItem = visibleVideo.closest(".feedItem");
    const videosInItem = Array.from(visibleItem?.querySelectorAll<HTMLVideoElement>(".feedVideo") ?? [visibleVideo]);
    videosInItem.forEach((video) => {
      video.muted = false;
      video.play().catch(() => undefined);
    });
  }

  function openTikTokLogin() {
    setSheet("tiktokLogin");
  }

  function changeStoryPart(clipId: string, direction: -1 | 1, totalParts: number) {
    setStoryParts((current) => {
      const nextPart = Math.min(totalParts - 1, Math.max(0, (current[clipId] ?? 0) + direction));
      return { ...current, [clipId]: nextPart };
    });
  }

  return (
    <main className="mobileShell">
      <section className="phoneViewport" aria-label="Petalcore video shopping feed">
        <div className="feedScroller" ref={scrollerRef}>
          {feedClips.map((clip, index) => {
            const logicalIndex = index % clips.length;
            const isLivePreview = "livePreview" in clip && clip.livePreview;
            const storyPart = "videos" in clip && clip.videos ? storyParts[clip.id] ?? 0 : 0;
            const storyVideo = "videos" in clip && clip.videos ? clip.videos[storyPart] : null;

            return (
              <article className={`feedItem ${isLivePreview ? "liveFeedItem" : ""}`} key={`${clip.id}-${index}`}>
                <button
                  className={`videoTapLayer ${storyVideo ? "storyTapLayer" : ""}`}
                  type="button"
                  aria-label={isLivePreview ? "Open Petalcore live" : "Play video audio"}
                  onClick={() => {
                    if (isLivePreview) {
                      setActiveClipIndex(logicalIndex);
                      setSheet("live");
                      return;
                    }
                    if (storyVideo && "videos" in clip && clip.videos) {
                      changeStoryPart(clip.id, 1, clip.videos.length);
                      return;
                    }
                    enableFeedSound();
                  }}
                >
                  {storyVideo ? (
                    <video
                      autoPlay
                      className="feedVideo storyVideo"
                      key={storyVideo.src}
                      src={storyVideo.src}
                      poster={storyVideo.poster}
                      data-clip-index={logicalIndex}
                      muted={sheet === "live" || !soundOn}
                      playsInline
                      loop
                      preload={index === 0 ? "metadata" : "none"}
                    />
                  ) : (
                    <video
                      className="feedVideo"
                      src={clip.src}
                      poster={clip.poster}
                      data-clip-index={logicalIndex}
                      muted={sheet === "live" || !soundOn}
                      playsInline
                      loop
                      preload={index === 0 ? "metadata" : "none"}
                    />
                  )}
                  {isLivePreview && (
                    <>
                      <span className="liveFeedHeadline">
                        Over 50? Get the rich-cream glow in one step
                      </span>
                      <span className="liveFeedWatchPill">
                        <span className="liveFeedBars" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                        Click to watch LIVE
                        <kbd>D</kbd>
                      </span>
                      <span className="liveFeedNowBadge">LIVE now</span>
                    </>
                  )}
                </button>
                {storyVideo && "videos" in clip && clip.videos && (
                  <div className="storyOverlay" aria-label={`${clip.caption} story controls`}>
                    <div className="storyProgress" aria-hidden="true">
                      {clip.videos.map((video, videoIndex) => (
                        <span className={videoIndex <= storyPart ? "storyProgressActive" : ""} key={video.src} />
                      ))}
                    </div>
                    <span className="storyPartLabel">Part {storyPart + 1} of {clip.videos.length}</span>
                    <button
                      className="storyNav storyNavPrev"
                      type="button"
                      aria-label="Previous story part"
                      disabled={storyPart === 0}
                      onClick={(event) => {
                        event.stopPropagation();
                        changeStoryPart(clip.id, -1, clip.videos.length);
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="storyNav storyNavNext"
                      type="button"
                      aria-label="Next story part"
                      disabled={storyPart === clip.videos.length - 1}
                      onClick={(event) => {
                        event.stopPropagation();
                        changeStoryPart(clip.id, 1, clip.videos.length);
                      }}
                    >
                      ›
                    </button>
                  </div>
                )}
                <div className="scrimTop" />
                <div className="scrimBottom" />
                <header className="tabBar">
                  <button className="liveTab" type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("live"); }} aria-label="Open live shopping">
                    <FeedLiveIcon />
                  </button>
                  <nav className="tabs" aria-label="Feed tabs">
                    <button type="button" onClick={openTikTokLogin}>Community</button>
                    <button type="button" onClick={openTikTokLogin}>Local</button>
                    <button type="button" onClick={openTikTokLogin}>Following</button>
                    <button type="button" onClick={() => { setActiveClipIndex(logicalIndex); setSheet("shop"); }}>Shop</button>
                    <button className="tabActive" type="button">For You</button>
                  </nav>
                  <button className="searchButton" type="button" onClick={openTikTokLogin} aria-label="Search TikTok">
                    <Search size={32} strokeWidth={3} />
                  </button>
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
                    <button className="assistantCue" type="button" onClick={() => setSheet("assistant")} aria-label="Ask Petalcore assistant">
                      <span className="assistantFace" aria-hidden="true" />
                    </button>
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
          <button className="navItem navItemActive" type="button"><Home size={28} fill="currentColor" />Home</button>
          <button className="navItem" type="button" onClick={openTikTokLogin}><UsersRound size={28} />Friends</button>
          <button className="navItem" type="button" onClick={openTikTokLogin} aria-label="Create post"><span className="postButton"><Plus size={25} strokeWidth={3.5} /></span></button>
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
        {sheet === "shop" && <ShopSheet clip={activeClip} onClose={() => setSheet(null)} />}
        {sheet === "assistant" && <AssistantPanel onClose={() => setSheet(null)} onLoginRequest={openTikTokLogin} />}
        {sheet === "tiktokLogin" && <TikTokLoginPrompt onClose={() => setSheet(null)} />}
        {sheet === "live" && <LiveShopPage soundOn={soundOn} onEnableSound={() => setSoundOn(true)} onClose={() => setSheet(null)} />}
      </section>
    </main>
  );
}

function AssistantPanel({ onClose, onLoginRequest }: { onClose: () => void; onLoginRequest: () => void }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Ask me anything about Riche Creme, checkout, shipping, or how it fits into the routine from the video.",
    },
  ]);

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = draft.trim();
    if (!question) return;

    setMessages((current) => [
      ...current,
      { from: "you", text: question },
      {
        from: "assistant",
        text: "Riche Creme is the 50 ml nourishing face cream shown here. It is $59, ships free, and you can tap Shop or Buy Now to check out through Petalcore.",
      },
    ]);
    setDraft("");
  }

  return (
    <section className="assistantPanel" aria-label="Petalcore product assistant">
      <header className="assistantHeader">
        <button type="button" onClick={onClose} aria-label="Back to feed"><ChevronDown size={32} /></button>
        <span className="assistantLogo"><span className="assistantFace" /></span>
        <strong>Petalcore Assistant</strong>
        <button type="button" onClick={onLoginRequest} aria-label="Assistant tools"><Wand2 size={25} /></button>
        <button type="button" onClick={onLoginRequest} aria-label="Assistant menu"><Menu size={28} /></button>
      </header>
      <div className="assistantContent">
        <h2>Ask about the product you watched</h2>
        <p>I can help with Riche Creme, ingredients, shipping, returns, and checkout.</p>
        <button className="assistantCard" type="button" onClick={() => setDraft("Is Riche Creme good under makeup?")}>
          <img src="/images/riche-creme.jpg" alt="" />
          <span>Ask about Riche Creme</span>
          <Send size={22} />
        </button>
        <button className="assistantCard" type="button" onClick={() => setDraft("How fast is shipping?")}>
          <img src="/images/product-hero.png" alt="" />
          <span>Ask about shipping and returns</span>
          <Send size={22} />
        </button>
        <div className="assistantMessages" aria-live="polite">
          {messages.map((message, index) => (
            <p className={message.from === "you" ? "assistantUserMessage" : "assistantBotMessage"} key={`${message.from}-${index}`}>
              {message.text}
            </p>
          ))}
        </div>
      </div>
      <form className="assistantInputDock" onSubmit={submitQuestion}>
        <button type="button" onClick={onLoginRequest} aria-label="Add"><Plus size={30} /></button>
        <input value={draft} placeholder="Ask anything" aria-label="Ask anything" onChange={(event) => setDraft(event.target.value)} />
        <button type="submit" aria-label="Ask"><Sparkles size={26} /></button>
      </form>
    </section>
  );
}

function TikTokLoginPrompt({ onClose }: { onClose: () => void }) {
  return (
    <section className="tiktokLoginPrompt" aria-label="Log in to TikTok">
      <button className="loginClose" type="button" onClick={onClose} aria-label="Close login prompt"><X size={22} /></button>
      <div className="tiktokMark" aria-hidden="true">♪</div>
      <h2>Log in to TikTok</h2>
      <p>Open TikTok to use this feature.</p>
      <a href="https://www.tiktok.com/login" rel="noreferrer" target="_blank">Continue with TikTok</a>
      <button type="button" onClick={onClose}>Not now</button>
    </section>
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

function ShopPreview({ clip }: { clip: (typeof clips)[number] }) {
  if ("videos" in clip && clip.videos) {
    const collageVideos = clip.videos;
    return (
      <div className="shopPreviewCollage">
        {collageVideos.map((video, index) => (
          <video
            autoPlay
            className={`shopPreviewVideo shopPreviewVideo${index + 1}`}
            key={video.src}
            loop
            muted
            playsInline
            poster={video.poster}
            preload="metadata"
            src={video.src}
          />
        ))}
      </div>
    );
  }

  return (
    <video
      autoPlay
      className="shopPreviewVideo"
      loop
      muted
      playsInline
      poster={clip.poster}
      preload="metadata"
      src={clip.src ?? ""}
    />
  );
}

function ShopSheet({ clip, onClose }: { clip: (typeof clips)[number]; onClose: () => void }) {
  return (
    <section className="sheet shopSheet" aria-label="Shop Petalcore">
      <div className="shopVideoPreview" aria-hidden="true">
        <ShopPreview clip={clip} />
      </div>
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
            Buy now
            <span>Free 3-day delivery</span>
          </a>
        </div>
      </footer>
    </section>
  );
}

function LiveShopPage({
  soundOn,
  onEnableSound,
  onClose,
}: {
  soundOn: boolean;
  onEnableSound: () => void;
  onClose: () => void;
}) {
  const [viewerCount, setViewerCount] = useState(6024);
  const [liveDraft, setLiveDraft] = useState("");
  const [liveCheckoutOpen, setLiveCheckoutOpen] = useState(false);
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

  function submitLiveComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = liveDraft.trim();
    if (!text) return;

    setLiveComments((current) => [
      ...current.slice(-5),
      { id: `you-${Date.now()}`, name: "you", text },
    ]);
    setLiveDraft("");
  }

  return (
    <section className="livePage" aria-label="Petalcore live shopping">
      <video
        className="livePageVideo"
        src="/videos/live-shopping.mp4"
        poster="/posters/live-shopping.jpg"
        autoPlay
        muted={!soundOn}
        playsInline
        loop
        onClick={onEnableSound}
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
        <button className="liveMiniProduct" type="button" aria-label="Live product preview" onClick={() => setLiveCheckoutOpen(true)}>
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
          <button type="button" onClick={() => setLiveCheckoutOpen(true)}>Buy</button>
        </article>
        <form className="liveInputDock" onSubmit={submitLiveComment}>
          <span className="liveBag">1</span>
          <input
            className="liveInput"
            type="text"
            value={liveDraft}
            placeholder="Type..."
            maxLength={80}
            aria-label="Type a live comment"
            onChange={(event) => setLiveDraft(event.target.value)}
          />
          <button type="submit" aria-label="Send live comment">☺</button>
          <span>🎁</span>
          <button className="liveShareButton" type="button" onClick={() => navigator.share?.({ title: "Petalcore LIVE", url: window.location.href })} aria-label="Share live">
            <TikTokShareIcon />
            <span className="liveShareCount">62</span>
          </button>
        </form>
      </footer>
      {liveCheckoutOpen && <LiveCheckoutOverlay onClose={() => setLiveCheckoutOpen(false)} />}
    </section>
  );
}

function LiveCheckoutOverlay({ onClose }: { onClose: () => void }) {
  return (
    <section className="liveCheckoutOverlay" aria-label="Live checkout">
      <button className="liveCheckoutBackdrop" type="button" aria-label="Close checkout" onClick={onClose} />
      <div className="liveCheckoutSheet">
        <span className="sheetHandle" />
        <header className="liveCheckoutHeader">
          <button type="button" onClick={onClose} aria-label="Back to live"><ChevronDown size={30} /></button>
          <h2>Checkout</h2>
          <span />
        </header>
        <div className="livePrivacyBand">
          <strong>Data privacy</strong>
          <span>Your info and data is not shared or sold without your consent.</span>
        </div>
        <div className="liveCheckoutBody">
          <section className="liveCheckoutSection">
            <h3>Shipping address</h3>
            <button type="button">Add an address <span>›</span></button>
          </section>
          <section className="liveCheckoutSection">
            <h3>Payment method</h3>
            <button type="button">Apple Pay <span>○</span></button>
            <button type="button">Credit or debit card <span>○</span></button>
            <button type="button">PayPal <span>○</span></button>
          </section>
          <section className="liveCheckoutProduct">
            <img src="/images/riche-creme.jpg" alt="Petalcore Riche Creme" />
            <div>
              <strong>Petalcore Riche Creme — Pro-Aging Nourishing Face Cream</strong>
              <span>Default · Free shipping</span>
              <em>Limited time deal</em>
              <p><span>-20%</span> <strong>$59.00</strong> <s>$74.00</s></p>
            </div>
          </section>
        </div>
        <footer className="liveCheckoutFooter">
          <div><span>Total (1 item)</span><strong>$59.00</strong></div>
          <a href={checkoutLink}>Pay now</a>
        </footer>
      </div>
    </section>
  );
}
