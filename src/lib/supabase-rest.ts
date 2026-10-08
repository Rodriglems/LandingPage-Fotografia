import type { SiteContent } from "./site-content"

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, "")
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const sessionKey = "lzr-admin-session"

export const isSupabaseConfigured = Boolean(url && anonKey)

interface AuthSession {
  access_token: string
  refresh_token: string
  expires_at: number
  user: { email?: string }
}

function readSession(): AuthSession | null {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) || "null")
  } catch {
    return null
  }
}

function saveSession(payload: Omit<AuthSession, "expires_at"> & { expires_in: number }) {
  const session: AuthSession = {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    user: payload.user,
    expires_at: Date.now() + payload.expires_in * 1000,
  }
  localStorage.setItem(sessionKey, JSON.stringify(session))
  return session
}

async function request(path: string, options: RequestInit = {}, token?: string) {
  if (!url || !anonKey) throw new Error("Supabase ainda não foi configurado.")
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token || anonKey}`,
      ...options.headers,
    },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.msg || body.message || body.error_description || "Não foi possível concluir a operação.")
  }
  if (response.status === 204) return null
  return response.json().catch(() => null)
}

export async function signIn(email: string, password: string) {
  const payload = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  return saveSession(payload)
}

export function signOut() {
  localStorage.removeItem(sessionKey)
}

export async function getSession() {
  const session = readSession()
  if (!session) return null
  if (session.expires_at > Date.now() + 60_000) return session
  try {
    const payload = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })
    return saveSession(payload)
  } catch {
    signOut()
    return null
  }
}

export async function fetchSiteContent(): Promise<SiteContent | null> {
  if (!isSupabaseConfigured) return null
  const rows = await request("/rest/v1/site_content?id=eq.main&select=content")
  return rows?.[0]?.content || null
}

export async function saveSiteContent(content: SiteContent) {
  const session = await getSession()
  if (!session) throw new Error("Sua sessão expirou. Entre novamente.")
  await request("/rest/v1/site_content?id=eq.main", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ content, updated_at: new Date().toISOString() }),
  }, session.access_token)
}

export async function uploadImage(file: File) {
  const session = await getSession()
  if (!session) throw new Error("Sua sessão expirou. Entre novamente.")
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-")
  const path = `${Date.now()}-${safeName}`
  await request(`/storage/v1/object/site-media/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: file,
  }, session.access_token)
  return `${url}/storage/v1/object/public/site-media/${path}`
}
