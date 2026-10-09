import { useState, useEffect, useMemo, useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, AnimatePresence, MotionConfig } from "motion/react"
import { SiteContentProvider, useSiteContent } from "@/context/SiteContentContext"
import type { PortfolioItem } from "@/lib/site-content"
import { createContactRequest } from "@/lib/supabase-rest"

const categories = ["Todos", "Casamentos", "Retratos", "Editorial", "Eventos", "Marcas"] as const

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────

function BrandLogo({ className = "" }: { className?: string }) {
  const { content } = useSiteContent()
  return <span className={`brand-logo ${className}`}><img src={content.brand.logoUrl} alt="LZR Fotografia" /></span>
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("home")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const marker = window.scrollY + 160
      let current = "home"
      for (const id of ["work", "about", "services", "contact"]) {
        const section = document.getElementById(id)
        if (section && section.offsetTop <= marker) current = id
      }
      setActive(current)
    }
    onScroll()
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
          scrolled || menuOpen ? "py-3 bg-[#181818]/92 backdrop-blur-xl border-b border-white/10" : "py-5 bg-transparent border-b border-transparent"
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
              className={`nav-link text-xs tracking-[0.25em] transition-colors duration-300 ${active === l.id ? "is-active" : "text-white/60 hover:text-white"}`}
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
  const { content } = useSiteContent()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"])

  return (
    <section id="home" className="hero" ref={ref}>
      <motion.img className="hero-image" style={{ y, scale: 1.08 }} src={content.hero.imageUrl} alt="" fetchPriority="high" />
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow"><span /> {content.hero.eyebrow}</p>
        <h1>{content.hero.title}<br /><em>{content.hero.titleAccent}</em></h1>
        <p className="hero-description">{content.hero.description}</p>
        <div className="hero-actions">
          <a className="primary-button" href="#work">VER O TRABALHO <span aria-hidden="true">↗</span></a>
          <a className="secondary-link" href="#contact">PEDIR UM ENSAIO <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="hero-bottom">
        <span>RETRATOS · CASAMENTOS · EDITORIAL</span>
        <a className="hero-scroll" href="#work">ROLE PARA DESCOBRIR ↓</a>
      </div>
    </section>
  )
}

function IntroBand() {
  const { content } = useSiteContent()
  return (
    <div className="intro-band">
      <div>
        <span className="intro-label">O OLHAR LZR</span>
        <p>{content.intro}</p>
      </div>
      <a href="#contact">QUERO UM ENSAIO ASSIM <span aria-hidden="true">→</span></a>
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
            <p className="text-xs tracking-[0.3em] text-white/50 mb-1" style={{ fontFamily: "var(--font-display)" }}>
              {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
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
  const { content } = useSiteContent()
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [filter, setFilter] = useState<(typeof categories)[number]>("Todos")
  const visible = useMemo(
    () => (filter === "Todos" ? content.portfolio : content.portfolio.filter((item) => item.category === filter)),
    [filter, content.portfolio]
  )

  return (
    <section id="work" className="py-20 md:py-28 px-8 md:px-16 bg-[#181818]">
      <Reveal>
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#FF6C00] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              PORTFÓLIO
            </p>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-none text-white" style={{ fontFamily: "var(--font-display)" }}>
              Trabalhos
              <br />
              selecionados
            </h2>
          </div>
          <p className="hidden md:block text-sm text-white/70 max-w-xs text-right leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            Uma seleção para mostrar o olhar.
            <br />
            Clique para ver em tela cheia.
          </p>
        </div>
      </Reveal>

      <div className="filters" role="toolbar" aria-label="Filtrar portfólio">
        {categories.map((category) => (
          <button key={category} type="button" aria-pressed={filter === category} onClick={() => { setFilter(category); setLightbox(null) }}>
            {category.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{visible.length} trabalhos em {filter}</p>

      <div className="work-grid">
        {visible.map((item) => (
          <button key={item.id} type="button" className={`work-card ${item.layout}`} aria-label={`Ver ${item.title}`} onClick={() => setLightbox(item.id)}>
            <span className="frame">
              <img src={item.imageUrl} alt={item.alt} loading="lazy" />
              <span className="work-caption">
                <span>
                  <span className="work-kicker">{item.category} · {item.year}</span>
                  <span className="work-title">{item.title}</span>
                </span>
                <span className="work-view">VER</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox !== null && <LightboxModal items={visible} activeId={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />}
      </AnimatePresence>
    </section>
  )
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About() {
  const { content } = useSiteContent()
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
              src={content.about.imageUrl}
              alt="Fotógrafo em ensaio ao ar livre, visto de lado"
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
              {content.about.title}
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-white/75 leading-relaxed mb-4 text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {content.about.paragraph1}
            </p>
            <p
              className="text-white/75 leading-relaxed text-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {content.about.paragraph2}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="promise-list">
              {[
                { title: "Direção de cena", desc: "Referências, luz e condução para o ensaio acontecer com calma." },
                { title: "Edição autoral", desc: "Cor, seleção e acabamento com um olhar consistente." },
                { title: "Galeria privada", desc: "Arquivos organizados para guardar, imprimir e divulgar." },
              ].map((item) => (
                <article key={item.title}>
                  <span className="mark" aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                </article>
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
  const { content } = useSiteContent()
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

      <div className="service-grid">
        {content.services.map((s) => (
          <a href="#contact" key={s.number} className="service-card">
            <img src={s.url} alt="" loading="lazy" />
            <span className="shade" />
            <span className="meta">
              <span className="index">{s.number}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
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
  const { content } = useSiteContent()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.25])
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])

  return (
    <div ref={ref} className="relative h-[70vh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <img
          src={content.cinematic.imageUrl}
          alt="Casal em close durante um ensaio"
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
            “{content.cinematic.text}”
          </p>
          <div className="mt-6 w-10 h-px bg-[#FF6C00] mx-auto" />
        </Reveal>
      </motion.div>
    </div>
  )
}

// ─── HORIZONTAL GALLERY ───────────────────────────────────────────────────────

function Quotes() {
  const { content } = useSiteContent()
  return (
    <section className="py-24 md:py-32 px-8 md:px-16 bg-[#181818]" aria-label="Depoimentos">
      <Reveal>
        <p className="text-xs tracking-[0.35em] text-[#FF6C00] mb-4" style={{ fontFamily: "var(--font-display)" }}>DEPOIMENTOS</p>
        <h2 className="text-5xl md:text-6xl font-black uppercase leading-none text-white mb-14" style={{ fontFamily: "var(--font-display)" }}>
          O que fica
          <br />
          depois do ensaio
        </h2>
      </Reveal>
      <div className="quote-grid">
        {content.quotes.map((quote) => (
          <blockquote className="quote-card" key={quote.name}>
            <p>“{quote.text}”</p>
            <footer>{quote.name} · {quote.context}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

function Filmstrip() {
  const { content } = useSiteContent()
  const scroller = useRef<HTMLDivElement>(null)
  const scroll = (direction: number) => {
    const node = scroller.current
    if (!node) return
    node.scrollBy({ left: direction * Math.min(node.clientWidth * 0.8, 640), behavior: "smooth" })
  }

  return (
    <section className="gallery-section filmstrip" aria-label="Arquivo de imagens">
      <div className="gallery-heading">
        <div>
          <p className="eyebrow"><span />ARQUIVO</p>
          <h2>Passe o olhar pelo trabalho.</h2>
        </div>
        <div className="gallery-controls">
          <button type="button" aria-label="Imagens anteriores" onClick={() => scroll(-1)}>←</button>
          <button type="button" aria-label="Próximas imagens" onClick={() => scroll(1)}>→</button>
        </div>
      </div>
      <div className="filmstrip-track" ref={scroller}>
        {content.portfolio.map((item) => (
          <figure key={item.id}>
            <img src={item.imageUrl} alt={item.alt} loading="lazy" />
            <figcaption><span>{item.title}</span><span>{item.category}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
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
          Ensaios, casamentos e campanhas com vaga para novos projetos.
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
  const { content } = useSiteContent()
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [website, setWebsite] = useState("")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (website) return
    setSending(true)
    setError("")
    try {
      await createContactRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        project_type: form.type,
        message: form.message.trim(),
      })
      setSent(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível enviar. Tente novamente.")
    } finally {
      setSending(false)
    }
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
                { label: "E-MAIL", val: content.contact.email },
                { label: "TELEFONE", val: content.contact.phone },
                { label: "ATENDIMENTO", val: content.contact.location },
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
                Pedido anotado.
              </p>
              <p className="text-sm text-white/75" style={{ fontFamily: "var(--font-body)" }}>
                Obrigado{form.name ? `, ${form.name.split(" ")[0]}` : ""}. Seu pedido{form.type ? ` de ${form.type.toLowerCase()}` : ""} foi enviado para a LZR.
              </p>
              <button type="button" className="secondary-link mt-8" onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", type: "", message: "" }) }}>ENVIAR OUTRO PEDIDO</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-7">
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="website">Site</label>
                <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div>
                <label htmlFor="name" className="field-label">NOME</label>
                <input id="name" type="text" autoComplete="name" required className={inputClass} style={{ fontFamily: "var(--font-body)" }} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label htmlFor="email" className="field-label">E-MAIL</label>
                <input id="email" type="email" autoComplete="email" required className={inputClass} style={{ fontFamily: "var(--font-body)" }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label htmlFor="phone" className="field-label">TELEFONE</label>
                <input id="phone" type="tel" autoComplete="tel" className={inputClass} style={{ fontFamily: "var(--font-body)" }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label htmlFor="type" className="field-label">TIPO DE PROJETO</label>
                <select id="type" required className={`${inputClass} appearance-none`} style={{ fontFamily: "var(--font-body)", background: "transparent" }} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="" disabled style={{ background: "#262626" }}>Selecione</option>
                  {["Casamento", "Retrato", "Evento", "Editorial", "Marca", "Produto", "Outro"].map((t) => (
                    <option key={t} value={t} style={{ background: "#262626" }}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="message" className="field-label">MENSAGEM</label>
                <textarea id="message" placeholder="Data, cidade e o que você quer registrar" rows={4} className={`${inputClass} resize-none`} style={{ fontFamily: "var(--font-body)" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              {error && <p role="alert" className="contact-error">{error}</p>}
              <button type="submit" disabled={sending} className="w-full border border-white/20 hover:border-[#FF6C00] hover:bg-[#FF6C00] text-white hover:text-[#181818] py-4 text-xs tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-4 group" style={{ fontFamily: "var(--font-display)" }}>
                {sending ? "ENVIANDO..." : "ENVIAR PEDIDO"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
              <p className="contact-note">Seus dados serão usados somente para responder a este pedido.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const { content } = useSiteContent()
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
              { label: "E-MAIL", val: content.contact.email },
              { label: "TELEFONE", val: content.contact.phone },
              { label: "ATENDIMENTO", val: content.contact.location },
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
    <SiteContentProvider>
      <MotionConfig reducedMotion="user"><div
        className="bg-[#181818] text-[#ede9e3] min-h-screen"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <a className="skip-link" href="#work">Pular para o conteúdo</a>
        <Navbar />
        <main>
          <Hero />
          <IntroBand />
          <Portfolio />
          <About />
          <Services />
          <Process />
          <Quotes />
          <CinematicQuote />
          <Filmstrip />
          <CTA />
          <Contact />
        </main>
        <Footer />
      </div></MotionConfig>
    </SiteContentProvider>
  )
}
