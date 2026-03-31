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
      'A visually huge film with a personal core. The science-heavy sections can feel dense, but the father-daughter thread makes the ending land hard.',
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
      'A high-concept blockbuster with precision editing and unforgettable set pieces. The emotional thread keeps the puzzle from feeling cold.',
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
      'Grand world-building and impeccable sound design. Slow-burn pacing works because the atmosphere is so rich.',
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
      'Dense yet riveting. Dialogue-driven intensity and technical craft combine into a modern epic.',
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
      'Moody detective tone finally brought front and center. Gotham feels dangerous and alive.',
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
      'A disturbing character study anchored by a fearless central performance.',
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
      'Masterful shifts in tone with surgical storytelling. Every detail pays off.',
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
      'A foundational crime epic that still feels definitive in craft and character work.',
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
      'Provocative, stylish, and endlessly discussed. A film that rewards rewatching.',
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
      'A fun body-swap comedy with great chemistry between the leads and solid rewatch value.',
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
      'Long but deeply reflective. A meditative close to an era of gangster cinema.',
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
      'A rare sequel that expands the original with astonishing visuals and meditative pacing.',
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
      'A powerful and thought-provoking depiction of a pivotal historical moment. Strong performances and meticulous production design make it a standout.',
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
      'An intense action thriller that delivers high stakes and explosive sequences.',
  },
  {
    id: 'english-vinglish-2012',
    title: 'English Vinglish',
    type: 'Movie',
    year: 2012,
    genre: 'Comedy / Drama',
    rating: 7.2,
    imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTQyNTkyODEwM15BMl5BanBnXkFtZTcwNTI0NzA3OA@@._V1_SX300.jpg',
    ownerReview:
      'A charming and heartwarming film about a woman overcoming language barriers and finding herself.',
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
