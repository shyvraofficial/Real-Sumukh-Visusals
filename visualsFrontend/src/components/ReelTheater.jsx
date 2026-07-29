import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaPlay,
  FaTimes,
} from "react-icons/fa";

/**
 * ReelTheater — dark electric-blue client-work section.
 *
 * Temporary version:
 * - Uses poster images only (no real video files yet).
 * - Desktop: short native vertical scroll controls the project carousel.
 * - Mobile/tablet: swipe, arrows, or project numbers.
 * - Replace each `poster` later with your own thumbnail and add videos when ready.
 * - Sticky viewport fix: the root must not use overflow:hidden on desktop.
 */

const PROJECTS = [
  {
    id: "tanish-garg",
    client: "Tanish Garg",
    title: "295 KG Block Pull",
    category: "Fitness Reel",
    duration: "38 sec",
    poster: "https://assets.mixkit.co/videos/52080/52080-thumb-360-0.jpg",
    accent: "#0797FF",
    description:
      "A heavy-lift edit built around tension, impact and a clean cinematic finish.",
  },
  {
    id: "ravi-rathee",
    client: "Ravi Rathee",
    title: "Personal Brand Reel",
    category: "Creator Reel",
    duration: "45 sec",
    poster: "https://assets.mixkit.co/videos/40788/40788-thumb-360-0.jpg",
    accent: "#08B9FF",
    description:
      "A sharp personal-brand edit designed around speech rhythm and confident pacing.",
  },
  {
    id: "training-film",
    client: "Training Film",
    title: "Built Through Repetition",
    category: "Cinematic Reel",
    duration: "52 sec",
    poster: "https://assets.mixkit.co/videos/52079/52079-thumb-360-0.jpg",
    accent: "#3478FF",
    description:
      "A darker training film using sound-led transitions and controlled visual momentum.",
  },
  {
    id: "campaign-edit",
    client: "Fitness Campaign",
    title: "No Wasted Frames",
    category: "Campaign Cut",
    duration: "29 sec",
    poster: "https://assets.mixkit.co/videos/52082/52082-thumb-360-0.jpg",
    accent: "#00D1E8",
    description:
      "A fast campaign cut with compact storytelling and beat-matched movement.",
  },
  {
    id: "performance-reel",
    client: "Performance Reel",
    title: "Presence On Camera",
    category: "Personal Brand",
    duration: "41 sec",
    poster: "https://assets.mixkit.co/videos/40160/40160-thumb-360-0.jpg",
    accent: "#5C8DFF",
    description:
      "A clean creator edit that keeps attention on performance instead of unnecessary effects.",
  },
];

const DESKTOP_MIN_WIDTH = 1024;
const SECTION_HEIGHT = "235vh";
const SWIPE_THRESHOLD = 54;

function pad(value) {
  return String(value).padStart(2, "0");
}

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

export default function ReelTheater() {
  const total = PROJECTS.length;

  const sectionRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const dragStartRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const active = PROJECTS[activeIndex];
  const previous = PROJECTS[wrapIndex(activeIndex - 1, total)];
  const next = PROJECTS[wrapIndex(activeIndex + 1, total)];

  const visibleProgress = isDesktop
    ? sectionProgress
    : total > 1
    ? activeIndex / (total - 1)
    : 0;

  const updateActiveIndex = useCallback(
    (nextIndex) => {
      const wrapped = wrapIndex(nextIndex, total);

      setActiveIndex((current) => {
        if (current === wrapped) return current;

        const forwardDistance = wrapIndex(wrapped - current, total);
        const backwardDistance = wrapIndex(current - wrapped, total);

        setDirection(forwardDistance <= backwardDistance ? 1 : -1);
        return wrapped;
      });
    },
    [total]
  );

  const goTo = useCallback(
    (nextIndex) => {
      const wrapped = wrapIndex(nextIndex, total);

      if (isDesktop && scrollAreaRef.current) {
        const area = scrollAreaRef.current;
        const areaTop = window.scrollY + area.getBoundingClientRect().top;
        const scrollable = Math.max(area.offsetHeight - window.innerHeight, 0);
        const ratio = total > 1 ? wrapped / (total - 1) : 0;

        window.scrollTo({
          top: areaTop + scrollable * ratio,
          behavior: reducedMotion ? "auto" : "smooth",
        });
        return;
      }

      updateActiveIndex(wrapped);
    },
    [isDesktop, reducedMotion, total, updateActiveIndex]
  );

  const goPrevious = useCallback(
    () => goTo(activeIndex - 1),
    [activeIndex, goTo]
  );

  const goNext = useCallback(
    () => goTo(activeIndex + 1),
    [activeIndex, goTo]
  );

  // Responsive and reduced-motion detection.
  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${DESKTOP_MIN_WIDTH}px) and (pointer: fine)`
    );
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const sync = () => {
      setReducedMotion(motionQuery.matches);
      setIsDesktop(desktopQuery.matches && !motionQuery.matches);
    };

    sync();
    desktopQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      desktopQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  // Track section visibility for keyboard navigation and navbar hiding.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const setNavbarHidden = (hidden) => {
      window.dispatchEvent(
        new CustomEvent("reel-theater-nav-visibility", {
          detail: { hidden },
        })
      );
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const hidden = entry.isIntersecting && entry.intersectionRatio > 0.12;

        setSectionInView(entry.isIntersecting);
        setNavbarHidden(hidden);
      },
      { threshold: [0, 0.12, 0.4, 1] }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      setNavbarHidden(false);
    };
  }, []);

  // Desktop native scroll -> carousel index.
  useEffect(() => {
    if (!isDesktop) {
      setSectionProgress(
        total > 1 ? activeIndex / (total - 1) : 0
      );
      return undefined;
    }

    let frame = 0;

    const updateFromScroll = () => {
      frame = 0;

      const area = scrollAreaRef.current;
      if (!area) return;

      const rect = area.getBoundingClientRect();
      const scrollable = Math.max(area.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const progress = scrolled / scrollable;
      const nextIndex = Math.min(
        total - 1,
        Math.max(0, Math.round(progress * (total - 1)))
      );

      setSectionProgress(progress);
      updateActiveIndex(nextIndex);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [activeIndex, isDesktop, total, updateActiveIndex]);

  // Keyboard navigation only while this section is visible.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (!sectionInView) return;

      if (modalOpen) {
        if (event.key === "Escape") setModalOpen(false);
        return;
      }

      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrevious, modalOpen, sectionInView]);

  // Prevent background scrolling while the project preview is open.
  useEffect(() => {
    if (!modalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  const onPointerDown = (event) => {
    if (isDesktop) return;

    dragStartRef.current = event.clientX;
    dragDistanceRef.current = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragging || isDesktop) return;
    dragDistanceRef.current = event.clientX - dragStartRef.current;
  };

  const finishDrag = () => {
    if (!dragging || isDesktop) return;

    if (dragDistanceRef.current <= -SWIPE_THRESHOLD) goNext();
    if (dragDistanceRef.current >= SWIPE_THRESHOLD) goPrevious();

    dragStartRef.current = 0;
    dragDistanceRef.current = 0;
    setDragging(false);
  };

  const projectNumbers = useMemo(
    () =>
      PROJECTS.map((project, index) => (
        <button
          key={project.id}
          type="button"
          className="sw-number"
          data-active={index === activeIndex ? "true" : "false"}
          onClick={() => goTo(index)}
          aria-label={`Open project ${index + 1}: ${project.client}`}
          aria-current={index === activeIndex ? "true" : undefined}
        >
          {pad(index + 1)}
        </button>
      )),
    [activeIndex, goTo]
  );

  return (
    <section
      ref={sectionRef}
      className="sw-root"
      data-desktop={isDesktop ? "true" : "false"}
      style={{
        "--sw-accent": active.accent,
        "--sw-section-height": SECTION_HEIGHT,
      }}
      aria-label="Selected client work"
    >
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        .sw-root,
        .sw-root * {
          box-sizing: border-box;
        }

        .sw-root {
          --sw-bg: #030711;
          --sw-bg-soft: #06101f;
          --sw-white: #f7f9fc;
          --sw-muted: #818b9c;
          --sw-faint: #536074;
          --sw-border: rgba(184, 196, 214, 0.22);
          --sw-ease: cubic-bezier(0.19, 1, 0.22, 1);
          position: relative;
          isolation: isolate;
          overflow: visible;
          background:
            radial-gradient(
              ellipse at 55% 50%,
              rgba(32, 43, 63, 0.34),
              transparent 44%
            ),
            linear-gradient(120deg, #020307 0%, #05070d 52%, #020307 100%);
          color: var(--sw-white);
          font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          text-rendering: geometricPrecision;
        }

        .sw-root[data-desktop="false"] {
          overflow: hidden;
        }

        .sw-root::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0.08;
          background-image:
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.014) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(circle at center, black, transparent 78%);
        }

        .sw-root::after {
          content: "";
          position: absolute;
          width: min(46vw, 760px);
          aspect-ratio: 1;
          left: 54%;
          top: 49%;
          transform: translate(-50%, -50%);
          z-index: -1;
          border-radius: 50%;
          pointer-events: none;
          background: var(--sw-accent);
          opacity: 0.045;
          filter: blur(130px);
          transition:
            background 650ms var(--sw-ease),
            opacity 650ms var(--sw-ease);
        }

        .sw-scroll-area {
          position: relative;
        }

        .sw-root[data-desktop="true"] .sw-scroll-area {
          height: var(--sw-section-height);
          min-height: 100vh;
        }

        .sw-sticky {
          position: relative;
          min-height: 100svh;
          width: 100%;
          padding: clamp(50px, 6.3vh, 66px) clamp(28px, 5.4vw, 96px)
            clamp(30px, 4vh, 42px);
        }

        .sw-root[data-desktop="true"] .sw-sticky {
          position: sticky;
          inset-block-start: 0;
          width: 100%;
          height: 100dvh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .sw-mobile-menu {
          display: none;
        }

        .sw-layout {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns:
            minmax(320px, 420px)
            minmax(410px, 450px)
            minmax(300px, 360px);
          grid-template-areas:
            "rail rail rail"
            "intro visual info"
            "bottom bottom bottom";
          align-items: center;
          justify-content: center;
          column-gap: clamp(34px, 3.4vw, 58px);
          row-gap: clamp(22px, 3vh, 38px);
          width: min(100%, 1440px);
          min-height: calc(100svh - clamp(96px, 12vh, 108px));
          margin: 0 auto;
        }

        .sw-root[data-desktop="true"] .sw-layout {
          min-height: 0;
          max-height: calc(100dvh - 56px);
        }

        .sw-top-rail {
          grid-area: rail;
          display: grid;
          grid-template-columns: auto minmax(120px, 1fr) auto;
          align-items: center;
          gap: 26px;
          width: 100%;
        }

        .sw-rail-line {
          height: 1px;
          background: rgba(192, 201, 216, 0.12);
        }

        .sw-rail-index {
          margin: 0;
          color: #8b93a1;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 0.08em;
        }

        .sw-rail-index strong {
          color: #3d82ff;
          font-weight: 600;
        }

        .sw-intro {
          grid-area: intro;
          align-self: start;
          padding-top: clamp(0px, 1.4vh, 16px);
        }

        .sw-root[data-desktop="true"] .sw-intro {
          transform: translateY(clamp(-22px, -3vh, -10px));
        }

        .sw-kicker {
          margin: 0;
          color: #a8adb7;
          font-size: clamp(10px, 0.82vw, 13px);
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .sw-heading {
          margin: 0;
          max-width: 11ch;
          color: var(--sw-white);
          font-size: clamp(52px, 4.6vw, 82px);
          font-weight: 760;
          letter-spacing: -0.07em;
          line-height: 1.04;
          text-transform: none;
        }

        .sw-intro-mark {
          display: block;
          width: 46px;
          height: 3px;
          margin: 34px 0 27px;
          border-radius: 999px;
          background: #4b7dff;
        }

        .sw-subtitle {
          max-width: 260px;
          margin: 0;
          color: #a2a7b0;
          font-size: clamp(15px, 1.05vw, 19px);
          font-weight: 500;
          line-height: 1.55;
        }

        .sw-subtitle-mobile {
          display: none;
        }

        .sw-visual {
          grid-area: visual;
          position: relative;
          display: grid;
          place-items: center;
          min-width: 0;
        }

        .sw-main-card {
          position: relative;
          width: auto;
          height: clamp(535px, 71svh, 675px);
          aspect-ratio: 9 / 13.7;
          overflow: hidden;
          border: 1px solid rgba(207, 216, 230, 0.36);
          border-radius: 20px;
          background: #050912;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.012) inset,
            0 28px 90px rgba(0, 0, 0, 0.46);
          cursor: pointer;
          touch-action: pan-y;
          animation:
            sw-card-enter 650ms var(--sw-ease) both;
          transition:
            border-color 500ms var(--sw-ease),
            box-shadow 500ms var(--sw-ease),
            transform 420ms var(--sw-ease);
        }

        .sw-main-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.018) inset,
            0 32px 100px rgba(0, 0, 0, 0.54);
        }

        .sw-main-card[data-dragging="true"] {
          cursor: grabbing;
        }

        .sw-main-card-image,
        .sw-peek-image,
        .sw-modal-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        .sw-main-card-image {
          animation: sw-image-enter 780ms var(--sw-ease) both;
          filter: saturate(0.74) brightness(0.68) contrast(1.12);
        }

        .sw-main-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(
              180deg,
              rgba(1, 5, 13, 0.5) 0%,
              transparent 24%,
              transparent 62%,
              rgba(1, 5, 13, 0.42) 100%
            );
          pointer-events: none;
        }

        .sw-card-top {
          display: none;
        }

        .sw-center-play {
          position: absolute;
          z-index: 3;
          left: 50%;
          top: 50%;
          display: grid;
          place-items: center;
          width: clamp(76px, 6.2vw, 104px);
          height: clamp(76px, 6.2vw, 104px);
          border: 1px solid rgba(244, 247, 252, 0.72);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.32);
          color: #fff;
          transform: translate(-50%, -50%);
          backdrop-filter: blur(7px);
          cursor: pointer;
          transition: transform 280ms var(--sw-ease), background 280ms ease;
        }

        .sw-center-play:hover {
          background: rgba(0, 0, 0, 0.46);
          transform: translate(-50%, -50%) scale(1.04);
        }

        .sw-center-play svg {
          margin-left: 5px;
        }

        .sw-duration {
          color: rgba(238, 245, 255, 0.72);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }

        .sw-card-progress {
          display: none;
        }

        .sw-card-progress::after {
          content: "";
          display: block;
          width: 31%;
          height: 100%;
          background: var(--sw-accent);
          box-shadow: 0 0 14px var(--sw-accent);
        }

        @keyframes sw-card-enter {
          from {
            opacity: 0;
            transform: translateX(calc(var(--sw-direction, 1) * 34px))
              scale(0.975);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes sw-image-enter {
          from {
            transform: scale(1.055);
            filter: saturate(0.72) brightness(0.62) contrast(1.04);
          }
          to {
            transform: scale(1);
            filter: saturate(0.74) brightness(0.68) contrast(1.12);
          }
        }

        .sw-info {
          --sw-info-offset: 0px;
          grid-area: info;
          align-self: center;
          animation: sw-info-enter 560ms var(--sw-ease) both;
        }

        .sw-root[data-desktop="true"] .sw-info {
          --sw-info-offset: clamp(8px, 2vh, 26px);
        }

        @keyframes sw-info-enter {
          from {
            opacity: 0;
            transform: translateY(calc(var(--sw-info-offset) + 18px));
          }
          to {
            opacity: 1;
            transform: translateY(var(--sw-info-offset));
          }
        }

        .sw-index {
          margin: 0 0 26px;
          color: var(--sw-muted);
          font-size: clamp(15px, 1.15vw, 20px);
          font-weight: 600;
          letter-spacing: -0.015em;
        }

        .sw-index strong {
          color: var(--sw-accent);
          font-weight: 700;
        }

        .sw-root[data-desktop="true"] .sw-info .sw-index {
          display: none;
        }

        .sw-info-category {
          margin: 0 0 27px;
          color: #4b82ff;
          font-size: 13px;
          font-weight: 650;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .sw-client {
          margin: 0;
          color: var(--sw-white);
          font-size: clamp(34px, 3vw, 50px);
          font-weight: 760;
          letter-spacing: -0.07em;
          line-height: 1.02;
        }

        .sw-project-title {
          margin: 18px 0 0;
          color: #4b82ff;
          font-size: clamp(24px, 2vw, 34px);
          font-weight: 520;
          letter-spacing: -0.055em;
          line-height: 1.18;
        }

        .sw-info-divider {
          width: min(100%, 300px);
          height: 1px;
          margin: 34px 0 27px;
          background: rgba(196, 207, 224, 0.2);
        }

        .sw-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 11px;
          margin: 0;
          padding-top: 0;
          border-top: 0;
          color: #9da3ad;
          font-size: 15px;
          font-weight: 500;
        }

        .sw-meta-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4b82ff;
        }

        .sw-description {
          max-width: 330px;
          margin: 31px 0 0;
          color: #a2a7b0;
          font-size: 16px;
          line-height: 1.62;
        }

        .sw-bottom {
          grid-area: bottom;
          display: grid;
          grid-template-columns: auto minmax(180px, 1fr) auto;
          align-items: end;
          gap: clamp(24px, 4vw, 60px);
          width: min(100%, 1240px);
          margin: 0 auto;
        }

        .sw-root[data-desktop="true"] .sw-bottom {
          transform: translateY(clamp(16px, 3.8vh, 34px));
        }

        .sw-nav-action {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          border: 0;
          padding: 0;
          background: transparent;
          color: #a5a9b2;
          font: inherit;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .sw-nav-action[data-side="next"] {
          flex-direction: row-reverse;
        }

        .sw-root[data-desktop="true"] .sw-pagination {
          visibility: hidden;
        }

        .sw-nav-circle {
          display: grid;
          place-items: center;
          width: 50px;
          height: 50px;
          border: 1px solid rgba(166, 195, 232, 0.32);
          border-radius: 50%;
          color: #d2d7df;
          transition:
            transform 280ms var(--sw-ease),
            border-color 280ms ease,
            color 280ms ease,
            box-shadow 280ms ease;
        }

        .sw-nav-action:hover .sw-nav-circle {
          transform: scale(1.06);
          border-color: rgba(255, 255, 255, 0.58);
          color: #fff;
          box-shadow: 0 0 22px rgba(75, 130, 255, 0.18);
        }

        .sw-pagination {
          min-width: 0;
        }

        .sw-progress-track {
          position: relative;
          width: 100%;
          height: 2px;
          margin-bottom: 27px;
          background: rgba(128, 164, 211, 0.16);
        }

        .sw-progress-fill {
          position: relative;
          width: 0;
          height: 100%;
          background: var(--sw-accent);
          box-shadow: 0 0 16px var(--sw-accent);
          transition:
            width 200ms linear,
            background 500ms var(--sw-ease);
        }

        .sw-progress-fill::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--sw-accent);
          box-shadow: 0 0 18px var(--sw-accent);
          transform: translateY(-50%);
        }

        .sw-numbers {
          display: flex;
          justify-content: center;
          gap: clamp(22px, 3.2vw, 48px);
        }

        .sw-number {
          position: relative;
          border: 0;
          padding: 0 0 17px;
          background: transparent;
          color: #596579;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: color 260ms ease;
        }

        .sw-number::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: transparent;
          transform: translateX(-50%);
          transition:
            background 260ms ease,
            box-shadow 260ms ease;
        }

        .sw-number:hover,
        .sw-number[data-active="true"] {
          color: var(--sw-accent);
        }

        .sw-number[data-active="true"]::after {
          background: var(--sw-accent);
          box-shadow: 0 0 12px var(--sw-accent);
        }

        .sw-peek {
          position: absolute;
          max-width: 34vw;
          top: 70%;
          z-index: 1;
          width: clamp(240px, 22vw, 360px);
          aspect-ratio: 9 / 13.65;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--sw-accent) 35%, transparent);
          border-radius: 16px;
          background: #050912;
          opacity: 0.5;
          cursor: pointer;
          transform: translateY(-50%);
          transition:
            opacity 360ms var(--sw-ease),
            transform 480ms var(--sw-ease),
            border-color 500ms var(--sw-ease);
        }

        .sw-peek:hover {
          opacity: 0.62;
        }

        .sw-peek::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(1,5,13,0.12), rgba(1,5,13,0.72)),
            rgba(1, 5, 13, 0.2);
        }

        .sw-peek-left {
          left: clamp(-188px, -10.6vw, -112px);
        }

        .sw-peek-right {
          right: clamp(-188px, -10.6vw, -112px);
        }

        .sw-peek-right::after {
          background:
            linear-gradient(270deg, rgba(1,5,13,0.12), rgba(1,5,13,0.72)),
            rgba(1, 5, 13, 0.2);
        }

        .sw-peek-image {
          filter: saturate(0.6) brightness(0.5) contrast(1.08);
        }

        .sw-peek-duration {
          position: absolute;
          top: 20px;
          z-index: 2;
          color: rgba(228, 238, 252, 0.56);
          font-size: 12px;
          font-weight: 600;
        }

        .sw-peek-left .sw-peek-duration {
          right: 18px;
        }

        .sw-peek-right .sw-peek-duration {
          left: 18px;
        }

        .sw-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(1, 4, 10, 0.84);
          backdrop-filter: blur(18px);
          animation: sw-modal-fade 240ms ease both;
        }

        @keyframes sw-modal-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sw-modal {
          position: relative;
          display: grid;
          grid-template-columns: minmax(260px, 430px) minmax(260px, 420px);
          gap: clamp(28px, 4vw, 70px);
          align-items: center;
          width: min(100%, 980px);
          max-height: 90vh;
          overflow: auto;
          padding: clamp(24px, 4vw, 52px);
          border: 1px solid var(--sw-border);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 24% 44%,
              color-mix(in srgb, var(--sw-accent) 24%, transparent),
              transparent 40%
            ),
            #050a14;
          box-shadow: 0 35px 120px rgba(0,0,0,0.64);
        }

        .sw-modal-poster {
          overflow: hidden;
          aspect-ratio: 9 / 14;
          border: 1px solid color-mix(in srgb, var(--sw-accent) 52%, transparent);
          border-radius: 15px;
        }

        .sw-modal-image {
          filter: saturate(0.86) brightness(0.84);
        }

        .sw-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(184, 207, 237, 0.24);
          border-radius: 50%;
          background: rgba(3, 8, 18, 0.7);
          color: #dfe9f6;
          cursor: pointer;
        }

        .sw-modal-label {
          margin: 0 0 20px;
          color: var(--sw-accent);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sw-modal-title {
          margin: 0;
          font-size: clamp(34px, 4vw, 58px);
          font-weight: 750;
          letter-spacing: -0.055em;
          line-height: 0.98;
        }

        .sw-modal-project {
          margin: 15px 0 0;
          color: var(--sw-accent);
          font-size: clamp(20px, 2vw, 29px);
          font-weight: 500;
          letter-spacing: -0.035em;
        }

        .sw-modal-copy {
          margin: 28px 0 0;
          color: #98a5b6;
          font-size: 14px;
          line-height: 1.8;
        }

        .sw-modal-note {
          margin: 28px 0 0;
          padding-top: 20px;
          border-top: 1px solid rgba(134, 174, 226, 0.16);
          color: #657187;
          font-size: 12px;
          line-height: 1.65;
        }

        button:focus-visible,
        .sw-main-card:focus-visible {
          outline: 2px solid var(--sw-accent);
          outline-offset: 5px;
        }

        @media (max-width: 1180px) and (min-width: 1024px) {
          .sw-layout {
            grid-template-columns:
              minmax(250px, 340px)
              minmax(320px, 420px)
              minmax(230px, 320px);
            column-gap: 30px;
          }

          .sw-heading {
            font-size: clamp(54px, 6vw, 78px);
          }

          .sw-main-card {
            width: auto;
            height: clamp(500px, 70svh, 640px);
          }

          .sw-description {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .sw-root {
            background:
              radial-gradient(
                circle at 50% 37%,
                color-mix(in srgb, var(--sw-accent) 20%, transparent),
                transparent 30%
              ),
              radial-gradient(
                circle at 50% 42%,
                rgba(0, 58, 136, 0.16),
                transparent 48%
              ),
              linear-gradient(165deg, #000207, #030914 48%, #000207);
          }

          .sw-root::after {
            width: 120vw;
            left: 50%;
            top: 41%;
            opacity: 0.08;
            filter: blur(96px);
          }

          .sw-sticky {
            min-height: auto;
            padding: 58px 0 56px;
          }

          .sw-mobile-menu {
            position: absolute;
            top: 58px;
            right: clamp(24px, 8vw, 74px);
            z-index: 4;
            display: grid;
            gap: 7px;
            width: 31px;
          }

          .sw-mobile-menu span {
            display: block;
            height: 2px;
            border-radius: 999px;
            background: rgba(247,249,252,0.86);
            box-shadow: 0 0 10px rgba(255,255,255,0.14);
          }

          .sw-layout {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            width: 100%;
          }

          .sw-top-rail {
            width: min(100%, 620px);
            margin: 0 auto 42px;
            padding: 0 clamp(22px, 8vw, 38px);
            grid-template-columns: auto minmax(54px, 1fr);
          }

          .sw-rail-index {
            display: none;
          }

          .sw-intro {
            width: min(100%, 620px);
            margin: 0 auto;
            padding: 0 clamp(22px, 8vw, 38px);
          }

          .sw-kicker {
            margin-bottom: 23px;
            font-size: 11px;
          }

          .sw-heading {
            max-width: none;
            font-size: clamp(46px, 12.2vw, 76px);
            letter-spacing: -0.07em;
            line-height: 1.02;
          }

          .sw-intro-mark {
            margin: 28px 0 24px;
          }

          .sw-subtitle {
            margin-top: 22px;
            font-size: 14px;
            line-height: 1.55;
          }

          .sw-subtitle-desktop {
            display: none;
          }

          .sw-subtitle-mobile {
            display: inline;
          }

          .sw-visual {
            width: 100%;
            margin: 44px auto 0;
          }

          .sw-main-card {
            width: min(73vw, 560px);
            height: auto;
            aspect-ratio: 9 / 13.45;
            border-radius: 20px;
          }

          .sw-main-card:hover {
            transform: none;
          }

          .sw-card-top {
            inset: 18px 17px auto;
          }

          .sw-center-play {
            width: 78px;
            height: 78px;
          }

          .sw-play-button {
            min-height: 36px;
            padding-inline: 14px;
            font-size: 10px;
          }

          .sw-duration {
            font-size: 12px;
          }

          .sw-peek {
            top: 51%;
            width: min(43vw, 300px);
            border-radius: 14px;
            opacity: 0.35;
          }

          .sw-peek-left {
            left: calc(-1 * min(31vw, 218px));
          }

          .sw-peek-right {
            right: calc(-1 * min(31vw, 218px));
          }

          .sw-info {
            width: min(73vw, 560px);
            margin: 28px auto 0;
          }

          .sw-index {
            margin-bottom: 19px;
            font-size: 16px;
          }

          .sw-client {
            font-size: clamp(27px, 7vw, 36px);
          }

          .sw-project-title {
            margin-top: 9px;
            font-size: clamp(21px, 5.8vw, 29px);
          }

          .sw-meta {
            margin-top: 18px;
            padding-top: 0;
            border-top: 0;
            font-size: 13px;
          }

          .sw-info-divider {
            margin: 22px 0 18px;
          }

          .sw-description {
            display: none;
          }

          .sw-bottom {
            display: grid;
            grid-template-columns: 68px minmax(0, 1fr) 68px;
            gap: 22px;
            align-items: end;
            width: min(78vw, 560px);
            margin: 40px auto 0;
          }

          .sw-nav-action {
            display: flex;
            flex-direction: column !important;
            gap: 12px;
            font-size: 9px;
            letter-spacing: 0.2em;
          }

          .sw-nav-action[data-side="next"] {
            justify-self: end;
          }

          .sw-nav-circle {
            width: 52px;
            height: 52px;
          }

          .sw-progress-track {
            margin-bottom: 24px;
          }

          .sw-numbers {
            justify-content: space-between;
            gap: 8px;
          }

          .sw-number {
            font-size: 11px;
          }

          .sw-modal {
            grid-template-columns: 1fr;
            width: min(100%, 520px);
          }

          .sw-modal-poster {
            width: min(100%, 330px);
            margin: 0 auto;
          }
        }

        @media (max-width: 520px) {
          .sw-sticky {
            padding: 54px 0 52px;
          }

          .sw-mobile-menu {
            top: 54px;
            right: 22px;
            width: 27px;
          }

          .sw-heading {
            font-size: clamp(49px, 15vw, 68px);
          }

          .sw-main-card,
          .sw-info {
            width: min(82vw, 390px);
          }

          .sw-peek {
            width: 44vw;
          }

          .sw-peek-left {
            left: -33vw;
          }

          .sw-peek-right {
            right: -33vw;
          }

          .sw-card-top {
            inset: 14px 13px auto;
          }

          .sw-play-button {
            min-height: 32px;
            padding-inline: 12px;
          }

          .sw-card-progress {
            inset-inline: 15px;
            bottom: 14px;
          }

          .sw-bottom {
            grid-template-columns: 52px minmax(0, 1fr) 52px;
            gap: 12px;
            width: min(82vw, 390px);
          }

          .sw-nav-circle {
            width: 46px;
            height: 46px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sw-root *,
          .sw-root *::before,
          .sw-root *::after {
            scroll-behavior: auto !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
          }
        }
      `}</style>

      <div ref={scrollAreaRef} className="sw-scroll-area">
        <div className="sw-sticky">
          <button
            type="button"
            className="sw-peek sw-peek-left"
            onClick={goPrevious}
            aria-label={`Previous project: ${previous.client}`}
          >
            <img
              src={previous.poster}
              alt=""
              className="sw-peek-image"
              draggable="false"
            />
            <span className="sw-peek-duration">{previous.duration}</span>
          </button>

          <button
            type="button"
            className="sw-peek sw-peek-right"
            onClick={goNext}
            aria-label={`Next project: ${next.client}`}
          >
            <img
              src={next.poster}
              alt=""
              className="sw-peek-image"
              draggable="false"
            />
            <span className="sw-peek-duration">{next.duration}</span>
          </button>

          <div className="sw-layout">
            <div className="sw-top-rail">
              <p className="sw-kicker">Selected Client Work</p>
              <span className="sw-rail-line" aria-hidden="true" />
              <p className="sw-rail-index">
                <strong>{pad(activeIndex + 1)}</strong> / {pad(total)}
              </p>
            </div>

            <header className="sw-intro">
              <h2 className="sw-heading">
                Selected
                <br />
                Client Work
              </h2>
              <span className="sw-intro-mark" aria-hidden="true" />
              <p className="sw-subtitle">
                <span className="sw-subtitle-desktop">
                  Fitness, personal brand &amp; short films
                </span>
                <span className="sw-subtitle-mobile">
                  Reel editing for brands, athletes &amp; creators.
                </span>
              </p>
            </header>

            <div className="sw-visual">
              <article
                key={`card-${active.id}`}
                className="sw-main-card"
                data-dragging={dragging ? "true" : "false"}
                style={{ "--sw-direction": direction }}
                role="button"
                tabIndex={0}
                aria-label={`Open ${active.client}: ${active.title}`}
                onClick={() => setModalOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setModalOpen(true);
                  }
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onPointerLeave={finishDrag}
              >
                <img
                  key={active.poster}
                  src={active.poster}
                  alt={`${active.client} — ${active.title}`}
                  className="sw-main-card-image"
                  draggable="false"
                />

                <button
                  type="button"
                  className="sw-center-play"
                  onClick={(event) => {
                    event.stopPropagation();
                    setModalOpen(true);
                  }}
                  aria-label={`Play ${active.client} reel`}
                >
                  <FaPlay size={28} aria-hidden="true" />
                </button>

                <div className="sw-card-progress" aria-hidden="true" />
              </article>
            </div>

            <div key={`info-${active.id}`} className="sw-info">
              <p className="sw-index">
                <strong>{pad(activeIndex + 1)}</strong> / {pad(total)}
              </p>
              <p className="sw-info-category">{active.category}</p>
              <h3 className="sw-client">{active.client}</h3>
              <p className="sw-project-title">{active.title}</p>

              <div className="sw-info-divider" aria-hidden="true" />

              <div className="sw-meta">
                <span>{active.duration}</span>
                <span className="sw-meta-dot" aria-hidden="true" />
                <span>Vertical Reel</span>
                <span className="sw-meta-dot" aria-hidden="true" />
                <span>{active.category.replace(" Reel", "")}</span>
              </div>

              <p className="sw-description">{active.description}</p>
            </div>

            <div className="sw-bottom">
              <button
                type="button"
                className="sw-nav-action"
                data-side="previous"
                onClick={goPrevious}
                aria-label="Previous project"
              >
                <span className="sw-nav-circle">
                  <FaArrowLeft size={15} aria-hidden="true" />
                </span>
                <span>Prev</span>
              </button>

              <div className="sw-pagination">
                <div className="sw-progress-track" aria-hidden="true">
                  <div
                    className="sw-progress-fill"
                    style={{ width: `${visibleProgress * 100}%` }}
                  />
                </div>
                <nav className="sw-numbers" aria-label="Choose project">
                  {projectNumbers}
                </nav>
              </div>

              <button
                type="button"
                className="sw-nav-action"
                data-side="next"
                onClick={goNext}
                aria-label="Next project"
              >
                <span className="sw-nav-circle">
                  <FaArrowRight size={15} aria-hidden="true" />
                </span>
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="sw-modal-backdrop"
          role="presentation"
          onMouseDown={() => setModalOpen(false)}
        >
          <div
            className="sw-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sw-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="sw-modal-close"
              onClick={() => setModalOpen(false)}
              aria-label="Close project"
            >
              <FaTimes size={15} aria-hidden="true" />
            </button>

            <div className="sw-modal-poster">
              <img
                src={active.poster}
                alt={`${active.client} — ${active.title}`}
                className="sw-modal-image"
              />
            </div>

            <div>
              <p className="sw-modal-label">
                Project {pad(activeIndex + 1)} / {pad(total)}
              </p>
              <h3 id="sw-modal-title" className="sw-modal-title">
                {active.client}
              </h3>
              <p className="sw-modal-project">{active.title}</p>
              <p className="sw-modal-copy">{active.description}</p>
              <p className="sw-modal-note">
                This temporary build uses poster images only. You can connect
                the final MP4 files later without changing the visual layout.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
