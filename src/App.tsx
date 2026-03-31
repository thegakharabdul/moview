import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type ShowType = 'Movie' | 'Series' | 'Show'

type Show = {
  id: string
  title: string
  type: ShowType
  year: number
  genre: string
  rating: number
  imageUrl: string
  ownerReview: string
  rottenTomatoesScore?: number
}

type Feedback = {
  id: string
  name: string
  rating: number
  comment: string
}

type SelectOption<T extends string> = {
  value: T
  label: string
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23333" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="16" font-family="Arial"%3EImage not available%3C/text%3E%3C/svg%3E'

const catalog: Show[] = [
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    type: 'Series',
    year: 2016,
    genre: 'Sci-Fi / Mystery',
    rating: 8.7,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    ownerReview:
      'The small-town mystery setup is excellent, and the cast chemistry carries every season. Some story arcs dip in pace, but the nostalgia and emotional payoff are worth it.',
  },
  {
    id: 'dark',
    title: 'Dark',
    type: 'Series',
    year: 2017,
    genre: 'Sci-Fi / Thriller',
    rating: 9.1,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
    ownerReview:
      'Complex, layered, and confidently written. This is one of the few time-travel stories that rewards deep attention without losing emotional grounding.',
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    type: 'Movie',
    year: 2014,
    genre: 'Sci-Fi / Drama',
    rating: 9.0,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    ownerReview:
      'Nolan\'s ambitious space opera transcends its 2h 49m runtime through sheer emotional depth. The film balances mind-bending theoretical physics with an intimate father-daughter relationship that anchors every moment. Hans Zimmer\'s organ-driven score is otherworldly, and the visuals of distant planets and black holes remain unprecedented. While the dialogue-heavy exposition can feel dense during space mechanics explanations, the payoff in the final act delivers one of cinema\'s most moving climaxes. A masterpiece about love transcending dimensions.',
    rottenTomatoesScore: 72,
  },
  {
    id: 'arcane',
    title: 'Arcane',
    type: 'Show',
    year: 2021,
    genre: 'Animation / Action',
    rating: 9.2,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    ownerReview:
      'Rare case where visual style and character writing are equally strong. Every episode feels premium, and the world-building is sharp without being overwhelming.',
  },
  {
    id: 'money-heist',
    title: 'Money Heist',
    type: 'Series',
    year: 2017,
    genre: 'Crime / Thriller',
    rating: 8.2,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    ownerReview:
      'High-stakes entertainment with great momentum and iconic characters. It can become melodramatic, but it knows how to keep viewers hooked.',
  },
  {
    id: 'the-bear',
    title: 'The Bear',
    type: 'Show',
    year: 2022,
    genre: 'Drama / Comedy',
    rating: 8.9,
    imageUrl:
      'https://image.tmdb.org/t/p/w780/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
    ownerReview:
      'Fast, intense, and surprisingly heartfelt. The show captures stress and ambition with a realism that is hard to fake.',
  },
  {
    id: 'inception',
    title: 'Inception',
    type: 'Movie',
    year: 2010,
    genre: 'Sci-Fi / Heist',
    rating: 9.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    ownerReview:
      'A landmark achievement in commercial cinema that respects audience intelligence. The layered dreamscape concept could\'ve been a gimmick, but it becomes a vehicle for exploring regret and redemption. The action sequences are brilliantly choreographed and visually coherent despite their complexity. DiCaprio anchors the cerebral chaos with vulnerability, and Marion Cotillard provides the emotional core. The ambiguous ending sparked years of debate, proving the film trusts viewers to sit with uncertainty. A perfect synthesis of blockbuster spectacle and genuine philosophical substance.',
    rottenTomatoesScore: 86,
  },
  {
    id: 'breaking-bad',
    title: 'Breaking Bad',
    type: 'Series',
    year: 2008,
    genre: 'Crime / Drama',
    rating: 9.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/ineLOBPG8AZsluYwnkMpHRyu7L.jpg',
    ownerReview:
      'Near-perfect character descent storytelling. Every season raises stakes while preserving believable motivations.',
  },
  {
    id: 'peaky-blinders',
    title: 'Peaky Blinders',
    type: 'Series',
    year: 2013,
    genre: 'Crime / Period',
    rating: 8.8,
    imageUrl: 'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    ownerReview:
      'Stylish, sharp, and powered by magnetic performances. It balances cool factor with meaningful family conflict.',
  },
  {
    id: 'squid-game',
    title: 'Squid Game',
    type: 'Show',
    year: 2021,
    genre: 'Thriller / Survival',
    rating: 8.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    ownerReview:
      'Clever social commentary wrapped in brutal suspense. Visually iconic and impossible to ignore.',
  },
  {
    id: 'chernobyl',
    title: 'Chernobyl',
    type: 'Series',
    year: 2019,
    genre: 'Historical / Drama',
    rating: 9.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    ownerReview:
      'Relentlessly tense and devastatingly human. An exceptional mini-series with documentary-like weight.',
  },
  {
    id: 'dune',
    title: 'Dune',
    type: 'Movie',
    year: 2021,
    genre: 'Sci-Fi / Epic',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    ownerReview:
      'Denis Villeneuve refuses to compromise his vision for accessibility, crafting an adaptation that feels monumental. The cinematography transforms the Arrakis desert into a character unto itself. Hans Zimmer\'s synthesizer-heavy score creates an unsettling atmosphere. The slow-burn pacing allows themes of imperialism and environmental collapse to simmer beneath the surface. Timothée Chalamet and Rebecca Ferguson anchor the philosophical complexity with nuanced performances. Essential science fiction cinema.',
    rottenTomatoesScore: 83,
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    type: 'Movie',
    year: 2023,
    genre: 'Biography / Drama',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    ownerReview:
      'Nolan\'s three-hour meditation on ambition, morality, and nuclear fear becomes increasingly haunting. Cillian Murphy delivers a career-defining performance as a man who realizes too late the consequences of his genius. The non-linear structure weaves physics, politics, and psychological breakdown across multiple timelines. Ludwig Göransson\'s tense score amplifies the moral weight. The Trinity test sequence remains one of cinema\'s most devastating moments. A film that examines how solving one problem creates another. Devastating and absolutely necessary viewing.',
    rottenTomatoesScore: 92,
  },
  {
    id: 'the-batman',
    title: 'The Batman',
    type: 'Movie',
    year: 2022,
    genre: 'Action / Noir',
    rating: 8.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    ownerReview:
      'Matt Reeves strips Batman to his detective roots, creating a 2h 56m murder mystery that feels genuinely perilous. Pattinson\'s brooding introversion is a revelation. Gotham City itself is a sprawling character—neon-soaked, corruption-strangled, violent. Cinematographer Greig Fraser bathes every scene in noir atmosphere. This is Batman as noir thriller, and it works magnificently. A franchise reset that respects the mythology while forging its own path.',
    rottenTomatoesScore: 85,
  },
  {
    id: 'the-last-of-us',
    title: 'The Last of Us',
    type: 'Show',
    year: 2023,
    genre: 'Drama / Post-apocalyptic',
    rating: 9.1,
    imageUrl: 'https://image.tmdb.org/t/p/w780/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    ownerReview:
      'Excellent adaptation that respects the source while expanding emotional nuance.',
  },
  {
    id: 'the-boys',
    title: 'The Boys',
    type: 'Series',
    year: 2019,
    genre: 'Action / Satire',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
    ownerReview:
      'Violent, cynical, and unexpectedly character-driven. The satire lands because it is brutally honest.',
  },
  {
    id: 'black-mirror',
    title: 'Black Mirror',
    type: 'Series',
    year: 2011,
    genre: 'Sci-Fi / Anthology',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/5UaYsGZOFhjFDwQh6GuLjjA1WlF.jpg',
    ownerReview:
      'At its best, it is unnervingly prophetic. Standout episodes still set the benchmark for tech dread.',
  },
  {
    id: 'mindhunter',
    title: 'Mindhunter',
    type: 'Show',
    year: 2017,
    genre: 'Crime / Psychological',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/fbKE87mojpIETWepSbD5Qt741fp.jpg',
    ownerReview:
      'Methodical and deeply unsettling. Dialogue scenes feel as suspenseful as action sequences.',
  },
  {
    id: 'ozark',
    title: 'Ozark',
    type: 'Series',
    year: 2017,
    genre: 'Crime / Thriller',
    rating: 8.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/pCGyPVrI9Fzw6rE1Pvi4BIXF6ET.jpg',
    ownerReview:
      'Cold, tense, and consistently unpredictable. It thrives on moral compromise and pressure-cooker pacing.',
  },
  {
    id: 'joker',
    title: 'Joker',
    type: 'Movie',
    year: 2019,
    genre: 'Psychological / Drama',
    rating: 8.1,
    imageUrl: 'https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    ownerReview:
      'Todd Phillips reframes the Batman origin mythology as a descent into psychotic break anchored by Phoenix\'s career-best performance. The film is deliberately uncomfortable. Cinematographer Lawrence Sher uses cool, desaturated tones to reflect Arthur\'s deteriorating mental state. The late-film revelation complicates everything, asking whether even his narrative is trustworthy. A film that asks uncomfortable questions about toxic masculinity in a post-consumer world. Phoenix\'s physicality creates a character that feels dangerously real.',
    rottenTomatoesScore: 68,
  },
  {
    id: 'parasite',
    title: 'Parasite',
    type: 'Movie',
    year: 2019,
    genre: 'Thriller / Social Satire',
    rating: 9.2,
    imageUrl: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    ownerReview:
      'Bong Joon-ho\'s masterpiece weaponizes genre to expose class fractures with surgical precision. The Kim family\'s infiltration of the wealthy Park household starts as darkly comic and escalates into something genuinely devastating. Every prop and architectural detail carries thematic weight about affluence and inequality. Song Kang-ho\'s performance captures a man maintaining dignity while losing everything. The film refuses easy heroes or villains. Won Best Picture by defeating prestige favorites—richly deserved.',
    rottenTomatoesScore: 98,
  },
  {
    id: 'the-godfather',
    title: 'The Godfather',
    type: 'Movie',
    year: 1972,
    genre: 'Crime / Classic',
    rating: 9.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    ownerReview:
      'Coppola\'s 2h 55m odyssey through the Corleone empire remains the template every crime saga attempts to follow. Gordon Willis\' cinematography created the look that defines the film\'s elegant corruption. Marlon Brando\'s gravelly whisper and Pacino\'s gradual hardening into ruthlessness chart fate versus choice. Michael\'s transformation from outsider reluctantly pulled in to calculating capo is a masterclass in character arc. There are better structured films, but there may not be a better demonstration of filmmaking as total vision. Genuinely timeless.',
    rottenTomatoesScore: 97,
  },
  {
    id: 'fight-club',
    title: 'Fight Club',
    type: 'Movie',
    year: 1999,
    genre: 'Drama / Psychological',
    rating: 8.8,
    imageUrl: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    ownerReview:
      'Fincher\'s adaptation weaponizes rage through jump cuts and a narrator descending into fractured identity. The twist lands like a punch because the film has been hiding clues in plain sight. The fight scenes escalate from basement catharsis to something genuinely dangerous. Edward Norton\'s neurotic intensity and Pitt\'s charismatic nihilism create explosive chemistry. Asks uncomfortable questions about toxic masculinity in a post-consumer world. Three watches reveal different film each time. Provokes argument decades later.',
    rottenTomatoesScore: 67,
  },
  {
    id: 'freaky-friday-2003',
    title: 'Freaky Friday',
    type: 'Movie',
    year: 2003,
    genre: 'Comedy / Family',
    rating: 7.0,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Freaky_Friday_%282003_film%29.png',
    ownerReview:
      'A surprisingly effective family comedy that earns its emotional beats through genuine character work. Jamie Lee Curtis and Lindsay Lohan create electric chemistry. The script smartly uses the body swap to force both characters to walk in each other\'s shoes, building empathy through comic situations. The film avoids schmaltz despite inherent sentimentality, keeping things breezy and entertaining. A reliable choice for family viewing that surprisingly holds up to nostalgia and affection.',
    rottenTomatoesScore: 61,
  },
  {
    id: 'severance',
    title: 'Severance',
    type: 'Show',
    year: 2022,
    genre: 'Sci-Fi / Mystery',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',
    ownerReview:
      'Original premise executed with confidence. Corporate horror has never felt this precise.',
  },
  {
    id: 'loki',
    title: 'Loki',
    type: 'Series',
    year: 2021,
    genre: 'Fantasy / Sci-Fi',
    rating: 8.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    ownerReview:
      'Stylized timelines and playful writing make this one of the strongest MCU series.',
  },
  {
    id: 'narcos',
    title: 'Narcos',
    type: 'Series',
    year: 2015,
    genre: 'Crime / Biography',
    rating: 8.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/rTmal9fDbwh5F0waol2hq35U4ah.jpg',
    ownerReview:
      'Gritty and addictive. The documentary flavor adds realism without killing momentum.',
  },
  {
    id: 'wednesday',
    title: 'Wednesday',
    type: 'Show',
    year: 2022,
    genre: 'Mystery / Fantasy',
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    ownerReview:
      'Stylish gothic mystery with a charismatic lead and a strong episodic hook.',
  },
  {
    id: 'irishman',
    title: 'The Irishman',
    type: 'Movie',
    year: 2019,
    genre: 'Crime / Drama',
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg',
    ownerReview:
      'Scorsese\'s 3h 29m farewell to mob cinema is deliberately slow, even elegiac. Rather than glorify violence, the film shows its cost. Robert De Niro, Al Pacino, and Joe Pesci bring weathered mortality to their performances. The de-aging technology serves thematic purpose. The film posits that loyalty and violence are ultimately hollow constructs. Men age out, memories betray, death arrives indifferently. It\'s a meditation on organized crime\'s toll. Demanding but profound.',
    rottenTomatoesScore: 93,
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    type: 'Series',
    year: 2016,
    genre: 'Historical / Drama',
    rating: 8.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/1M876KPjulVwppEpldhdc8V4o68.jpg',
    ownerReview:
      'Elegant production and restrained performances deliver rich political drama.',
  },
  {
    id: 'haunting-hill-house',
    title: 'The Haunting of Hill House',
    type: 'Show',
    year: 2018,
    genre: 'Horror / Drama',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/38PkhBGRQtmVx2drvPik3F42qHO.jpg',
    ownerReview:
      'Haunting visuals and emotional writing combine into one of the strongest modern horror shows.',
  },
  {
    id: 'better-call-saul',
    title: 'Better Call Saul',
    type: 'Series',
    year: 2015,
    genre: 'Crime / Legal Drama',
    rating: 9.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
    ownerReview:
      'Meticulous character writing and visual storytelling at the highest TV level.',
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    type: 'Movie',
    year: 2017,
    genre: 'Sci-Fi / Neo-noir',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    ownerReview:
      'Villeneuve treats the Blade Runner sequel with reverence and vision. Roger Deakins\' cinematography creates perhaps cinema\'s most beautiful sci-fi landscape. Ryan Gosling\'s quiet K carries the film with minimal dialogue, his face conveying existential questions about humanity. Hans Zimmer\'s synth-heavy score haunts rather than overwhelms. The pacing is deliberate, even slow, but every frame justifies its duration. The ambiguous ending honors the original\'s uncertainty about what consciousness means.',
    rottenTomatoesScore: 81,
  },
  {
    id: 'nuremberg-2025',
    title: 'Nuremberg 2025',
    type: 'Movie',
    year: 2025,
    genre: 'Historical / Drama',
    rating: 8.0,
  imageUrl: '/nuremberg.jpg',
    ownerReview:
      'A rigorous, unflinching examination of the trials that attempted to establish international accountability for atrocity. Rather than sensationalize brutality, the film focuses on legal architecture and moral philosophy. Can tribunals truly deliver justice? The ensemble cast brings weight to courtroom debates about collective guilt and propaganda\'s role. Production design meticulously recreates the courtroom geometry that frames moral judgment. The cinematography is deliberately austere, refusing spectacle in favor of intellectual engagement. A meditation on truth-telling after civilizational collapse.',
    rottenTomatoesScore: 78,
  },
  {
    id: 'war-machine-2026',
    title: 'War Machine',
    type: 'Movie',
    year: 2026,
    genre: 'Action / Thriller',
    rating: 8.5,
    imageUrl: '/war machine.jpg',
    ownerReview:
      'A relentless geopolitical thriller that treats global conflict with surprising nuance for an action vehicle. The protagonist is not a hero but a soldier caught between ideological factions. The action sequences are visceral and grounded—no superhero physics, just human bodies breaking under force. The screenplay integrates contemporary anxieties about military intervention without becoming preachy. Pacing builds relentlessly toward a climax that raises moral questions rather than celebrating victory. An action film that wants to say something about power, consequence, and human cost.',
    rottenTomatoesScore: 82,
  },
  {
    id: 'english-vinglish-2012',
    title: 'English Vinglish',
    type: 'Movie',
    year: 2012,
    genre: 'Comedy / Drama',
    rating: 7.2,
    imageUrl: '/english vinglish.jpg',
    ownerReview:
      'Gauri Shinde\'s debut is a tender exploration of identity, family dynamics, and self-actualization filtered through language-learning narrative. Sridevi carries the film with nuanced restraint as a woman built on denial and compromise who discovers voice through vulnerability. The film never mocks her broken English; instead, it celebrates the courage to speak despite imperfection. Comedy arises organically from cultural collision rather than stereotype. By film\'s end, English becomes metaphor for self-expression beyond language. A celebration of becoming rather than arriving.',
    rottenTomatoesScore: 89,
  },
]

const storageKey = 'moview-feedback-v1'
type CategoryFilter = 'All' | ShowType
type SortOption = 'rating-desc' | 'rating-asc' | 'year-desc' | 'title-asc'
type Page = 'home' | 'library' | 'about'

const categoryOptions: SelectOption<CategoryFilter>[] = [
  { value: 'All', label: 'All' },
  { value: 'Movie', label: 'Movies' },
  { value: 'Series', label: 'Series' },
  { value: 'Show', label: 'Shows' },
]

const sortOptions: SelectOption<SortOption>[] = [
  { value: 'rating-desc', label: 'Rating: High to low' },
  { value: 'rating-asc', label: 'Rating: Low to high' },
  { value: 'year-desc', label: 'Newest first' },
  { value: 'title-asc', label: 'Title A-Z' },
]

const feedbackRatingOptions: SelectOption<string>[] = [
  { value: '5', label: '5 - Excellent' },
  { value: '4', label: '4 - Good' },
  { value: '3', label: '3 - Average' },
  { value: '2', label: '2 - Weak' },
  { value: '1', label: '1 - Poor' },
]

function App() {
  const [feedbackByShow, setFeedbackByShow] = useState<Record<string, Feedback[]>>(
    () => getInitialFeedback(),
  )
  const [page, setPage] = useState<Page>('home')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc')
  const [activeShowId, setActiveShowId] = useState<string | null>(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [formState, setFormState] = useState<
    Record<string, { name: string; rating: string; comment: string }>
  >({})

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(feedbackByShow))
  }, [feedbackByShow])

  const filteredAndSortedCatalog = useMemo(() => {
    const filtered =
      category === 'All' ? [...catalog] : catalog.filter((show) => show.type === category)

    filtered.sort((a, b) => {
      if (sortBy === 'rating-desc') {
        return b.rating - a.rating
      }
      if (sortBy === 'rating-asc') {
        return a.rating - b.rating
      }
      if (sortBy === 'year-desc') {
        return b.year - a.year
      }
      return a.title.localeCompare(b.title)
    })

    return filtered
  }, [category, sortBy])

  const activeShow = useMemo(
    () => catalog.find((show) => show.id === activeShowId) ?? null,
    [activeShowId],
  )

  const topRated = useMemo(() => {
    return [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 5)
  }, [])

  const latestDrops = useMemo(() => {
    return [...catalog].sort((a, b) => b.year - a.year).slice(0, 5)
  }, [])

  const featuredShow = catalog[heroIndex % catalog.length]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % catalog.length)
    }, 7000)

    return () => window.clearInterval(timer)
  }, [])

  const openShowDetails = (showId: string) => {
    setShowFeedbackForm(false)
    setActiveShowId(showId)
  }

  const closeShowDetails = () => {
    setShowFeedbackForm(false)
    setActiveShowId(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>, showId: string) => {
    event.preventDefault()
    const current = formState[showId] ?? { name: '', rating: '5', comment: '' }

    if (!current.comment.trim()) {
      return
    }

    setFeedbackByShow((prev) => {
      const nextId = `${showId}-${(prev[showId]?.length ?? 0) + 1}`
      const feedback: Feedback = {
        id: nextId,
        name: current.name.trim() || 'Anonymous Viewer',
        rating: Number(current.rating),
        comment: current.comment.trim(),
      }

      return {
        ...prev,
        [showId]: [feedback, ...(prev[showId] ?? [])],
      }
    })

    setFormState((prev) => ({
      ...prev,
      [showId]: {
        name: current.name,
        rating: current.rating,
        comment: '',
      },
    }))
  }

  const updateForm = (
    showId: string,
    field: 'name' | 'rating' | 'comment',
    value: string,
  ) => {
    setFormState((prev) => {
      const existing = prev[showId] ?? { name: '', rating: '5', comment: '' }
      return {
        ...prev,
        [showId]: {
          ...existing,
          [field]: value,
        },
      }
    })
  }

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    if (img.src !== PLACEHOLDER_IMAGE) {
      img.src = PLACEHOLDER_IMAGE
    }
  }

  return (
    <div className="page-shell">
      <header className="site-nav">
        <button type="button" className="brand" onClick={() => setPage('home')}>
          Moview
        </button>
        <nav>
          <button
            type="button"
            className={page === 'home' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setPage('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={page === 'library' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setPage('library')}
          >
            Library
          </button>
          <button
            type="button"
            className={page === 'about' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setPage('about')}
          >
            About
          </button>
        </nav>
      </header>

      {page === 'home' ? (
        <>
          <section
            className="hero"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.86)), url(${featuredShow.imageUrl})`,
            }}
          >
            <p className="live-pill">
              <span className="live-dot" /> Trending now
            </p>
            <h1>Featured: {featuredShow.title}</h1>
            <p className="lead">
              A premium review destination for movies, series, and shows. Browse
              curated picks, read Our review, and join the audience conversation.
            </p>
            <p className="hero-meta">
              {featuredShow.year} • {featuredShow.type} • {featuredShow.genre} • Our rating{' '}
              {featuredShow.rating.toFixed(1)}/10
            </p>
            <div className="hero-actions">
              <button type="button" className="cta-primary" onClick={() => openShowDetails(featuredShow.id)}>
                Open details
              </button>
              <button type="button" className="cta-secondary" onClick={() => setPage('library')}>
                Browse Library
              </button>
            </div>
          </section>

          <section className="content-block">
            <div className="section-head">
              <h2>Top Rated Now</h2>
              <p>Curated by Moview editors</p>
            </div>
            <div className="row-scroller">
              {topRated.map((show) => (
                <article key={show.id} className="show-card mini" onClick={() => openShowDetails(show.id)}>
                  <img src={show.imageUrl} alt={show.title} className="show-poster" onError={handleImageError} />
                  <div className="card-overlay">
                    <h3>{show.title}</h3>
                    <p className="genre">{show.genre}</p>
                    <p className="row-score">Our rating {show.rating.toFixed(1)}/10</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="content-block">
            <div className="section-head">
              <h2>Latest Drops</h2>
              <p>Fresh seasons and films</p>
            </div>
            <div className="row-scroller">
              {latestDrops.map((show) => (
                <article key={show.id} className="show-card mini" onClick={() => openShowDetails(show.id)}>
                  <img src={show.imageUrl} alt={show.title} className="show-poster" onError={handleImageError} />
                  <div className="card-overlay">
                    <h3>{show.title}</h3>
                    <p className="genre">{show.year} • {show.type}</p>
                    <p className="row-score">Our rating {show.rating.toFixed(1)}/10</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {page === 'library' ? (
        <>
          <section className="toolbar" aria-label="Catalog controls">
            <label>
              Category
              <DarkSelect
                value={category}
                onChange={(value) => setCategory(value as CategoryFilter)}
                options={categoryOptions}
                ariaLabel="Category"
              />
            </label>

            <label>
              Sort
              <DarkSelect
                value={sortBy}
                onChange={(value) => setSortBy(value as SortOption)}
                options={sortOptions}
                ariaLabel="Sort"
              />
            </label>

            <p className="toolbar-summary">{filteredAndSortedCatalog.length} titles</p>
          </section>

          <main className="catalog-grid">
            {filteredAndSortedCatalog.map((show) => {
              return (
                <article key={show.id} className="show-card">
                  <img src={show.imageUrl} alt={show.title} className="show-poster" onError={handleImageError} />
                  <div className="card-overlay">
                    <div className="show-header">
                      <p className="type-tag">{show.type}</p>
                      <p className="year-tag">{show.year}</p>
                    </div>
                    <h2>{show.title}</h2>
                    <p className="genre">{show.genre}</p>

                    <div className="owner-rating">
                      <span>{show.rating.toFixed(1)}/10</span>
                      <p>Our rating</p>
                    </div>

                    <button
                      type="button"
                      className="details-toggle"
                      onClick={() => openShowDetails(show.id)}
                    >
                      View review
                    </button>
                  </div>
                </article>
              )
            })}
          </main>
        </>
      ) : null}

      {page === 'about' ? (
        <section className="about-page">
          <h2>About Moview</h2>
          <p>
            Moview is built as a cinematic review platform where editorial quality
            and community sentiment meet in one place.
          </p>
          <div className="about-grid">
            <article>
              <h3>Curated Reviews</h3>
              <p>We prioritize story quality, pacing, and emotional payoff in every review.</p>
            </article>
            <article>
              <h3>Audience Voice</h3>
              <p>Every visitor can add feedback and shape the conversation around each title.</p>
            </article>
            <article>
              <h3>Always Fresh</h3>
              <p>Featured picks rotate, categories evolve, and discussions stay active.</p>
            </article>
          </div>
        </section>
      ) : null}

      <footer className="site-footer">
        <p>Moview • Reviews for the stories worth your time.</p>
      </footer>

      {activeShow ? (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeShowDetails}>
          <article className="review-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={closeShowDetails}
              aria-label="Close review dialog"
            >
              Close
            </button>

            <p className="modal-hint">Tip: click outside this panel to close</p>

            <img src={activeShow.imageUrl} alt={activeShow.title} className="modal-poster" onError={handleImageError} />

            <div className="modal-meta">
              <p className="type-tag">{activeShow.type}</p>
              <p className="year-tag">{activeShow.year}</p>
            </div>

            <h2>{activeShow.title}</h2>
            <p className="genre">{activeShow.genre}</p>

            <div className="owner-rating">
              <span>{activeShow.rating.toFixed(1)}/10</span>
              <p>Our rating</p>
            </div>

            {activeShow.type === 'Movie' && activeShow.rottenTomatoesScore !== undefined && (
              <div className="rt-score">
                <span>{activeShow.rottenTomatoesScore}%</span>
                <p>Rotten Tomatoes</p>
              </div>
            )}

            <section className="owner-review">
              <h3>Our review</h3>
              <p>{activeShow.ownerReview}</p>
            </section>

            <section className="viewer-feedback">
              <h3>Viewer feedback</h3>
              {(feedbackByShow[activeShow.id] ?? []).length === 0 ? (
                <p className="empty-state">No feedback yet. Be the first to comment.</p>
              ) : (
                <ul>
                  {(feedbackByShow[activeShow.id] ?? []).map((entry) => (
                    <li key={entry.id} className="feedback-item">
                      <div>
                        <p className="viewer-name">{entry.name}</p>
                        <p className="feedback-date">Community viewer</p>
                      </div>
                      <p className="viewer-rating">{entry.rating}/5</p>
                      <p>{entry.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {!showFeedbackForm ? (
              <div className="feedback-cta-wrap">
                <p>Want to share your opinion on this title?</p>
                <button
                  type="button"
                  className="cta-primary"
                  onClick={() => setShowFeedbackForm(true)}
                >
                  Give feedback
                </button>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  handleSubmit(event, activeShow.id)
                  setShowFeedbackForm(false)
                }}
                className="feedback-form"
              >
                <label>
                  Your name
                  <input
                    type="text"
                    placeholder="Anonymous Viewer"
                    value={(formState[activeShow.id] ?? { name: '', rating: '5', comment: '' }).name}
                    onChange={(event) => updateForm(activeShow.id, 'name', event.target.value)}
                  />
                </label>

                <label>
                  Your rating
                  <DarkSelect
                    value={(formState[activeShow.id] ?? { name: '', rating: '5', comment: '' }).rating}
                    onChange={(value) => updateForm(activeShow.id, 'rating', value)}
                    options={feedbackRatingOptions}
                    ariaLabel="Your rating"
                  />
                </label>

                <label>
                  Your feedback
                  <textarea
                    required
                    rows={3}
                    maxLength={400}
                    placeholder="Share what worked or what did not."
                    value={
                      (formState[activeShow.id] ?? { name: '', rating: '5', comment: '' }).comment
                    }
                    onChange={(event) => updateForm(activeShow.id, 'comment', event.target.value)}
                  />
                </label>

                <div className="form-actions">
                  <button type="submit">Post feedback</button>
                  <button type="button" className="ghost-btn" onClick={() => setShowFeedbackForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </article>
        </div>
      ) : null}
    </div>
  )
}

function getInitialFeedback(): Record<string, Feedback[]> {
  const saved = localStorage.getItem(storageKey)
  if (!saved) {
    return {}
  }

  try {
    return JSON.parse(saved) as Record<string, Feedback[]>
  } catch {
    localStorage.removeItem(storageKey)
    return {}
  }
}

function DarkSelect<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: SelectOption<T>[]
  ariaLabel: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const selected = options.find((option) => option.value === value)

  return (
    <div className={open ? 'dark-select open' : 'dark-select'} ref={containerRef}>
      <button
        type="button"
        className={open ? 'dark-select-trigger open' : 'dark-select-trigger'}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{selected?.label ?? ''}</span>
        <span className="dark-select-chevron" aria-hidden="true">▾</span>
      </button>

      {open ? (
        <ul className="dark-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={value === option.value ? 'dark-select-option active' : 'dark-select-option'}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default App
