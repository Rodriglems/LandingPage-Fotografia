import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { defaultSiteContent, type SiteContent } from "@/lib/site-content"
import { fetchSiteContent } from "@/lib/supabase-rest"

interface SiteContentState {
  content: SiteContent
  loading: boolean
}

const SiteContentContext = createContext<SiteContentState>({
  content: defaultSiteContent,
  loading: false,
})

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultSiteContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSiteContent()
      .then((remote) => {
        if (remote) setContent({ ...defaultSiteContent, ...remote })
      })
      .catch((error) => console.error("Não foi possível carregar o conteúdo remoto:", error))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteContentContext.Provider value={{ content, loading }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  return useContext(SiteContentContext)
}
