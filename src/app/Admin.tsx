import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import logoSrc from "@/imports/LogoLuze-Photoroom (1).png"
import { defaultSiteContent, type PortfolioItem, type SiteContent, type WorkCategory, type WorkLayout } from "@/lib/site-content"
import {
  deleteContactRequest,
  fetchContactRequests,
  fetchSiteContent,
  getSession,
  isSupabaseConfigured,
  saveSiteContent,
  signIn,
  signOut,
  updateContactRequest,
  uploadImage,
  type ContactRequest,
} from "@/lib/supabase-rest"
import "@/styles/admin.css"

type Tab = "pagina" | "portfolio" | "servicos" | "depoimentos" | "pedidos"

const categories: WorkCategory[] = ["Casamentos", "Retratos", "Editorial", "Eventos", "Marcas"]
const layouts: { value: WorkLayout; label: string }[] = [
  { value: "feature", label: "Vertical destaque" },
  { value: "tall", label: "Vertical alto" },
  { value: "standard", label: "Vertical padrão" },
  { value: "wide", label: "Horizontal" },
]

function Field({ label, value, onChange, multiline = false }: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline
        ? <textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
        : <input value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  )
}

function ImageField({ label, value, onChange }: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Escolha um arquivo de imagem.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem deve ter no máximo 10 MB.")
      return
    }
    setUploading(true)
    setError("")
    try {
      onChange(await uploadImage(file))
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Falha ao enviar imagem.")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="admin-image-field">
      <span className="admin-field-label">{label}</span>
      <div className="admin-image-row">
        <img src={value} alt="" />
        <label className="admin-upload">
          {uploading ? "ENVIANDO..." : "TROCAR IMAGEM"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload} disabled={uploading} />
        </label>
      </div>
      <input className="admin-url-input" value={value} onChange={(event) => onChange(event.target.value)} aria-label={`${label} por URL`} />
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signIn(email, password)
      onSuccess()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login">
      <form onSubmit={submit}>
        <img src={logoSrc} alt="LZR Fotografia" />
        <p className="admin-kicker">PAINEL ADMINISTRATIVO</p>
        <h1>Entrar</h1>
        <Field label="E-MAIL" value={email} onChange={setEmail} />
        <label className="admin-field">
          <span>SENHA</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="admin-error">{error}</p>}
        <button className="admin-primary" disabled={loading}>{loading ? "ENTRANDO..." : "ENTRAR"}</button>
        <a href="/">← Voltar para o site</a>
      </form>
    </main>
  )
}

function SetupNotice() {
  return (
    <main className="admin-login">
      <div className="admin-setup">
        <img src={logoSrc} alt="LZR Fotografia" />
        <p className="admin-kicker">CONFIGURAÇÃO NECESSÁRIA</p>
        <h1>Painel preparado</h1>
        <p>Crie o projeto no Supabase, execute o arquivo <code>supabase/schema.sql</code> e copie as duas chaves para o arquivo <code>.env</code>.</p>
        <pre>VITE_SUPABASE_URL=...{"\n"}VITE_SUPABASE_ANON_KEY=...</pre>
        <a className="admin-primary" href="/">VOLTAR PARA O SITE</a>
      </div>
    </main>
  )
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [content, setContent] = useState<SiteContent>(defaultSiteContent)
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [tab, setTab] = useState<Tab>("pagina")
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")

  const load = async () => {
    const session = await getSession()
    setAuthenticated(Boolean(session))
    if (session) {
      const remote = await fetchSiteContent()
      if (remote) setContent({ ...defaultSiteContent, ...remote })
      try {
        setRequests(await fetchContactRequests())
      } catch {
        setRequests([])
      }
    }
    setChecking(false)
  }

  useEffect(() => {
    if (isSupabaseConfigured) load().catch(() => setChecking(false))
    else setChecking(false)
  }, [])

  const save = async () => {
    setSaving(true)
    setNotice("")
    try {
      await saveSiteContent(content)
      setNotice("Alterações publicadas com sucesso.")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar.")
    } finally {
      setSaving(false)
    }
  }

  const updatePortfolio = (id: number, patch: Partial<PortfolioItem>) => {
    setContent((current) => ({
      ...current,
      portfolio: current.portfolio.map((item) => item.id === id ? { ...item, ...patch } : item),
    }))
  }

  const addPortfolio = () => {
    const nextId = Math.max(0, ...content.portfolio.map((item) => item.id)) + 1
    setContent((current) => ({
      ...current,
      portfolio: [...current.portfolio, {
        id: nextId,
        number: String(current.portfolio.length + 1).padStart(2, "0"),
        title: "Novo trabalho",
        category: "Retratos",
        year: String(new Date().getFullYear()),
        imageUrl: defaultSiteContent.portfolio[0].imageUrl,
        alt: "Descrição da fotografia",
        layout: "standard",
      }],
    }))
  }

  const changeRequestStatus = async (id: string, status: ContactRequest["status"]) => {
    setNotice("")
    try {
      await updateContactRequest(id, status)
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request))
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível atualizar o pedido.")
    }
  }

  const removeRequest = async (id: string) => {
    if (!window.confirm("Excluir este pedido permanentemente?")) return
    setNotice("")
    try {
      await deleteContactRequest(id)
      setRequests((current) => current.filter((request) => request.id !== id))
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível excluir o pedido.")
    }
  }

  if (!isSupabaseConfigured) return <SetupNotice />
  if (checking) return <div className="admin-loading">Carregando painel...</div>
  if (!authenticated) return <Login onSuccess={load} />

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-logo"><img src={logoSrc} alt="LZR Fotografia" /></a>
        <p>PAINEL ADMINISTRATIVO</p>
        <nav>
          {([
            ["pagina", "Página"],
            ["portfolio", "Portfólio"],
            ["servicos", "Serviços"],
            ["depoimentos", "Depoimentos"],
            ["pedidos", `Pedidos${requests.some((request) => request.status === "new") ? " •" : ""}`],
          ] as [Tab, string][]).map(([id, label]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>
          ))}
        </nav>
        <button className="admin-logout" onClick={() => { signOut(); setAuthenticated(false) }}>Sair</button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">CONTEÚDO DO SITE</p>
            <h1>{tab === "pagina" ? "Página principal" : tab[0].toUpperCase() + tab.slice(1)}</h1>
          </div>
          <div className="admin-actions">
            <a href="/" target="_blank" rel="noreferrer">VER SITE ↗</a>
            {tab !== "pedidos" && <button className="admin-primary" onClick={save} disabled={saving}>{saving ? "SALVANDO..." : "PUBLICAR ALTERAÇÕES"}</button>}
          </div>
        </header>
        {notice && <p className="admin-notice" role="status">{notice}</p>}

        {tab === "pagina" && (
          <div className="admin-sections">
            <section className="admin-panel">
              <h2>Marca</h2>
              <ImageField label="LOGO DA MARCA" value={content.brand.logoUrl} onChange={(logoUrl) => setContent({ ...content, brand: { logoUrl } })} />
              <p className="admin-help">Use preferencialmente PNG, WebP ou SVG com fundo transparente.</p>
            </section>
            <section className="admin-panel">
              <h2>Hero</h2>
              <ImageField label="IMAGEM PRINCIPAL" value={content.hero.imageUrl} onChange={(imageUrl) => setContent({ ...content, hero: { ...content.hero, imageUrl } })} />
              <div className="admin-grid">
                <Field label="LINHA SUPERIOR" value={content.hero.eyebrow} onChange={(eyebrow) => setContent({ ...content, hero: { ...content.hero, eyebrow } })} />
                <Field label="TÍTULO" value={content.hero.title} onChange={(title) => setContent({ ...content, hero: { ...content.hero, title } })} />
                <Field label="TÍTULO EM DESTAQUE" value={content.hero.titleAccent} onChange={(titleAccent) => setContent({ ...content, hero: { ...content.hero, titleAccent } })} />
              </div>
              <Field label="DESCRIÇÃO" multiline value={content.hero.description} onChange={(description) => setContent({ ...content, hero: { ...content.hero, description } })} />
              <Field label="TEXTO DE INTRODUÇÃO" multiline value={content.intro} onChange={(intro) => setContent({ ...content, intro })} />
            </section>
            <section className="admin-panel">
              <h2>Sobre</h2>
              <ImageField label="IMAGEM SOBRE" value={content.about.imageUrl} onChange={(imageUrl) => setContent({ ...content, about: { ...content.about, imageUrl } })} />
              <Field label="TÍTULO" value={content.about.title} onChange={(title) => setContent({ ...content, about: { ...content.about, title } })} />
              <Field label="PRIMEIRO PARÁGRAFO" multiline value={content.about.paragraph1} onChange={(paragraph1) => setContent({ ...content, about: { ...content.about, paragraph1 } })} />
              <Field label="SEGUNDO PARÁGRAFO" multiline value={content.about.paragraph2} onChange={(paragraph2) => setContent({ ...content, about: { ...content.about, paragraph2 } })} />
            </section>
            <section className="admin-panel">
              <h2>Contato</h2>
              <div className="admin-grid">
                <Field label="E-MAIL" value={content.contact.email} onChange={(email) => setContent({ ...content, contact: { ...content.contact, email } })} />
                <Field label="TELEFONE" value={content.contact.phone} onChange={(phone) => setContent({ ...content, contact: { ...content.contact, phone } })} />
                <Field label="LOCAL / ATENDIMENTO" value={content.contact.location} onChange={(location) => setContent({ ...content, contact: { ...content.contact, location } })} />
                <Field label="INSTAGRAM" value={content.contact.instagram} onChange={(instagram) => setContent({ ...content, contact: { ...content.contact, instagram } })} />
              </div>
            </section>
            <section className="admin-panel">
              <h2>Pausa cinematográfica</h2>
              <ImageField label="IMAGEM" value={content.cinematic.imageUrl} onChange={(imageUrl) => setContent({ ...content, cinematic: { ...content.cinematic, imageUrl } })} />
              <Field label="FRASE" value={content.cinematic.text} onChange={(text) => setContent({ ...content, cinematic: { ...content.cinematic, text } })} />
            </section>
          </div>
        )}

        {tab === "portfolio" && (
          <div className="admin-sections">
            <div className="admin-list-heading">
              <p>{content.portfolio.length} fotografias</p>
              <button className="admin-secondary" onClick={addPortfolio}>+ ADICIONAR TRABALHO</button>
            </div>
            {content.portfolio.map((item) => (
              <section className="admin-panel admin-item" key={item.id}>
                <ImageField label={`IMAGEM ${item.number}`} value={item.imageUrl} onChange={(imageUrl) => updatePortfolio(item.id, { imageUrl })} />
                <div className="admin-grid">
                  <Field label="TÍTULO" value={item.title} onChange={(title) => updatePortfolio(item.id, { title })} />
                  <label className="admin-field"><span>CATEGORIA</span><select value={item.category} onChange={(event) => updatePortfolio(item.id, { category: event.target.value as WorkCategory })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                  <Field label="ANO" value={item.year} onChange={(year) => updatePortfolio(item.id, { year })} />
                  <label className="admin-field"><span>FORMATO</span><select value={item.layout} onChange={(event) => updatePortfolio(item.id, { layout: event.target.value as WorkLayout })}>{layouts.map((layout) => <option key={layout.value} value={layout.value}>{layout.label}</option>)}</select></label>
                </div>
                <Field label="TEXTO ALTERNATIVO" value={item.alt} onChange={(alt) => updatePortfolio(item.id, { alt })} />
                <button className="admin-danger" onClick={() => setContent({ ...content, portfolio: content.portfolio.filter((photo) => photo.id !== item.id) })}>REMOVER TRABALHO</button>
              </section>
            ))}
          </div>
        )}

        {tab === "servicos" && (
          <div className="admin-sections">
            {content.services.map((service, index) => (
              <section className="admin-panel admin-item" key={`${service.number}-${index}`}>
                <ImageField label={`IMAGEM ${service.number}`} value={service.url} onChange={(url) => setContent({ ...content, services: content.services.map((item, position) => position === index ? { ...item, url } : item) })} />
                <Field label="TÍTULO" value={service.title} onChange={(title) => setContent({ ...content, services: content.services.map((item, position) => position === index ? { ...item, title } : item) })} />
                <Field label="DESCRIÇÃO" multiline value={service.desc} onChange={(desc) => setContent({ ...content, services: content.services.map((item, position) => position === index ? { ...item, desc } : item) })} />
              </section>
            ))}
          </div>
        )}

        {tab === "depoimentos" && (
          <div className="admin-sections">
            {content.quotes.map((quote, index) => (
              <section className="admin-panel admin-item" key={index}>
                <Field label="DEPOIMENTO" multiline value={quote.text} onChange={(text) => setContent({ ...content, quotes: content.quotes.map((item, position) => position === index ? { ...item, text } : item) })} />
                <div className="admin-grid">
                  <Field label="NOME" value={quote.name} onChange={(name) => setContent({ ...content, quotes: content.quotes.map((item, position) => position === index ? { ...item, name } : item) })} />
                  <Field label="TIPO DE TRABALHO" value={quote.context} onChange={(context) => setContent({ ...content, quotes: content.quotes.map((item, position) => position === index ? { ...item, context } : item) })} />
                </div>
              </section>
            ))}
          </div>
        )}

        {tab === "pedidos" && (
          <div className="admin-sections">
            <div className="admin-list-heading">
              <p>{requests.length} {requests.length === 1 ? "pedido recebido" : "pedidos recebidos"}</p>
              <button className="admin-secondary" onClick={() => fetchContactRequests().then(setRequests).catch((error) => setNotice(error.message))}>ATUALIZAR</button>
            </div>
            {requests.length === 0 ? (
              <section className="admin-panel admin-empty">
                <h2>Nenhum pedido ainda</h2>
                <p>As mensagens enviadas pelo formulário aparecerão aqui.</p>
              </section>
            ) : requests.map((request) => (
              <article className={`admin-panel request-card ${request.status}`} key={request.id}>
                <div className="request-heading">
                  <div>
                    <span className="request-status">{request.status === "new" ? "NOVO" : request.status === "read" ? "LIDO" : "ARQUIVADO"}</span>
                    <h2>{request.name}</h2>
                    <time dateTime={request.created_at}>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.created_at))}</time>
                  </div>
                  <span className="request-type">{request.project_type}</span>
                </div>
                <p className="request-message">{request.message || "Sem mensagem adicional."}</p>
                <div className="request-contact">
                  <a href={`mailto:${request.email}`}>{request.email}</a>
                  {request.phone && <a href={`tel:${request.phone}`}>{request.phone}</a>}
                </div>
                <div className="request-actions">
                  {request.status !== "read" && <button onClick={() => changeRequestStatus(request.id, "read")}>MARCAR COMO LIDO</button>}
                  {request.status !== "archived" && <button onClick={() => changeRequestStatus(request.id, "archived")}>ARQUIVAR</button>}
                  <button className="admin-danger" onClick={() => removeRequest(request.id)}>EXCLUIR</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
