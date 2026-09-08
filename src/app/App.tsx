import { useState, useEffect, useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, AnimatePresence, MotionConfig } from "motion/react"
import logoSrc from "@/imports/LogoLuze-Photoroom (1).png"

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
    id: 1, number: "01", title: "Hora dourada", category: "CASAMENTOS", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=1200&fit=crop&auto=format",
    span: "md:row-span-2",
  },
  {
    id: 2, number: "02", title: "Alma urbana", category: "RETRATOS", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop&auto=format",
    span: "",
  },
  {
    id: 3, number: "03", title: "Linhas e formas", category: "EDITORIAL", year: "2025",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&auto=format",
    span: "",
  },
  {
    id: 4, number: "04", title: "Na natureza", category: "PAISAGENS", year: "2025",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop&auto=format",
    span: "md:col-span-2",
  },
  {
    id: 5, number: "05", title: "Inspiração", category: "PUBLICIDADE", year: "2026",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&auto=format",
    span: "",
  },
]

const services = [
  { number: "01", title: "CASAMENTOS", desc: "Um olhar cinematográfico para os seus momentos mais íntimos.", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=340&fit=crop&auto=format" },
  { number: "02", title: "RETRATOS", desc: "Retratos que revelam sua essência e personalidade.", url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=340&fit=crop&auto=format" },
  { number: "03", title: "EVENTOS", desc: "Registros de encontros corporativos, culturais e sociais.", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=340&fit=crop&auto=format" },
  { number: "04", title: "EDITORIAL", desc: "Fotografia de moda para publicações impressas e digitais.", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=340&fit=crop&auto=format" },
  { number: "05", title: "PUBLICIDADE", desc: "Fotografia de marcas e produtos que desperta interesse.", url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=340&fit=crop&auto=format" },
  { number: "06", title: "MARCAS", desc: "Ensaios de identidade visual para empreendedores e equipes.", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=340&fit=crop&auto=format" },
]

const galleryImages = [
  { url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1000&h=680&fit=crop&auto=format", alt: "Montanhas refletidas no lago ao amanhecer" },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&h=680&fit=crop&auto=format", alt: "Pico de montanha entre nuvens" },
  { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1000&h=680&fit=crop&auto=format", alt: "Paisagem alpina entre montanhas" },
  { url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1000&h=680&fit=crop&auto=format", alt: "Raios de sol entre as árvores" },
  { url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1000&h=680&fit=crop&auto=format", alt: "Vista de Paris ao entardecer" },
]

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

function BrandLogo({ className = "" }: { className?: string }) {
  return <span className={`brand-logo ${className}`}><img src={logoSrc} alt="LZR Fotografia" /></span>
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

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false) }
    const desktop = window.matchMedia("(min-width: 768px)")
    const resize = () => { if (desktop.matches) setMenuOpen(false) }
    window.addEventListener("keydown", close)
    desktop.addEventListener("change", resize)
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", close); desktop.removeEventListener("change", resize) }
  }, [menuOpen])

  const links = [{ id: "work", label: "PORTFÓLIO" }, { id: "about", label: "SOBRE" }, { id: "services", label: "SERVIÇOS" }, { id: "contact", label: "CONTATO" }]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 transition-all duration-500 ${
          scrolled ? "py-3 bg-[#212121]/95 backdrop-blur-xl border-b border-white/10" : "py-4 bg-[#212121]/80 backdrop-blur-xl border-b border-white/10"
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Logo */}
        <a href="#home" aria-label="LZR Fotografia — início" className="flex items-center" data-cursor-link>
          <BrandLogo />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="text-xs tracking-[0.25em] text-white/50 hover:text-white transition-colors duration-300"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-link
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex">
          <a
            href="#contact"
            className="text-xs tracking-[0.25em] text-white/80 hover:text-white border border-white/20 hover:border-[#FF6C00] hover:text-[#FF6C00] px-6 py-2.5 transition-all duration-300"
            style={{ fontFamily: "var(--font-display)" }}
            data-cursor-link
          >
            {"VAMOS CONVERSAR"}
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col items-end justify-center gap-[6px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
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
            id="mobile-menu" role="navigation" aria-label="Navegação no celular" className="fixed inset-0 z-40 bg-[#181818] flex flex-col items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-12">
              <BrandLogo />
            </div>
            {links.map((l, i) => (
              <motion.a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setMenuOpen(false)}
                className="block text-5xl font-black text-white/80 hover:text-white py-4 tracking-tight transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="mt-8 text-sm tracking-[0.25em] text-[#FF6C00] border border-[#FF6C00]/40 px-8 py-3"
              style={{ fontFamily: "var(--font-display)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {"VAMOS CONVERSAR"}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="hero">
      <img className="hero-image" src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1800&h=1200&fit=crop&auto=format" alt="Montanha refletida em um lago tranquilo ao amanhecer" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow"><span /> LZR FOTOGRAFIA · HISTÓRIAS EM IMAGENS</p>
        <h1>Certos momentos.<br /><em>Ficam para sempre.</em></h1>
        <p className="hero-description">Momentos reais. Imagens com propósito. Fotografia que transforma sentimentos em lembranças para guardar.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#work">EXPLORE O PORTFÓLIO <span aria-hidden="true">↗</span></a>
          <a className="secondary-link" href="#contact">VAMOS CRIAR JUNTOS <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hero-bottom"><span>RETRATOS · CASAMENTOS · EDITORIAL</span><a href="#work">ROLE PARA DESCOBRIR ↓</a></div>
    </section>
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
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.focus()
    return () => { document.body.style.overflow = overflow; previous?.focus() }
  }, [])
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
      ref={dialogRef} role="dialog" aria-modal="true" aria-label="Visualizador de fotos" tabIndex={-1}
      onKeyDown={(e) => { if (e.key === "Tab") { const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button"); if (!buttons?.length) return; if (e.shiftKey && (document.activeElement === buttons[0] || document.activeElement === dialogRef.current)) { e.preventDefault(); buttons[buttons.length - 1].focus() } else if (!e.shiftKey && (document.activeElement === buttons[buttons.length - 1] || document.activeElement === dialogRef.current)) { e.preventDefault(); buttons[0].focus() } } }}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
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
            <p className="text-xs tracking-[0.3em] text-[#FF6C00]" style={{ fontFamily: "var(--font-display)" }}>
              {item.category} · {item.year}
            </p>
            <p className="text-2xl font-black text-white uppercase" style={{ fontFamily: "var(--font-display)" }}>
              {item.title}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNav(items[(idx - 1 + items.length) % items.length].id)}
              className="w-10 h-10 border border-white/20 hover:border-[#FF6C00] flex items-center justify-center text-white/60 hover:text-[#FF6C00] transition-all"
              aria-label="Foto anterior"
            >←</button>
            <button
              onClick={() => onNav(items[(idx + 1) % items.length].id)}
              className="w-10 h-10 border border-white/20 hover:border-[#FF6C00] flex items-center justify-center text-white/60 hover:text-[#FF6C00] transition-all"
              aria-label="Próxima foto"
            >→</button>
            <button
              onClick={onClose}
              className="w-10 h-10 border border-white/20 hover:border-red-500/50 flex items-center justify-center text-white/50 hover:text-red-400 transition-all"
              aria-label="Fechar foto"
            >✕</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── PORTFÓLIO ────────────────────────────────────────────────────────────────

function Portfolio() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section id="work" className="py-28 md:py-40 px-8 md:px-16 bg-[#181818]">
      <Reveal>
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <p
              className="text-xs tracking-[0.35em] text-[#FF6C00] mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PORTFÓLIO
            </p>
            <h2
              className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Trabalhos
              <br />
              selecionados
            </h2>
          </div>
          <p
            className="hidden md:block text-sm text-white/60 max-w-xs text-right leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Uma seleção especial
            <br />
            de histórias em imagens.
          </p>
        </div>
      </Reveal>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[280px]">
        {portfolioItems.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08} className={item.span}>
            <div
              className="portfolio-card relative group overflow-hidden bg-[#262626] h-full"
              role="button" tabIndex={0} aria-label={`Ver ${item.title}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightbox(item.id) } }}
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
                    className="text-xs tracking-[0.25em] text-[#FF6C00] mb-1"
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
                    <span className="block w-8 h-px bg-[#FF6C00]" />
                    <span
                      className="text-[10px] tracking-[0.3em] text-white/60"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      VER PROJETO
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
    <section id="about" className="py-28 md:py-40 px-8 md:px-16 bg-[#212121]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Image */}
        <Reveal>
          <div
            className="relative aspect-[3/4] bg-[#262626] overflow-hidden"
            data-cursor-image
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1100&fit=crop&auto=format"
              alt="Retrato ao ar livre"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818]/40 to-transparent" />
            {/* Corner accent */}
            <div className="absolute bottom-6 left-6">
              <div className="w-10 h-px bg-[#FF6C00] mb-2" />
              <p
                className="text-xs tracking-[0.3em] text-white/50"
                style={{ fontFamily: "var(--font-display)" }}
              >
                POR TRÁS DAS LENTES
              </p>
            </div>
          </div>
        </Reveal>

        {/* Text */}
        <div>
          <Reveal>
            <p
              className="text-xs tracking-[0.35em] text-[#FF6C00] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SOBRE
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Um olhar
              <br />
              sensível.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-white/50 leading-relaxed mb-4 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Na LZR Fotografia, o extraordinário está no cotidiano. Um espaço para
              imagens cinematográficas que capturam emoções e momentos autênticos.
            </p>
            <p
              className="text-white/60 leading-relaxed text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              De um olhar sereno a uma celebração única, cada ensaio começa com uma conexão. O resultado: fotografias com presença, personalidade e sentimento.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/[0.06] pt-10">
              {[
                { val: "01", label: "ATENDIMENTO PESSOAL" },
                { val: "02", label: "DIREÇÃO CRIATIVA" },
                { val: "03", label: "EDIÇÃO CUIDADOSA" },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-4xl font-black text-white mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.val}
                  </p>
                  <p
                    className="text-[10px] tracking-[0.25em] text-white/60 leading-snug"
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
  return (
    <section id="services" className="py-28 md:py-40 px-8 md:px-16 bg-[#181818]">
      <Reveal>
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs tracking-[0.35em] text-[#FF6C00] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            O QUE FAÇO
          </p>
          <h2
            className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Serviços
          </h2>
        </div>
      </Reveal>

      <div className="border-t border-white/[0.06]">
        {services.map((s) => (
          <a
            href="#contact"
            key={s.number}
            className="group border-b border-white/[0.06] py-7 md:py-9 flex items-center justify-between gap-6 service-row transition-colors duration-300"
            data-cursor-link
          >
            <img src={s.url} alt="" loading="lazy" className="service-thumbnail" />
            <div className="flex items-center gap-6 md:gap-10 flex-1 min-w-0">
              <span
                className="text-xs tracking-[0.2em] text-white/60 group-hover:text-[#FF6C00] transition-colors flex-shrink-0"
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
              className="hidden md:block text-sm text-white/60 group-hover:text-white/50 transition-colors max-w-xs text-right"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {s.desc}
            </p>
            <span
              className="text-white/60 group-hover:text-[#FF6C00] transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              →
            </span>
          </a>
        ))}
      </div>

    </section>
  )
}

// ─── PROCESS ──────────────────────────────────────────────────────────────────

function Process() {
  const steps = [
    { n: "01", title: "DESCOBRIR", desc: "Tudo começa com uma boa conversa: sua visão, seu público e o sentimento que você quer registrar." },
    { n: "02", title: "CRIAR", desc: "Direção, referências e estratégia criativa se encontram para dar forma à sua ideia." },
    { n: "03", title: "REGISTRAR", desc: "O ensaio: atenção aos detalhes, presença e calma. Cada imagem tem um propósito." },
    { n: "04", title: "ENTREGAR", desc: "Fotos selecionadas, editadas e entregues. Sua galeria pronta para compartilhar e guardar." },
  ]

  return (
    <section className="py-28 md:py-40 px-8 md:px-16 bg-[#212121]">
      <Reveal>
        <div className="mb-16 md:mb-24">
          <p
            className="text-xs tracking-[0.35em] text-[#FF6C00] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            COMO FUNCIONA
          </p>
          <h2
            className="text-5xl md:text-7xl font-black uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            O processo
          </h2>
        </div>
      </Reveal>

      <div className="grid md:grid-cols-4 gap-px bg-white/[0.06]">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.12}>
            <div className="bg-[#212121] p-8 md:p-10 h-full">
              <p
                className="text-5xl font-black text-white/[0.07] mb-8 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.n}
              </p>
              <div className="w-6 h-px bg-[#FF6C00] mb-6" />
              <p
                className="text-2xl font-black text-white uppercase mb-4 leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </p>
              <p
                className="text-sm text-white/65 leading-relaxed"
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
          alt="Vista de Paris ao entardecer"
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
            "Cada imagem
            <br />
            conta uma história."
          </p>
          <div className="mt-6 w-10 h-px bg-[#FF6C00] mx-auto" />
        </Reveal>
      </motion.div>
    </div>
  )
}

// ─── HORIZONTAL GALLERY ───────────────────────────────────────────────────────

function HorizontalGallery() {
  const [active, setActive] = useState(0)
  const photo = galleryImages[active]
  return <section className="gallery-section" aria-label="Galeria de paisagens">
    <div className="gallery-heading"><div><p className="eyebrow">ENTRE MOMENTOS</p><h2>Uma nova perspectiva.</h2></div>
      <div className="gallery-controls"><button aria-label="Paisagem anterior" onClick={() => setActive((active - 1 + galleryImages.length) % galleryImages.length)}>←</button><button aria-label="Próxima paisagem" onClick={() => setActive((active + 1) % galleryImages.length)}>→</button></div>
    </div>
    <figure><img src={photo.url} alt={photo.alt} loading="lazy" /><figcaption aria-live="polite"><span>{photo.alt}</span><span>{String(active + 1).padStart(2, "0")} / 05</span></figcaption></figure>
  </section>
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="py-28 md:py-48 px-8 md:px-16 bg-[#212121] text-center">
      <Reveal>
        <p
          className="text-xs tracking-[0.4em] text-[#FF6C00] mb-8 uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Vamos trabalhar juntos
        </p>
        <h2
          className="text-[10vw] md:text-[7vw] font-black uppercase leading-none text-white mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {"Vamos criar"}
          <br />
          <span className="text-white/60">algo</span>
          <br />
          inesquecível.
        </h2>
        <p
          className="text-white/60 text-sm mb-14 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Disponível para projetos especiais, ensaios e colaborações.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-5 border border-white/20 hover:border-[#FF6C00] text-white hover:text-[#FF6C00] px-10 py-4 text-sm tracking-[0.3em] transition-all duration-400 group"
          style={{ fontFamily: "var(--font-display)" }}
          data-cursor-link
        >
          COMECE UM PROJETO
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
    "w-full bg-transparent border-b border-white/[0.12] focus:border-[#FF6C00] py-4 text-white/80 text-sm outline-none placeholder:text-white/60 transition-colors"

  return (
    <section id="contact" className="py-28 md:py-40 px-8 md:px-16 bg-[#181818]">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-28">
        <div>
          <Reveal>
            <p
              className="text-xs tracking-[0.35em] text-[#FF6C00] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ENTRE EM CONTATO
            </p>
            <h2
              className="text-5xl md:text-6xl font-black uppercase leading-none text-white mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {"Vamos"}
              <br />
              conversar
            </h2>
            <div className="space-y-5">
              {[
                { label: "E-MAIL", val: "Em breve" },
                { label: "TELEFONE", val: "Em breve" },
                { label: "ATENDIMENTO", val: "Com agendamento" },
              ].map((info) => (
                <div key={info.label}>
                  <p
                    className="text-[10px] tracking-[0.3em] text-white/60 mb-1"
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

          </Reveal>
        </div>

        <Reveal delay={0.1}>
          {sent ? (
            <div role="status" className="flex flex-col justify-center h-full">
              <div className="w-10 h-px bg-[#FF6C00] mb-6" />
              <p
                className="text-3xl font-black text-white uppercase mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Envio indisponível.
              </p>
              <p className="text-sm text-white/65" style={{ fontFamily: "var(--font-body)" }}>
                Nosso canal de contato está sendo atualizado. Sua mensagem não foi enviada.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-8">
              <p className="text-sm text-white/60">O envio de pedidos está temporariamente indisponível enquanto atualizamos nosso canal de contato.</p>
              <div>
                <label htmlFor="name" className="sr-only">Nome</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nome"
                  required
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="E-mail"
                  required
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Telefone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Telefone (opcional)"
                  className={inputClass}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="type" className="sr-only">Tipo de projeto</label>
                <select
                  id="type"
                  required
                  className={`${inputClass} appearance-none`}
                  style={{ fontFamily: "var(--font-body)", background: "transparent" }}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="" disabled style={{ background: "#262626" }}>Tipo de projeto</option>
                  {["Casamento", "Retrato", "Evento", "Editorial", "Publicidade", "Marca pessoal", "Outro"].map((t) => (
                    <option key={t} value={t} style={{ background: "#262626" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Mensagem</label>
                <textarea
                  id="message"
                  placeholder="Conte um pouco sobre o seu projeto..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                  style={{ fontFamily: "var(--font-body)" }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button
                type="submit" disabled
                className="w-full border border-white/20 hover:border-[#FF6C00] text-white hover:text-[#FF6C00] py-4 text-xs tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 group"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CONTATO EM BREVE
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
    <footer className="py-16 md:py-20 px-8 md:px-16 bg-[#181818] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 mb-14">
          <div>
            <BrandLogo />
            <p
              className="text-[10px] tracking-[0.3em] text-white/60"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FOTOGRAFIA / HISTÓRIAS EM IMAGENS
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-right">
            {[
              { label: "E-MAIL", val: "Em breve" },
              { label: "TELEFONE", val: "Em breve" },
              { label: "ATENDIMENTO", val: "Com agendamento" },
            ].map((info) => (
              <div key={info.label}>
                <p
                  className="text-[9px] tracking-[0.3em] text-white/60 mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {info.label}
                </p>
                <p
                  className="text-xs text-white/65"
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
            className="text-[10px] tracking-[0.2em] text-white/60"
            style={{ fontFamily: "var(--font-display)" }}
          >
            © 2026 — TODOS OS DIREITOS RESERVADOS
          </p>
          <div className="flex items-center gap-8">

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-[10px] tracking-[0.2em] text-white/60 hover:text-[#FF6C00] transition-colors"
              style={{ fontFamily: "var(--font-display)" }}
              data-cursor-link
            >
              VOLTAR AO TOPO ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {

  return (
    <MotionConfig reducedMotion="user"><div
      className="bg-[#181818] text-[#ede9e3] min-h-screen"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <a className="skip-link" href="#work">Pular para o conteúdo</a>
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
    </div></MotionConfig>
  )
}
