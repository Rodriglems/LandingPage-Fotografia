import logoSrc from "@/imports/LogoLuze-Photoroom (1).png"

export type WorkCategory = "Casamentos" | "Retratos" | "Editorial" | "Eventos" | "Marcas"
export type WorkLayout = "feature" | "tall" | "wide" | "standard"

export interface PortfolioItem {
  id: number
  number: string
  title: string
  category: WorkCategory
  year: string
  imageUrl: string
  alt: string
  layout: WorkLayout
}

export interface ServiceItem {
  number: string
  title: string
  desc: string
  url: string
}

export interface QuoteItem {
  text: string
  name: string
  context: string
}

export interface SiteContent {
  brand: {
    logoUrl: string
  }
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    description: string
    imageUrl: string
  }
  intro: string
  portfolio: PortfolioItem[]
  about: {
    title: string
    paragraph1: string
    paragraph2: string
    imageUrl: string
  }
  services: ServiceItem[]
  quotes: QuoteItem[]
  cinematic: {
    text: string
    imageUrl: string
  }
  contact: {
    email: string
    phone: string
    location: string
    instagram: string
  }
}

const photo = (id: string, width = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

export const defaultSiteContent: SiteContent = {
  brand: {
    logoUrl: logoSrc,
  },
  hero: {
    eyebrow: "LZR FOTOGRAFIA · HISTÓRIAS EM IMAGENS",
    title: "Certos momentos.",
    titleAccent: "Ficam para sempre.",
    description: "Casamentos, retratos e campanhas com direção de cena. Um portfólio para quem quer imagens com presença — e uma lembrança que ainda se sente.",
    imageUrl: photo("1511285560929-80b456fea0bc", 2000),
  },
  intro: "O trabalho entra primeiro. Abaixo, uma seleção de ensaios — casamentos, retratos, editorial, eventos e marcas — no jeito em que a LZR gosta de contar uma história.",
  portfolio: [
    { id: 1, number: "01", title: "Hora dourada", category: "Casamentos", year: "2026", imageUrl: photo("1519741497674-611481863552"), alt: "Casal de noivos em um momento íntimo", layout: "feature" },
    { id: 2, number: "02", title: "A celebração", category: "Casamentos", year: "2026", imageUrl: photo("1511285560929-80b456fea0bc"), alt: "Convidados dançando em uma festa de casamento", layout: "wide" },
    { id: 3, number: "03", title: "O vestido", category: "Casamentos", year: "2025", imageUrl: photo("1583939003579-730e3918a45a"), alt: "Noiva em retrato vertical", layout: "tall" },
    { id: 4, number: "04", title: "Alma urbana", category: "Retratos", year: "2026", imageUrl: photo("1531746020798-e6953c6e8e04"), alt: "Retrato de uma mulher com luz natural", layout: "standard" },
    { id: 5, number: "05", title: "Olhar direto", category: "Retratos", year: "2026", imageUrl: photo("1534528741775-53994a69daeb"), alt: "Retrato editorial de uma mulher", layout: "tall" },
    { id: 6, number: "06", title: "Luz suave", category: "Retratos", year: "2025", imageUrl: photo("1524504388940-b1c1722653e1"), alt: "Retrato de moda com fundo claro", layout: "standard" },
    { id: 7, number: "07", title: "Linhas e formas", category: "Editorial", year: "2025", imageUrl: photo("1509631179647-0177331693ae"), alt: "Ensaio de moda com movimento", layout: "wide" },
    { id: 8, number: "08", title: "Amarelo", category: "Editorial", year: "2026", imageUrl: photo("1515886657613-9f3515b0c78f"), alt: "Modelo em casaco amarelo em ensaio de rua", layout: "tall" },
    { id: 9, number: "09", title: "Passarela", category: "Editorial", year: "2025", imageUrl: photo("1469334031218-e382a71b716b"), alt: "Ensaio de moda em ambiente urbano", layout: "wide" },
    { id: 10, number: "10", title: "O encontro", category: "Eventos", year: "2026", imageUrl: photo("1511578314322-379afb476865"), alt: "Plateia em um evento com iluminação de palco", layout: "wide" },
    { id: 11, number: "11", title: "Noite acesa", category: "Eventos", year: "2025", imageUrl: photo("1464366400600-7168b8af9bc3"), alt: "Celebração noturna com luzes", layout: "standard" },
    { id: 12, number: "12", title: "Vitrine", category: "Marcas", year: "2026", imageUrl: photo("1441986300917-64674bd600d8"), alt: "Interior de uma loja preparado para campanha", layout: "wide" },
    { id: 13, number: "13", title: "Objeto", category: "Marcas", year: "2026", imageUrl: photo("1523275335684-37898b6baf30"), alt: "Relógio fotografado como produto", layout: "standard" },
  ],
  about: {
    title: "Um olhar sensível.",
    paragraph1: "Na LZR Fotografia, o ensaio começa com uma conversa e termina numa galeria pronta para guardar, imprimir e publicar. O cotidiano entra no quadro quando a luz, a direção e o tempo estão certos.",
    paragraph2: "Casamentos, retratos, editorial e marcas. Cada trabalho tem um recorte próprio — e a mesma promessa: imagem com presença, não apenas um registro.",
    imageUrl: photo("1452587925148-ce544e77e70d", 1200),
  },
  services: [
    { number: "01", title: "Casamentos", desc: "Do preparo ao último brinde, com direção calma e olhar de cinema.", url: photo("1511285560929-80b456fea0bc", 900) },
    { number: "02", title: "Retratos", desc: "Ensaios que mostram presença, e não apenas uma pose.", url: photo("1531746020798-e6953c6e8e04", 900) },
    { number: "03", title: "Eventos", desc: "Cobertura de encontros, festas e ocasiões que precisam de memória.", url: photo("1464366400600-7168b8af9bc3", 900) },
    { number: "04", title: "Editorial", desc: "Moda e narrativa visual para publicações e campanhas.", url: photo("1509631179647-0177331693ae", 900) },
    { number: "05", title: "Marcas", desc: "Imagens de identidade para quem precisa ser reconhecido.", url: photo("1441986300917-64674bd600d8", 900) },
    { number: "06", title: "Produtos", desc: "Still e campanha para o objeto parecer tão bom quanto é.", url: photo("1523275335684-37898b6baf30", 900) },
  ],
  quotes: [
    { text: "A gente esqueceu das câmeras. As fotos trouxeram de volta exatamente o que sentimos naquele dia.", name: "Marina", context: "Casamento" },
    { text: "O ensaio deu rosto à marca. Essas imagens passaram a abrir todas as apresentações.", name: "Caio", context: "Marca pessoal" },
    { text: "Foi leve. As fotos não parecem posadas — parecem a nossa casa de verdade.", name: "Helena", context: "Retrato de família" },
  ],
  cinematic: {
    text: "Cada imagem conta uma história.",
    imageUrl: photo("1529634597503-139d3726fed5", 2000),
  },
  contact: {
    email: "Em breve",
    phone: "Em breve",
    location: "Com agendamento",
    instagram: "",
  },
}
