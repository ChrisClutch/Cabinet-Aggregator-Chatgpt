"use client";

import {useEffect, useState, useRef, useCallback} from "react";
import {apartmentHero} from "@/lib/catalog";

const kitchen = "https://images.pexels.com/photos/7546561/pexels-photo-7546561.jpeg?auto=compress&cs=tinysrgb&w=1800&q=85";

export default function HeroMotion() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const exterior = useRef<HTMLImageElement>(null);
  const interior = useRef<HTMLImageElement>(null);
  const checkReady = useCallback(() => setLoaded(exterior.current?.complete && exterior.current.naturalWidth && interior.current?.complete && interior.current.naturalWidth ? 2 : 0), []);
  useEffect(() => {
    checkReady();
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [checkReady]);
  const running = loaded >= 2 && !paused && !reduced;
  return <div className="hero-image cinematic-hero" data-ready={loaded >= 2} data-running={running}>
    <img ref={exterior} className="hero-scene exterior-scene" src={apartmentHero} alt="Multifamily apartment building exterior" onLoad={checkReady} fetchPriority="high" />
    <img ref={interior} className="hero-scene kitchen-scene" src={kitchen} alt="Illustrative apartment kitchen with fitted cabinetry" onLoad={checkReady} />
    <div className="image-caption">
      <span>FROM THE COMMUNITY TO THE CABINETRY</span>
      <p>Built at scale.<br/>Considered in every detail.</p>
      <small>Illustrative exterior-to-interior sequence</small>
    </div>
    <span className="image-index">MULTIFAMILY / INSIDE & OUT</span>
    <button className="motion-control" onClick={() => setPaused(p => !p)} disabled={reduced || loaded < 2} aria-label={reduced ? "Animation disabled by reduced-motion preference" : paused ? "Play hero animation" : "Pause hero animation"}>
      {reduced ? "Still view" : paused ? "▶ Play" : "Ⅱ Pause"}
    </button>
    <div className="hero-progress" aria-hidden="true"><span /></div>
  </div>;
}
