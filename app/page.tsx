"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ChatSection from "./components/ChatWidget";

gsap.registerPlugin(ScrollTrigger);

const MQ = [
  "AI RESEARCHER", "DEEP LEARNING", "MULTIMODAL LLMs",
  "FULL-STACK DEVELOPER", "AWS CERTIFIED",
  "SAMSUNG", "HBKU", "QATAR UNIVERSITY",
];

const CERTIFICATES = [
  {
    num: "01",
    title: "AWS AI Practitioner Challenge",
    org: "Amazon Web Services",
    image: "/images/AWS Al Practitioner Challenge.png"
  },
  {
    num: "02",
    title: "Neural Networks and Deep Learning",
    org: "DeepLearning.AI",
    image: "/images/Neural Networks and Deep Learning.png"
  },
  {
    num: "03",
    title: "Samsung Innovation Campus",
    org: "Samsung",
    image: "/images/Samsung Innovation Campus.png"
  }
];

const PROJECTS = [
  {
    num: "01",
    org: "SAMSUNG",
    title: "Fake News Detector",
    desc: "Designed and trained an LSTM based fake news classifier achieving 98.75% accuracy. Preprocessed a corpus of 40,000+ articles using text encoding and tokenization techniques, then iteratively fine tuned model hyperparameters to improve generalization.",
    tags: ["LSTM", "Deep Learning", "Python"],
    image: "/images/samsung.png",
    metrics: [
      { label: "Model Accuracy", value: "98.75%" },
      { label: "Corpus Size", value: "40k+" }
    ]
  },
  {
    num: "02",
    org: "HBKU",
    title: "Multimodal LLM Research",
    desc: "Fine tuned and evaluated multimodal LLMs including DeepSeek VL and Qwen2 VL on large scale vision language benchmarks. Optimized training pipelines and preprocessing workflows, achieving 15% improvement in model accuracy and 30% faster inference speed.",
    tags: ["DeepSeek VL", "Qwen2 VL", "Fine Tuning"],
    image: "/images/QCRI.png",
    metrics: [
      { label: "Model Accuracy", value: "+15%" },
      { label: "Inference Speed", value: "30% faster" }
    ]
  },
  {
    num: "03",
    org: "QATAR UNIVERSITY",
    title: "University Management App",
    desc: "Designed and implemented a full stack web application for managing students, instructors, and courses. Phase 1 built core features using HTML, CSS, and JavaScript with JSON based storage. Phase 2 migrated to a relational database with Prisma and Next.js, adding REST APIs and a statistics dashboard.",
    tags: ["Next.js", "Prisma", "Full Stack"],
    image: "/images/QU.png",
    metrics: [
      { label: "Architecture", value: "Full Stack" },
      { label: "Database", value: "Relational" }
    ]
  },
  {
    num: "04",
    org: "PERSONAL",
    title: "Portfolio 2026",
    desc: "This portfolio. A scroll driven experience built from scratch with Next.js, GSAP, and Lenis, featuring pinned card animations, smooth scroll transitions, and a custom cursor system.",
    tags: ["React", "GSAP", "Frontend"],
    image: "/images/portfolio.png",
    metrics: [
      { label: "Animations", value: "GSAP" },
      { label: "Scroll", value: "Lenis" }
    ]
  }
];

const SKILL_CATS = [
  {
    title: "AI & Machine Learning",
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98" /></svg>,
    items: ["PyTorch", "TensorFlow", "HuggingFace", "Large Language Models", "Fine Tuning", "Vision Language Models", "Computer Vision", "MLOps"],
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    title: "Web Development",
    items: ["React", "Next.js", "Node.js", "TypeScript", "Prisma ORM", "REST APIs"],
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
    title: "Languages",
    items: ["Python", "JavaScript", "Java", "SQL", "MATLAB", "HTML / CSS"],
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>,
    title: "Cloud & DevOps",
    items: ["AWS (AI Practitioner Certified)", "Amazon Bedrock", "Git", "Docker", "Jupyter Notebook", "VS Code"],
  },
];

export default function Portfolio() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const skillsViewportRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  /* ---- CURSOR ---- */
  const initCursor = useCallback(() => {
    const dot = dotRef.current, ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", move);
    const tick = () => {
      rx += (mx - rx) * .12; ry += (my - ry) * .12;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(tick);
    };
    tick();
    setTimeout(() => {
      document.querySelectorAll("a,button,.spread-card,.skill-cat,.str-card").forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("expanded"));
        el.addEventListener("mouseleave", () => ring.classList.remove("expanded"));
      });
    }, 3200);
    return () => document.removeEventListener("mousemove", move);
  }, []);

  /* ---- LOADER ---- */
  const playLoader = useCallback(() => {
    const ld = loaderRef.current; if (!ld) return;
    const inner = ld.querySelector(".loader-inner") as HTMLElement;
    const line = ld.querySelector(".loader-line") as HTMLElement;
    const tl = gsap.timeline({
      onComplete: () => { if (ld) ld.style.pointerEvents = "none"; playHero(); },
    });
    tl.from(inner, { y: "110%", duration: .7, ease: "power3.out" })
      .to(line, { scaleX: 1, duration: .5, ease: "power2.inOut" }, "-=.3")
      .to(inner, { y: "-110%", duration: .6, ease: "power3.in", delay: .3 })
      .to(line, { opacity: 0, duration: .25 }, "-=.4")
      .to(ld, { yPercent: -100, duration: .85, ease: "power3.inOut" }, "-=.15");
  }, []);

  const playHero = () => {
    const tl = gsap.timeline();
    tl.from("#hn1", { y: "120%", duration: 1.1, ease: "power4.out" })
      .from("#hn2", { y: "120%", duration: 1.1, ease: "power4.out" }, "-=.75")
      .from(["#tl1", "#tl2"], { y: "100%", opacity: 0, duration: .8, stagger: .1, ease: "power3.out" }, "-=.4")
      .from("#hsub", { y: 24, opacity: 0, duration: .7, ease: "power3.out" }, "-=.6")
      .from("#hlinks", { y: 18, opacity: 0, duration: .6, ease: "power3.out" }, "-=.5");
  };

  /* ---- SCROLL ANIMATIONS ---- */
  const initScroll = useCallback(() => {
    // Hero parallax exit
    const htl = gsap.timeline({
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    htl.to("#hero-name-wrap", { scale: 1.2, yPercent: -10, opacity: .15, ease: "none" }, 0)
      .to(".hero-grid", { yPercent: -12, ease: "none" }, 0)
      .to(".hero-tagline", { yPercent: -30, opacity: 0, ease: "none" }, 0)
      .to("#hsub", { opacity: 0, ease: "none" }, 0)
      .to("#hlinks", { opacity: 0, ease: "none" }, 0)
      .to(".scroll-hint", { opacity: 0, ease: "none" }, 0);

    // Reveal helper
    const rl = (sel: string, trig: string) => {
      document.querySelectorAll(sel + " .reveal-line").forEach(l => {
        gsap.from(l, {
          y: "100%", duration: .9, ease: "power3.out",
          scrollTrigger: { trigger: trig || l as HTMLElement, start: "top 85%", toggleActions: "play none none none" },
        });
      });
    };

    // About headline reveal
    ScrollTrigger.create({
      trigger: "#about", start: "top 75%", onEnter: () => {
        rl("#about .about-h", "#about");
      }
    });

    // Staggered reveal for about text sections
    document.querySelectorAll(".about-section").forEach((sec) => {
      gsap.from(sec, {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    });

    // Stats grid reveal and counter animation
    ScrollTrigger.create({
      trigger: ".stats-grid",
      start: "top 85%",
      onEnter: () => {
        gsap.from(".stat-item", { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" });

        document.querySelectorAll('.count-up').forEach((el) => {
          const target = parseFloat(el.getAttribute('data-val') || "0");
          const prefix = el.getAttribute('data-prefix') || "";
          const suffix = el.getAttribute('data-suffix') || "";
          const isFloat = target % 1 !== 0;
          const obj = { val: 0 };

          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.3,
            onUpdate: () => {
              el.innerHTML = prefix + obj.val.toFixed(isFloat ? 2 : 0) + suffix;
            }
          });
        });
      }
    });

    rl(".projects-sec .projects-h", ".projects-sec .projects-header");
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      /* ---- PROJECTS CARD SPREAD ---- */
      const sv = spreadRef.current;
      if (sv) {
        const cards = sv.querySelectorAll<HTMLElement>(".spread-card");
        const n = cards.length;

        // With flex layout, cards naturally sit side-by-side. 
        // We use xPercent to stack them on the right initially.
        cards.forEach((card, i) => {
          gsap.set(card, {
            xPercent: (n - 1 - i) * 105, // Translate to the right based on index
            rotation: -3 + i * 2,
            scale: 1 - (n - 1 - i) * 0.03,
          });
        });

        const spreadTl = gsap.timeline({
          scrollTrigger: {
            trigger: sv, start: "top top", end: "+=200%",
            scrub: 1, pin: true, anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress >= 0.70) {
                sv.classList.add("spread-done");
              } else if (self.progress < 0.60) {
                sv.classList.remove("spread-done");
              }
            }
          },
        });

        cards.forEach((card, i) => {
          spreadTl.to(card, {
            xPercent: 0,
            rotation: 0, scale: 1,
            duration: 1, ease: "power2.out",
          }, i * 0.15);
        });
      }

      /* ---- SKILLS DEAL-TO-GRID ---- */
      const skillsViewport = skillsViewportRef.current;
      if (skillsViewport) {
        const skillCards = skillsViewport.querySelectorAll<HTMLElement>(".skill-cat");
        const n = skillCards.length;

        // Initial: stacked in the center
        skillCards.forEach((card, i) => {
          gsap.set(card, {
            top: "25%",
            left: "25%", // Center horizontally (width is 50%, so left 25% centers it)
            rotation: -4 + i * 2.5,
            scale: 1 - (n - 1 - i) * 0.05,
          });
        });

        const dealTl = gsap.timeline({
          scrollTrigger: {
            trigger: skillsViewport,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Target positions for 2x2 grid
        const positions = [
          { top: "0%", left: "0%" },     // Top Left
          { top: "0%", left: "50%" },    // Top Right
          { top: "50%", left: "0%" },    // Bottom Left
          { top: "50%", left: "50%" },   // Bottom Right
        ];

        skillCards.forEach((card, i) => {
          dealTl.to(card, {
            top: positions[i].top,
            left: positions[i].left,
            rotation: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          }, 0); // Animate all simultaneously for the "deal" effect
        });
      }

      /* ---- CERTIFICATE SCROLL TRIGGER ---- */
      const certItems = document.querySelectorAll(".cert-item");
      certItems.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top 50%",
          end: "bottom 50%",
          toggleClass: "active",
        });
      });
    });

    mm.add("(max-width: 1024px)", () => {
      gsap.set(".spread-card, .skill-cat", { clearProps: "all" });

      gsap.utils.toArray(".spread-card").forEach((card: any) => {
        gsap.from(card, {
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" }
        });
      });

      gsap.utils.toArray(".skill-cat").forEach((card: any) => {
        gsap.from(card, {
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none none" }
        });
      });
    });

    ScrollTrigger.create({
      trigger: ".skills-sec", start: "top 78%", onEnter: () => {
        rl(".skills-sec .skills-h", ".skills-sec");
      }
    });

    // Certs section fade in
    ScrollTrigger.create({
      trigger: ".strengths-sec", start: "top 78%", onEnter: () => {
        gsap.from(".cert-item", { y: 30, opacity: 0, duration: .8, stagger: .15, ease: "power3.out", delay: .1 });
      }
    });

    // Contact scale in
    gsap.from("#contact", {
      scale: .9, borderRadius: "32px", ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top 100%", end: "top 10%", scrub: true },
    });
    ScrollTrigger.create({
      trigger: "#contact", start: "top 78%", onEnter: () => {
        rl("#contact .contact-hl", "#contact");
        gsap.from(".contact-item", { y: 30, opacity: 0, duration: .7, stagger: .1, ease: "power3.out", delay: .2 });
      }
    });
    gsap.from(".contact-bg", {
      xPercent: -12, ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top bottom", end: "bottom top", scrub: true },
    });

    // Labels
    gsap.utils.toArray<HTMLElement>(".sec-label").forEach(el => {
      gsap.from(el, {
        opacity: 0, x: -24, duration: .7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      });
    });

    // Progress bar
    gsap.to(progRef.current, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .3 },
    });
  }, []);

  /* ---- NAVBAR ---- */
  const initNav = useCallback(() => {
    const nav = document.getElementById("nav");
    if (!nav) return;
    let ly = 0;
    const fn = () => {
      const y = window.scrollY;
      nav.classList.toggle("hidden", y > ly && y > 120);
      nav.classList.toggle("scrolled", y > 60);
      ly = y;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ---- LENIS ---- */
  const initLenis = useCallback(() => {
    const l = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = l;
    l.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => l.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => l.destroy();
  }, []);

  /* ---- MOUNT ---- */
  useEffect(() => {
    const cL = initLenis();
    const cC = initCursor();
    const cN = initNav();
    playLoader();
    const t = setTimeout(() => { initScroll(); ScrollTrigger.refresh(); }, 2600);
    return () => {
      clearTimeout(t); cL?.(); cC?.(); cN?.();
      ScrollTrigger.getAll().forEach(s => s.kill());
    };
  }, [initLenis, initCursor, initNav, playLoader, initScroll]);

  return (
    <>
      <div className="grain" />
      <div className="progress-bar" ref={progRef} />
      <div className="cur-dot" ref={dotRef} />
      <div className="cur-ring" ref={ringRef} />

      {/* Loader */}
      <div className="loader" ref={loaderRef}>
        <div className="loader-text"><span className="loader-inner">ANAS.</span></div>
        <div className="loader-line" />
      </div>

      {/* Nav */}
      <nav className="navbar" id="nav">
        <a href="#" className="nav-logo">AE</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Work</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="/resume.pdf" target="_blank" rel="noreferrer" aria-label="Download Resume">Resume</a></li>
        </ul>
      </nav>

      {/* ==================== HERO — CENTERED ==================== */}
      <section className="hero">
        <div className="hero-grid" />

        <div className="hero-name-wrap" id="hero-name-wrap">
          <span className="hero-name" id="hn1">ANAS</span>
          <span className="hero-name" id="hn2">ELRAHMANI</span>
        </div>

        <div className="hero-tagline">
          <span className="reveal-line" id="tl1">CS Student & AI Researcher</span>
          <span className="reveal-line" id="tl2">turning models into products, and ideas into code.</span>
        </div>

        <div className="hero-sub" id="hsub">
          Qatar University · Doha, Qatar · Expected 2027
        </div>

        <div className="hero-social" id="hlinks">
          <a href="mailto:anaselrahmani@gmail.com" aria-label="Email">Email</a>
          <a href="https://www.linkedin.com/in/anaselrahmani/" target="_blank" rel="noreferrer" aria-label="LinkedIn">LinkedIn</a>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line-anim" />Scroll
        </div>
      </section>

      {/* ==================== MARQUEE ==================== */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(4)].map((_, r) =>
            MQ.map((m, i) => (
              <span className="marquee-text" key={`${r}-${i}`}>{m} <span className="marquee-dot">·</span></span>
            ))
          )}
        </div>
      </div>

      {/* ==================== AI CHAT ==================== */}
      <ChatSection />

      {/* ==================== ABOUT ==================== */}
      <section className="about-sec" id="about">
        <div className="sec-label">About</div>
        <div className="about-grid">
          <div className="about-h">
            <span className="reveal-line">Computer scientist,</span>
            <span className="reveal-line">based in Doha,</span>
            <span className="reveal-line">building where research</span>
            <span className="reveal-line">meets the real world.</span>
          </div>
          <div className="about-body">
            <div className="about-section">
              <h3 className="about-subh">Who I am</h3>
              <p>I'm Anas Elrahmani, a Computer Science student at Qatar University, graduating in 2027. I focus on AI and machine learning, not just training models, but understanding what it actually takes to make them work on real problems. The part that interests me most is where research has to become something that actually ships, where getting the engineering right matters just as much as getting the math right.</p>
            </div>

            <div className="about-section">
              <h3 className="about-subh">Experience</h3>
              <p>At Hamad Bin Khalifa University, I fine tuned and benchmarked multimodal vision language models like DeepSeek VL and Qwen2 VL, achieving 15% higher accuracy and 30% faster inference. At Samsung Innovation Campus, I built an LSTM based fake news classifier that reached 98.75% accuracy across 40,000+ articles. I'm also AWS AI Practitioner certified, with hands on experience deploying generative AI solutions on AWS.</p>
            </div>

            <div className="about-section">
              <h3 className="about-subh">Philosophy</h3>
              <p>A model that works in a notebook is not a product. I care about the gap between the two: inference speed, real world reliability, and whether what you built actually helps someone. If you're working on something where the research and the product are equally hard to get right, I'd like to hear about it.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-num"><span className="count-up" data-val="98.75" data-suffix="%">0</span></div>
                <div className="stat-desc">Classifier accuracy for 40k+ articles</div>
              </div>
              <div className="stat-item">
                <div className="stat-num"><span className="count-up" data-prefix="+" data-val="15" data-suffix="%">0</span></div>
                <div className="stat-desc">Model accuracy in HBKU research</div>
              </div>
              <div className="stat-item">
                <div className="stat-num"><span className="count-up" data-val="30" data-suffix="%">0</span></div>
                <div className="stat-desc">Faster inference on VL models</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">AWS</div>
                <div className="stat-desc">AI Practitioner certified</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PROJECTS — CARD SPREAD ==================== */}
      <section className="projects-sec" id="projects">
        <div className="sec-label">Selected Work</div>
        <div className="projects-header">
          <div className="projects-h">
            <span className="reveal-line">Selected</span>
            <span className="reveal-line"><em>Work</em></span>
          </div>
          <div className="project-count">04 Projects</div>
        </div>
        <div className="spread-viewport" ref={spreadRef}>
          {PROJECTS.map(p => (
            <div className="spread-card" key={p.num}>
              {/* MOBILE ONLY (ORIGINAL DESIGN) */}
              <div className="card-mobile-only">
                <div className="card-bg-mobile" style={{ backgroundImage: `url(${p.image})` }} />
                <div className="card-inner-mobile">
                  <div className="card-num-mobile">{p.num}</div>
                  <div className="card-org-mobile">{p.org}</div>
                  <div className="card-title-mobile">{p.title}</div>
                  <div className="card-desc-mobile">{p.desc}</div>
                  <div className="card-tags-mobile">
                    {p.tags.map(t => <span className="card-tag-mobile" key={t}>{t}</span>)}
                  </div>
                </div>
              </div>

              {/* DESKTOP ONLY (NEW EXPANDING DESIGN) */}
              <div className="card-desktop-only">
                {/* Collapsed State */}
                <div className="card-collapsed">
                  <div className="collapsed-num">{p.num}</div>
                  <div className="collapsed-content">
                    <div className="collapsed-org">{p.org}</div>
                    <div className="collapsed-title">{p.title}</div>
                  </div>
                </div>

                {/* Expanded State */}
                <div className="card-expanded">
                  <div className="expanded-left">
                    <div className="bg-num">{p.num}</div>
                    <div className="identity-sec">
                      <span className="section-subtitle">PROJECT IDENTITY</span>
                      <div className="org-pill">{p.org}</div>
                    </div>
                    <div className="metrics-sec">
                      <span className="section-subtitle">KEY METRICS</span>
                      {p.metrics.map(m => (
                        <div className="metric-item" key={m.label}>
                          <div className="metric-label">{m.label}</div>
                          <div className="metric-value">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="expanded-right">
                    <div className="card-bg" style={{ backgroundImage: `url(${p.image})` }} />
                    <div className="card-tags">
                      {p.tags.map(t => <span className="card-tag" key={t}>{t}</span>)}
                    </div>
                    <div className="expanded-content-bottom">
                      <div className="card-title">{p.title}</div>
                      <div className="card-desc">{p.desc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SKILLS — DEAL-TO-GRID ==================== */}
      <section className="skills-sec" id="skills">
        <div className="sec-label">Capabilities</div>
        <div className="skills-header">
          <div className="skills-h">
            <span className="reveal-line">Skills &amp;</span>
            <span className="reveal-line"><em>Expertise</em></span>
          </div>
        </div>

        <div className="skills-viewport" ref={skillsViewportRef}>
          {SKILL_CATS.map(cat => (
            <div className="skill-cat" key={cat.title}>
              <span className="skill-cat-icon">{cat.icon}</span>
              <div className="skill-cat-title">{cat.title}</div>
              <ul className="skill-cat-list">
                {cat.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="strengths-sec" id="certificates">
        <div className="sec-label">Course Certificates</div>

        <div className="cert-list">
          {CERTIFICATES.map((cert) => (
            <div key={cert.num} className="cert-item">
              <div className="cert-num">{cert.num}</div>
              <div className="cert-title">{cert.title}</div>

              <div className="cert-card">
                <img src={cert.image} alt={cert.title} className="cert-image" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== CONTACT ==================== */}
      <section className="contact-sec" id="contact">
        <div className="contact-bg">CONTACT</div>
        <div className="sec-label">Get in touch</div>
        <div className="contact-hl">
          <span className="reveal-line">Let&apos;s work</span>
          <span className="reveal-line"><em>on something.</em></span>
        </div>
        <div className="contact-row">
          <div className="contact-item"><span className="contact-lbl">Email</span><a className="contact-val" href="mailto:anaselrahmani@gmail.com" aria-label="Email">anaselrahmani@gmail.com</a></div>
          <div className="contact-item"><span className="contact-lbl">Location</span><span className="contact-val" style={{ cursor: "none" }}>Doha, Qatar</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <span>© 2026 Anas Elrahmani</span>
        <span>Computer Science, Qatar University</span>
        <a href="https://www.linkedin.com/in/anaselrahmani/" target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ cursor: "none", transition: "color .25s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--ink)"} onMouseLeave={(e) => e.currentTarget.style.color = ""}>LinkedIn</a>
      </footer>
    </>
  );
}