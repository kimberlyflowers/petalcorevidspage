"use client";

import { Bookmark, Heart, Home, MessageCircle, Search, Send, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type FeedVideo = {
  id: string;
  creator: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  viewCount?: number;
};

const manifestNames = [
  "advisor-michael-kitces", "advisor-carl-richards", "advisor-samantha-russell",
  "advisor-taylor-schulte", "advisor-jason-pereira", "advisor-meg-bartelt",
  "advisor-steve-sanduski", "advisor-penny-phillips", "advisor-jamie-hopkins", "advisor-josh-brown",
];

const formatCount = (count = 0) => count >= 1_000_000 ? `${(count / 1_000_000).toFixed(1)}M` : count >= 1_000 ? `${(count / 1_000).toFixed(1)}K` : `${count}`;

export default function FeedPage() {
  const [videos, setVideos] = useState<FeedVideo[]>([]);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all(manifestNames.map(async (name) => {
      const response = await fetch(`https://bloomie-watch.vercel.app/catalog/youtube/${name}.json`);
      if (!response.ok) return [];
      const manifest = await response.json();
      return (manifest.videos || []).slice(0, 3);
    })).then((groups) => setVideos(groups.flat())).catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>(".feedItem"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index || 0));
      });
    }, { root, threshold: .7 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [videos]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? videos.filter((video) => `${video.creator} ${video.title}`.toLowerCase().includes(needle)) : videos;
  }, [query, videos]);

  const toggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) => setter((current) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const share = async (video: FeedVideo) => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    if (navigator.share) await navigator.share({ title: video.title, text: video.title, url }).catch(() => undefined);
    else await navigator.clipboard.writeText(url);
  };

  return <main className="feedShell">
    <div className="feedViewport">
      <header className="feedHeader">
        <a className="watchBack" href="https://bloomie-watch.vercel.app"><span className="bMark">B</span><span>Watch</span></a>
        <nav aria-label="Feed tabs"><button>Following</button><button className="activeTab">For You</button></nav>
        <button className="searchToggle" aria-label="Search Feed" onClick={() => setSearching((value) => !value)}><Search /></button>
      </header>
      {searching && <label className="feedSearch"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search creators or topics" /></label>}
      <div className="feedScroller" ref={scroller} aria-label="Bloomie discovery feed">
        {filtered.map((video, index) => <article className="feedItem" data-index={index} key={video.id}>
          <div className="mediaStage">
            {index === active ? <iframe title={video.title} src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&rel=0&modestbranding=1&playsinline=1`} allow="autoplay; encrypted-media; picture-in-picture; web-share" allowFullScreen /> : <img src={video.thumbnailUrl.replace("hqdefault", "maxresdefault")} onError={(event) => { event.currentTarget.src = video.thumbnailUrl; }} alt="" />}
          </div>
          <span className="feedShade" />
          <button className="soundButton" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Turn sound on" : "Mute video"}>{muted ? <VolumeX /> : <Volume2 />}</button>
          <div className="feedCopy"><strong>@{video.creator.replaceAll(" ", "").toLowerCase()}</strong><p>{video.title}</p><small>{video.creator} · Recent</small></div>
          <aside className="feedActions" aria-label="Video actions">
            <span className="creatorAvatar">{video.creator.split(" ").map((part) => part[0]).slice(0,2).join("")}</span>
            <button className={liked.has(video.id) ? "selected" : ""} onClick={() => toggle(setLiked, video.id)} aria-label="Like video"><Heart /><small>{formatCount(video.viewCount)}</small></button>
            <button aria-label="Comments"><MessageCircle /><small>Discuss</small></button>
            <button className={saved.has(video.id) ? "selected" : ""} onClick={() => toggle(setSaved, video.id)} aria-label="Save video"><Bookmark /><small>Save</small></button>
            <button onClick={() => share(video)} aria-label="Share video"><Send /><small>Share</small></button>
          </aside>
        </article>)}
        {!filtered.length && <section className="emptyFeed"><strong>No recent videos match that search.</strong></section>}
      </div>
      <nav className="bottomNav" aria-label="Bloomie navigation"><a href="https://bloomie-watch.vercel.app"><Home /><span>Watch</span></a><a className="active" href="/"><span className="feedPulse">▶</span><span>Feed</span></a><button onClick={() => setSearching(true)}><Search /><span>Discover</span></button></nav>
    </div>
  </main>;
}
