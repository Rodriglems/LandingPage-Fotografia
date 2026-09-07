import { useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"
import logoSrc from "@/imports/WhatsApp_Image_2026-09-06_at_21.05.09-removebg-preview.png"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface PortfolioItem {
  id: number
  number: string
  title: string
  category: string
  year: string
  imageUrl: string
  span: string
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const portfolioItems: PortfolioItem[] = [
  {
    id: 1, number: "01", title: "Golden Hour", category: "WEDDINGS", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=1200&fit=crop&auto=format",
    span: "md:row-span-2",
  },
  {
    id: 2, number: "02", title: "Urban Soul", category: "PORTRAITS", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format",
    span: "",
  },
  {
    id: 3, number: "03", title: "Edge & Form", category: "EDITORIAL", year: "2025",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&auto=format",
    span: "",
  },
  {
    id: 4, number: "04", title: "Into the Wild", category: "LANDSCAPE", year: "2025",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop&auto=format",
    span: "md:col-span-2",
  },
  {
    id: 5, number: "05", title: "Vision Board", category: "COMMERCIAL", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&auto=format",
    span: "",
  },
]

const services = [
  { number: "01", title: "WEDDINGS", desc: "Cinematic coverage of your most intimate moments.", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=340&fit=crop&auto=format" },
  { number: "02", title: "PORTRAITS", desc: "Character studies that reveal the person within.", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=340&fit=crop&auto=format" },
  { number: "03", title: "EVENTS", desc: "Corporate, cultural and social gatherings.", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=340&fit=crop&auto=format" },
  { number: "04", title: "EDITORIAL", desc: "Fashion-forward imagery for print and digital.", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=340&fit=crop&auto=format" },
  { number: "05", title: "COMMERCIAL", desc: "Brand and product photography built to convert.", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=340&fit=crop&auto=format" },
  { number: "06", title: "BRANDING", desc: "Visual identity sessions for founders and teams.", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=340&fit=crop&auto=format" },
]

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&h=680&fit=crop&auto=format", alt: "Misty mountain at dawn" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=680&fit=crop&auto=format", alt: "Dramatic seascape at dusk" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=680&fit=crop&auto=format", alt: "Alpine landscape in mist" },
  { url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&h=680&fit=crop&auto=format", alt: "Sunbeams through forest canopy" },
  { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1000&h=680&fit=crop&auto=format", alt: "Dark ocean waves at night" },
]

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isImage, setIsImage] = useState(false)
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return
      cursorRef.current.style.left = `${e.clientX}px`
      cursorRef.current.style.top = `${e.clientY}px`
    }
    const enter = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (t.closest("[data-cursor-image]")) setIsImage(true)
      if (t.closest("a, button, [data-cursor-link]")) setIsLink(true)
    }
    const leave = () => { setIsImage(false); setIsLink(false) }
    window.addEventListener("mousemove", move)
    window.addEventListener("mouseover", enter)
    window.addEventListener("mouseout", leave)
    return () => {
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", enter)
      window.removeEventListener("mouseout", leave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center transition-all duration-200"
      style={{ left: "-100px", top: "-100px" }}
    >
      <div
        className={`rounded-full bg-white mix-blend-difference flex items-center justify-center transition-all duration-300 ${
          isImage ? "w-20 h-20" : isLink ? "w-5 h-5" : "w-3 h-3"
        }`}
      >
        {isImage && (
          <span
            className="text-black text-xs font-semibold tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VIEW
          </span>
        )}
      </div>
    </div>
  )
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = ["WORK", "ABOUT", "SERVICES", "CONTACT"]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 transition-all duration-500 ${
          scrolled ? "py-4 bg-[#0b0b0b]/90 backdrop-blur-sm border-b border-white/[0.06]" : "py-8"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Logo */}
        <a href="#" aria-label="LZR Photography home" className="flex items-center" data-cursor-link>
          <img
            src={logoSrc}
            alt="LZR Photography logo"
            className={`object-contain transition-all duration-500 ${scrolled ? "h-9" : "h-11"}`}
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-xs tracking-[0.25em] text-white/50 hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-link
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex">
          <a
            href="#contact"
            className="text-xs tracking-[0.25em] text-white/80 hover:text-white border border-white/20 hover:border-[#E85508] hover:text-[#E85508] px-6 py-2.5 transition-all duration-300"
            style={{ fontFamily: "var(--font-display)" }}
            data-cursor-link
          >
            {"LET'S TALK"}
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-end justify-center gap-[6px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-6 -rotate-45 translate-y-[8px]" : "w-6"}`} />
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-0 opacity-0" : "w-4"}`} />
          <span className={`block h-px bg-white transition-all duration-300 ${menuOpen ? "w-6 rotate-45 -translate-y-[5px]" : "w-5"}`} />
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#0b0b0b] flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-12">
              <img src={logoSrc} alt="LZR Photography" className="h-14 object-contain" />
            </div>
            {links.map((l, i) => (
              <motion.a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="block text-5xl font-black text-white/80 hover:text-white py-4 tracking-tight transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              >
                {l}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-8 text-sm tracking-[0.25em] text-[#E85508] border border-[#E85508]/40 px-8 py-3"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {"LET'S TALK"}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <div ref={ref} className="relative h-screen overflow-hidden bg-[#0b0b0b]">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: imageScale }}
      >
        <img
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800&h=1200&fit=crop&auto=format"
          alt="Dramatic misty mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/60 via-[#0b0b0b]/20 to-[#0b0b0b]" />
      </motion.div>

      {/* Text content */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end px-8 md:px-16 pb-24"
        style={{ y: textY, opacity }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-xs tracking-[0.4em] text-[#E85508] mb-6 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Visual Stories
          </p>
          <h1
            className="text-[12vw] md:text-[9vw] font-black leading-[0.85] text-white uppercase tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LZR
            <br />
            <span className="text-white/20">Photography</span>
          </h1>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-6 sm:items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-4 text-xs tracking-[0.3em] text-white/70 hover:text-white transition-colors group"
            style={{ fontFamily: "var(--font-display)" }}
            data-cursor-link
          >
            <span className="block w-12 h-px bg-white/30 group-hover:bg-[#E85508] group-hover:w-20 transition-all duration-500" />
            SELECTED WORK
          </a>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <p
            className="text-xs tracking-[0.2em] text-white/30"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AVAILABLE FOR COMMISSIONS · 2026
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 right-10 hidden md:flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{ opacity }}
      >
        <span
          className="text-[10px] tracking-[0.35em] text-white/30 [writing-mode:vertical-lr] rotate-180"
          style={{ fontFamily: "var(--font-display)" }}
        >
          SCROLL
        </span>
        <div className="w-px h-16 bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#E85508]"
            animate={{ height: ["0%", "100%"], top: ["0%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  )
}

// ─── SECTION WRAPPER (scroll reveal) ─────────────────────────────────────────

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────

function LightboxModal({ items, activeId, onClose, onNav }: {
  items: PortfolioItem[]
  activeId: number
  onClose: () => void
  onNav: (id: number) => void
}) {
  const item = items.find((p) => p.id === activeId)!
  const idx = items.findIndex((p) => p.id === activeId)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onNav(items[(idx - 1 + items.length) % items.length].id)
      if (e.key === "ArrowRight") onNav(items[(idx + 1) % items.length].id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [idx, items, onClose, onNav])

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl max-h-[85vh] w-full mx-8"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full max-h-[75vh] object-contain"
        />
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#E85508]" style={{ fontFamily: "var(--font-display)" }}>
              {item.category} · {item.year}
            </p>
            <p className="text-2xl font-black text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
              {item.title}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNav(items[(idx - 1 + items.length) % items.length].id)}
              className="w-10 h-10 border border-white/20 hover:border-[#E85508] flex items-center justify-center text-white/60 hover:text-[#E85508] transition-all"
              aria-label="Previous image"
            >←</button>
            <button
              onClick={() => onNav(items[(idx + 1) % items.length].id)}
              className="w-10 h-10 border border-white/20 hover:border-[#E85508] flex items-center justify-center text-white/60 hover:text-[#E85508] transition-all"
              aria-label="Next image"
            >→</button>
            <button
              onClick={onClose}
              className="w-10 h-10 border border-white/20 hover:border-red-500/50 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
              aria-label="Close lightbox"
            >✕</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

function Portfolio() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="work" className="py-28 md:py-40 px-8 md:px-16 bg-[#0b0b0b]">
      <Reveal>
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p
              className="text-xs tracking-[0.35em] text-[#E85508] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PORTFOLIO
            </p>
            <h2
              className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Selected
              <br />
              Work
            </h2>
          </div>
          <p
            className="hidden md:block text-sm text-white/30 max-w-xs text-right leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A curated selection
            <br />
            of visual stories.
          </p>
        </div>
      </Reveal>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[280px]">
        {portfolioItems.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08} className={item.span}>
            <div
              className="relative group cursor-none overflow-hidden bg-[#141414] h-full"
              data-cursor-image
              onClick={() => setLightbox(item.id)}
            >
              <img
                src={item.imageUrl}
                alt={`${item.title} — ${item.category}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Info overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-400">
                <p
                  className="text-xs text-white/50 tracking-[0.3em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.number}
                </p>
                <div>
                  <p
                    className="text-xs tracking-[0.25em] text-[#E85508] mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.category} · {item.year}
                  </p>
                  <p
                    className="text-2xl font-black text-white uppercase leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="block w-8 h-px bg-[#E85508]" />
                    <span
                      className="text-[10px] tracking-[0.3em] text-white/60"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      VIEW PROJECT
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && <LightboxModal items={portfolioItems} activeId={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />}
      </AnimatePresence>
    </section>
  )
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="py-28 md:py-40 px-8 md:px-16 bg-[#0e0e0e]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Image */}
        <Reveal>
          <div
            className="relative aspect-[3/4] bg-[#141414] overflow-hidden"
            data-cursor-image
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1100&fit=crop&auto=format"
              alt="Photographer at work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b]/40 to-transparent" />
            {/* Corner accent */}
            <div className="absolute bottom-6 left-6">
              <div className="w-10 h-px bg-[#E85508] mb-2" />
              <p
                className="text-xs tracking-[0.3em] text-white/50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BEHIND THE LENS
              </p>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <p
              className="text-xs tracking-[0.35em] text-[#E85508] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ABOUT
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              [PHOTOGRAPHER
              <br />
              NAME]
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-white/50 leading-relaxed mb-4 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Visual storyteller, photographer and creative director based in [City, Country]. Specializing in
              cinematic imagery that captures raw emotion and authentic moments.
            </p>
            <p
              className="text-white/30 leading-relaxed text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              [Replace this text with your personal biography. Talk about your journey, your philosophy,
              and what drives your creative vision.]
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/[0.06] pt-10">
              {[
                { val: "10+", label: "YEARS OF EXPERIENCE" },
                { val: "100+", label: "PROJECTS" },
                { val: "40+", label: "AWARDS" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-4xl font-black text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.val}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.25em] text-white/30 leading-snug"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function Services() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const onMouse = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <section id="services" className="py-28 md:py-40 px-8 md:px-16 bg-[#0b0b0b]" onMouseMove={onMouse}>
      <Reveal>
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs tracking-[0.35em] text-[#E85508] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WHAT I DO
          </p>
          <h2
            className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Services
          </h2>
        </div>
      </Reveal>

      <div className="border-t border-white/[0.06]">
        {services.map((s, i) => (
          <div
            key={s.number}
            className="group border-b border-white/[0.06] py-7 md:py-9 flex items-center justify-between gap-6 cursor-none transition-all duration-300 hover:pl-4"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            data-cursor-link
          >
            <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
              <span
                className="text-xs tracking-[0.2em] text-white/20 group-hover:text-[#E85508] transition-colors flex-shrink-0"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.number}
              </span>
              <span
                className="text-3xl md:text-5xl font-black text-white/70 group-hover:text-white transition-colors uppercase leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </span>
            </div>
            <p
              className="hidden md:block text-sm text-white/30 group-hover:text-white/50 transition-colors max-w-xs text-right"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {s.desc}
            </p>
            <span
              className="text-white/20 group-hover:text-[#E85508] transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              →
            </span>
          </div>
        ))}
      </div>

      {/* Floating preview image */}
      {hovered !== null && (
        <div
          className="pointer-events-none fixed z-40 hidden md:block"
          style={{
            left: mousePos.x + 24,
            top: mousePos.y - 80,
            transition: "left 0.1s, top 0.1s",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-56 h-36 overflow-hidden shadow-2xl"
          >
            <img
              src={services[hovered].url}
              alt={services[hovered].title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      )}
    </section>
  )
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────

function Process() {
  const steps = [
    { n: "01", title: "DISCOVER", desc: "We start with a deep conversation — your vision, your audience, the feeling you want to capture." },
    { n: "02", title: "CREATE", desc: "Direction, mood boards, and creative strategy come together into a visual blueprint." },
    { n: "03", title: "CAPTURE", desc: "The shoot itself: meticulous, present, unhurried. Every frame intentional." },
    { n: "04", title: "DELIVER", desc: "Edited, curated, and delivered. Your gallery, ready to use across every medium." },
  ]

  return (
    <section className="py-28 md:py-40 px-8 md:px-16 bg-[#0e0e0e]">
      <Reveal>
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs tracking-[0.35em] text-[#E85508] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            HOW IT WORKS
          </p>
          <h2
            className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Process
          </h2>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-4 gap-px bg-white/[0.06]">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <div className="bg-[#0e0e0e] p-8 md:p-10 h-full">
              <p
                className="text-5xl font-black text-white/[0.07] mb-8 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.n}
              </p>
              <div className="w-6 h-px bg-[#E85508] mb-6" />
              <p
                className="text-2xl font-black text-white uppercase mb-4 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </p>
              <p
                className="text-sm text-white/40 leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── CINEMATIC QUOTE ──────────────────────────────────────────────────────────

function CinematicQuote() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25])
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1800&h=1200&fit=crop&auto=format"
          alt="Dark ocean waves"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
        style={{ y: textY }}
      >
        <Reveal>
          <p
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            "Every frame
            <br />
            tells a story."
          </p>
          <div className="mt-6 w-10 h-px bg-[#E85508] mx-auto" />
        </Reveal>
      </motion.div>
    </div>
  )
}

// ─── HORIZONTAL GALLERY ───────────────────────────────────────────────────────

function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(galleryImages.length - 1) * 100 / galleryImages.length}%`])

  return (
    <section className="bg-[#0b0b0b]">
      <div ref={containerRef} style={{ height: `${galleryImages.length * 60}vh` }} className="relative">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          <Reveal>
            <div className="px-8 md:px-16 mb-8">
              <p
                className="text-xs tracking-[0.35em] text-[#E85508]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                GALLERY — SCROLL TO EXPLORE
              </p>
            </div>
          </Reveal>
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              style={{ x, width: `${galleryImages.length * 100}%` }}
            >
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="relative"
                  style={{ width: `${100 / galleryImages.length}%` }}
                  data-cursor-image
                >
                  <div className="mx-3 relative aspect-[16/9] overflow-hidden bg-[#141414]">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-5">
                      <p
                        className="text-xs tracking-[0.25em] text-white/40"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {String(i + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-28 md:py-48 px-8 md:px-16 bg-[#0e0e0e] text-center">
      <Reveal>
        <p
          className="text-xs tracking-[0.4em] text-[#E85508] mb-8 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Work Together
        </p>
        <h2
          className="text-[10vw] md:text-[7vw] font-black uppercase leading-none text-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {"Let's Create"}
          <br />
          <span className="text-white/20">Something</span>
          <br />
          Beautiful.
        </h2>
        <p
          className="text-white/30 text-sm mb-14 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Available for selected projects, commissions and collaborations.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-5 border border-white/20 hover:border-[#E85508] text-white hover:text-[#E85508] px-10 py-4 text-sm tracking-[0.3em] transition-all duration-400 group"
          style={{ fontFamily: "var(--font-display)" }}
          data-cursor-link
        >
          START A PROJECT
          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
        </a>
      </Reveal>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputClass =
    "w-full bg-transparent border-b border-white/[0.12] focus:border-[#E85508] py-4 text-white/80 text-sm outline-none placeholder:text-white/20 transition-colors"

  return (
    <section id="contact" className="py-28 md:py-40 px-8 md:px-16 bg-[#0b0b0b]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-28">
        <div>
          <Reveal>
            <p
              className="text-xs tracking-[0.35em] text-[#E85508] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GET IN TOUCH
            </p>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-none text-white mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {"Let's"}
              <br />
              Talk
            </h2>
            <div className="space-y-5">
              {[
                { label: "EMAIL", val: "[email@lzrphoto.com]" },
                { label: "PHONE", val: "[+55 00 00000-0000]" },
                { label: "BASED IN", val: "[City, Country]" },
              ].map((info) => (
                <div key={info.label}>
                  <p
                    className="text-[10px] tracking-[0.3em] text-white/30 mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {info.label}
                  </p>
                  <p
                    className="text-sm text-white/60"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {info.val}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-5">
              {["Instagram", "Behance", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs tracking-[0.2em] text-white/30 hover:text-[#E85508] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                  data-cursor-link
                >
                  {s}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          {sent ? (
            <div className="flex flex-col justify-center h-full">
              <div className="w-10 h-px bg-[#E85508] mb-6" />
              <p
                className="text-3xl font-black text-white uppercase mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Message sent.
              </p>
              <p className="text-sm text-white/40" style={{ fontFamily: "var(--font-body)" }}>
                Thank you for reaching out. {"I'll"} be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-8">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  required
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="type" className="sr-only">Project type</label>
                <select
                  id="type"
                  required
                  className={`${inputClass} appearance-none`}
                  style={{ fontFamily: "var(--font-body)", background: "transparent" }}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="" disabled style={{ background: "#141414" }}>Project type</option>
                  {["Wedding", "Portrait", "Event", "Editorial", "Commercial", "Branding", "Other"].map((t) => (
                    <option key={t} value={t} style={{ background: "#141414" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full border border-white/20 hover:border-[#E85508] text-white hover:text-[#E85508] py-4 text-xs tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 group"
                style={{ fontFamily: "var(--font-display)" }}
              >
                SEND MESSAGE
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-16 md:py-20 px-8 md:px-16 bg-[#0b0b0b] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 mb-14">
          <div>
            <img src={logoSrc} alt="LZR Photography" className="h-12 object-contain mb-3" />
            <p
              className="text-[10px] tracking-[0.3em] text-white/25"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PHOTOGRAPHY / VISUAL STORIES
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-right">
            {[
              { label: "EMAIL", val: "[email@lzrphoto.com]" },
              { label: "PHONE", val: "[+55 00 00000-0000]" },
              { label: "LOCATION", val: "[City, Country]" },
            ].map((info) => (
              <div key={info.label}>
                <p
                  className="text-[9px] tracking-[0.3em] text-white/25 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {info.label}
                </p>
                <p
                  className="text-xs text-white/40"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {info.val}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-[10px] tracking-[0.2em] text-white/20"
            style={{ fontFamily: "var(--font-display)" }}
          >
            © 2026 — ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[10px] tracking-[0.2em] text-white/20 hover:text-white/50 transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
                data-cursor-link
              >
                {l.toUpperCase()}
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[10px] tracking-[0.2em] text-white/20 hover:text-[#E85508] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-link
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    document.body.style.overflowX = "hidden"
  }, [])

  return (
    <div
      className="bg-[#0b0b0b] text-[#ede9e3] min-h-screen md:cursor-none"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Services />
        <Process />
        <CinematicQuote />
        <HorizontalGallery />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
