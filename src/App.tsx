import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type ShowType = 'Movie' | 'Series' | 'Show'
type Region = 'Hollywood' | 'Bollywood' | 'Lollywood'

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
  region: Region
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

const LOCAL_FALLBACK_POSTER = '/poster-fallback.svg'

function resolveImageUrl(show: Show): string {
  if (show.imageUrl.startsWith('/')) {
    return show.imageUrl
  }

  if (show.region === 'Bollywood' || show.region === 'Lollywood') {
    return LOCAL_FALLBACK_POSTER
  }

  return show.imageUrl
}

const catalog: Show[] = [
  // ========== HOLLYWOOD ==========
  // 2020s
  {
    id: 'war-machine-2026',
    title: 'War Machine',
    type: 'Movie',
    year: 2026,
    genre: 'Action / Thriller',
    rating: 8.5,
    imageUrl: '/war machine.jpg',
    region: 'Hollywood',
    ownerReview:
      'A relentless geopolitical thriller that treats global conflict with surprising nuance for an action vehicle. The protagonist is not a hero but a soldier caught between ideological factions. The action sequences are visceral and grounded—no superhero physics, just human bodies breaking under force. The screenplay integrates contemporary anxieties about military intervention without becoming preachy. Pacing builds relentlessly toward a climax that raises moral questions rather than celebrating victory. An action film that wants to say something about power, consequence, and human cost.',
    rottenTomatoesScore: 82,
  },
  {
    id: 'nuremberg-2025',
    title: 'Nuremberg 2025',
    type: 'Movie',
    year: 2025,
    genre: 'Historical / Drama',
    rating: 8.0,
    imageUrl: '/nuremberg.jpg',
    region: 'Hollywood',
    ownerReview:
      'A rigorous, unflinching examination of the trials that attempted to establish international accountability for atrocity. Rather than sensationalize brutality, the film focuses on legal architecture and moral philosophy. Can tribunals truly deliver justice? The ensemble cast brings weight to courtroom debates about collective guilt and propaganda\'s role. Production design meticulously recreates the courtroom geometry that frames moral judgment. The cinematography is deliberately austere, refusing spectacle in favor of intellectual engagement. A meditation on truth-telling after civilizational collapse.',
    rottenTomatoesScore: 78,
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    type: 'Movie',
    year: 2023,
    genre: 'Biography / Drama',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/ptpr0kGAckfQkJeJIt8st5dglvd.jpg',
    region: 'Hollywood',
    ownerReview:
      'Nolan\'s three-hour meditation on ambition, morality, and nuclear fear becomes increasingly haunting. Cillian Murphy delivers a career-defining performance as a man who realizes too late the consequences of his genius. The non-linear structure weaves physics, politics, and psychological breakdown across multiple timelines. Ludwig Göransson\'s tense score amplifies the moral weight. The Trinity test sequence remains one of cinema\'s most devastating moments. A film that examines how solving one problem creates another. Devastating and absolutely necessary viewing.',
    rottenTomatoesScore: 92,
  },
  {
    id: 'the-last-of-us',
    title: 'The Last of Us',
    type: 'Show',
    year: 2023,
    genre: 'Drama / Post-apocalyptic',
    rating: 9.1,
    imageUrl: 'https://image.tmdb.org/t/p/w780/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    region: 'Hollywood',
    ownerReview:
      'Craig Mazin adapted Naughty Dog\'s acclaimed game by amplifying character psychology over spectacle and action. Pedro Pascal\'s Joel—a smuggler hardened by apocalypse—is partnered with Ellie, a girl immune to the fungal plague. Their relationship becomes the show\'s emotional core, building slowly from transaction to genuine care. The series excels in episodic storytelling, with individual episodes exploring side characters and expanding the world\'s history. Episode 3\'s Texas story rivals greatest television moments for emotional devastation. The production design depicts nature reclaiming civilization without romance—brutality beneath beauty. Violence carries weight rather than spectacle. Gabriel Luna\'s Tommy and Anna Torv\'s Maria provide complex family dynamics. The series argues that survival means nothing without connection. A television adaptation that honors its source while transcending it through intimate character work.',
  },
  {
    id: 'the-batman',
    title: 'The Batman',
    type: 'Movie',
    year: 2022,
    genre: 'Action / Noir',
    rating: 8.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    region: 'Hollywood',
    ownerReview:
      'Matt Reeves strips Batman to his detective roots, creating a 2h 56m murder mystery that feels genuinely perilous. Pattinson\'s brooding introversion is a revelation. Gotham City itself is a sprawling character—neon-soaked, corruption-strangled, violent. Cinematographer Greig Fraser bathes every scene in noir atmosphere. This is Batman as noir thriller, and it works magnificently. A franchise reset that respects the mythology while forging its own path.',
    rottenTomatoesScore: 85,
  },
  {
    id: 'severance',
    title: 'Severance',
    type: 'Show',
    year: 2022,
    genre: 'Sci-Fi / Mystery',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/7WTsnHkbA0FaG6R9twfFde0I9hl.jpg',
    region: 'Hollywood',
    ownerReview:
      'Dan Erickson created a sci-fi premise that becomes perfect corporate horror—workers surgically severed so their work consciousness and personal consciousness never meet. Employees arrive at sterile offices with no memories of personal lives; outside workers live unaware of work identities. Adam Scott\'s Mark Scout navigates the uncanny disconnect between severed selves. The series examines labor, identity, and consent with philosophical precision. Production design contrasts brutalist workplace architecture with intimate personal spaces, reinforcing existential splitting. The mystery deepens across episodes as workers discover their severing hides exploitation. Each episode escalates questions about autonomy and corporate control. The cinematography is meticulous, with cold lighting inside the workplace growing warmer as Mark\'s personal life expands. A original premise executed with thematic precision.',
  },
  {
    id: 'wednesday',
    title: 'Wednesday',
    type: 'Show',
    year: 2022,
    genre: 'Mystery / Fantasy',
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
    region: 'Hollywood',
    ownerReview:
      'Tim Burton directed the pilot for a Addams Family spinoff centered on Wednesday\'s Nevermore Academy years. Jenna Ortega\'s Wednesday is sardonic, formidable, and beautifully performed—a protagonist motivated by investigation rather than typical teenage concerns. The mystery unfolds methodically: a serial killer murdering outcasts in the mining town parallels Wednesday\'s investigation of family secrets. Burton\'s signature aesthetic—goth gothic, whimsy masking darkness—permeates production design. The ensemble supports without overshadowing; Gwendoline Christie\'s principal Larissa Weems carries parental complexity. The romance subplot feels earned rather than obligatory. The series balances standalone episodic investigations with serial mythology. While some plot threads feel convenient, the character work and stylistic consistency carry momentum. A breakout hit that modernized source mythology successfully.',
  },
  {
    id: 'the-bear',
    title: 'The Bear',
    type: 'Show',
    year: 2022,
    genre: 'Drama / Comedy',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
    region: 'Hollywood',
    ownerReview:
      'Christopher Storer created a kitchen-set drama that transforms restaurant work into existential struggle. Jeremy Allen White\'s Carmen Carmen\'s return to Chicago to salvage his family\'s failing sandwich shop becomes a proxy for inherited trauma and redemption. The show understands kitchen dynamics—intensity, respect, failure—through camera work that mirrors stress-cam scenes from fine dining documentaries. Every character wants something different, creating organic conflict. Ebon Moss-Bachrach\'s Richie steals scenes with wounded pride and surprising depth. The series balances absurdist comedy with devastating character moments. By season end, the restaurant renovations become metaphor for internal transformation. A show about ambitious people failing spectacularly while maintaining dignity. Thrilling and deeply human.',
  },
  {
    id: 'loki',
    title: 'Loki',
    type: 'Series',
    year: 2021,
    genre: 'Fantasy / Sci-Fi',
    rating: 8.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    region: 'Hollywood',
    ownerReview:
      'Michael Waldron crafted the MCU\'s most stylistically confident limited series, retrofitting the trickster god into temporal bureaucracy. Tom Hiddleston\'s Loki evolves from chaotic villain into person grappling with variant selves and nexus timelines. The series embraces high-concept sci-fi philosophy—free will versus predetermined fate—without losing playful tone. Owen Wilson\'s Mobius balances gravitas with humor. Sophia Di Martino\'s Sylvie provides Loki\'s moral mirror. The production design oscillates between retro-futuristic and timeless minimalism. The series excels at blending MCU spectacle with intimate character work, particularly Loki\'s evolution from self-serving narcissist toward genuine connection. The climax recontextualizes the entire MCU. Where other MCU shows stumble with pacing, Loki maintains momentum while exploring identity and choice across variants. Stylish, smart, emotionally resonant.',
  },
  {
    id: 'arcane',
    title: 'Arcane',
    type: 'Show',
    year: 2021,
    genre: 'Animation / Action',
    rating: 9.2,
    imageUrl: 'https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    region: 'Hollywood',
    ownerReview:
      'Christian Linke and Alex Yee created an animated series that proves the medium can match live-action cinema in emotional complexity and thematic depth. The story of childhood friendship fractured by class conflict and magical ambition becomes a meditation on power and legacy. The animation style—fluid character animation paired with detailed comic-book backgrounds—creates visual poetry. Each act escalates with confidence, introducing new characters and thematic complexity without losing emotional core. The soundtrack by Imagine Dragons and Sting amplifies character arcs. By series end, every character feels trapped by systems larger than themselves. A rare animated series aimed at adults that achieves profound storytelling. Visually stunning and narratively perfect.',
  },
  {
    id: 'dune',
    title: 'Dune',
    type: 'Movie',
    year: 2021,
    genre: 'Sci-Fi / Epic',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    region: 'Hollywood',
    ownerReview:
      'Denis Villeneuve refuses to compromise his vision for accessibility, crafting an adaptation that feels monumental. The cinematography transforms the Arrakis desert into a character unto itself. Hans Zimmer\'s synthesizer-heavy score creates an unsettling atmosphere. The slow-burn pacing allows themes of imperialism and environmental collapse to simmer beneath the surface. Timothée Chalamet and Rebecca Ferguson anchor the philosophical complexity with nuanced performances. Essential science fiction cinema.',
    rottenTomatoesScore: 83,
  },
  {
    id: 'squid-game',
    title: 'Squid Game',
    type: 'Show',
    year: 2021,
    genre: 'Thriller / Survival',
    rating: 8.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
    region: 'Hollywood',
    ownerReview:
      'Hwang Dong-hyuk created a phenomenon by weaponizing childhood games into metaphor for economic desperation. Hundreds of debt-burdened people compete in familiar games—red light green light, marbles, glass bridge—knowing elimination means death. The genius is using deceptively simple mechanics to explore trust, betrayal, and class hierarchy. Lee Jung-jae\'s Seong Gi-hun carries the series through moral compromise and traumatic choice. The production design contrasts pastel-colored game arenas with brutal human consequences. Each game escalates stakes while revealing character. The series doesn\'t shy from depicting death—it becomes almost mundane, which is exactly the point. A meditation on how capitalism transforms humans into commodities. Visceral, socially conscious entertainment.',
  },
  {
    id: 'chernobyl',
    title: 'Chernobyl',
    type: 'Series',
    year: 2019,
    genre: 'Historical / Drama',
    rating: 9.3,
    imageUrl: 'https://image.tmdb.org/t/p/w780/hlLXt2tOPT6RRnjiUmoxyG1LTFi.jpg',
    region: 'Hollywood',
    ownerReview:
      'Craig Mazin created a five-episode miniseries that transcends historical recounting to become tragedy about systemic corruption and human courage. The 1986 nuclear disaster becomes lens through which to examine Soviet bureaucracy, denial, and the price of truth. Jared Harris\'s Valery Legasov embodies the scientist forced to navigate political lies while racing against apocalypse. Stellan Skarsgård\'s Boris Shcherbina represents the regime attempting damage control. The production design recreates Pripyat with haunting authenticity. Every act builds toward increasingly devastating human cost. The series doesn\'t sensationalize; instead, it documents quiet horror—men liquidating reactors, families evacuated, futures erased. The final episode cements thematic weight through courtroom testimony about truth versus official narrative. A masterpiece of historical drama that feels urgently contemporary.',
  },
  {
    id: 'joker',
    title: 'Joker',
    type: 'Movie',
    year: 2019,
    genre: 'Psychological / Drama',
    rating: 8.1,
    imageUrl: 'https://image.tmdb.org/t/p/w780/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    region: 'Hollywood',
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
    region: 'Hollywood',
    ownerReview:
      'Bong Joon-ho\'s masterpiece weaponizes genre to expose class fractures with surgical precision. The Kim family\'s infiltration of the wealthy Park household starts as darkly comic and escalates into something genuinely devastating. Every prop and architectural detail carries thematic weight about affluence and inequality. Song Kang-ho\'s performance captures a man maintaining dignity while losing everything. The film refuses easy heroes or villains. Won Best Picture by defeating prestige favorites—richly deserved.',
    rottenTomatoesScore: 98,
  },
  {
    id: 'the-boys',
    title: 'The Boys',
    type: 'Series',
    year: 2019,
    genre: 'Action / Satire',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg',
    region: 'Hollywood',
    ownerReview:
      'Eric Kripke created a superhero satire that uses graphic violence to critique corporate fascism and unchecked power. Superheroes aren\'t idealistic symbols but commodified celebrities—products marketed by ruthless corporations. Antony Starr\'s Homelander embodies corporate sociopathy, a charming psychopath whose violence escalates across seasons. Karl Urban\'s Billy Butcher hunts superheroes with vendetta-driven obsession. The ensemble balances satire with genuine character stakes. Violence is intentionally grotesque—not thrilling but nauseating, reinforcing that power without accountability creates horror. The series deconstructs superhero mythology by asking uncomfortable questions about accountability and propaganda. Satire sharpens with each season as real-world politics increasingly mirrors the show\'s fiction. Crude, cynical, and wickedly smart.',
  },
  {
    id: 'irishman',
    title: 'The Irishman',
    type: 'Movie',
    year: 2019,
    genre: 'Crime / Drama',
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/mbm8k3GFhXS0ROd9AD1gqYbIFbM.jpg',
    region: 'Hollywood',
    ownerReview:
      'Scorsese\'s 3h 29m farewell to mob cinema is deliberately slow, even elegiac. Rather than glorify violence, the film shows its cost. Robert De Niro, Al Pacino, and Joe Pesci bring weathered mortality to their performances. The de-aging technology serves thematic purpose. The film posits that loyalty and violence are ultimately hollow constructs. Men age out, memories betray, death arrives indifferently. It\'s a meditation on organized crime\'s toll. Demanding but profound.',
    rottenTomatoesScore: 93,
  },
  {
    id: 'black-mirror',
    title: 'Black Mirror',
    type: 'Series',
    year: 2011,
    genre: 'Sci-Fi / Anthology',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/5UaYsGZOFhjFDwQh6GuLjjA1WlF.jpg',
    region: 'Hollywood',
    ownerReview:
      'Charlie Brooker created an anthology series that functions as sociological horror—near-future technology amplifying existing human flaws into dystopia. Each episode explores how tools intended to improve life become instruments of control or humiliation. The first season\'s "White Christmas" examines consciousness as commodity. "San Junipero" becomes transcendent romance despite its digital premise. "Nosedive" depicts social credit systems predating their real-world implementation. The genius is grounding sci-fi speculation in immediately recognizable human psychology and social dynamics. Best episodes blur line between entertainment and genuine dread. "Nosedive" depicts social credit systems predating their real-world implementation. The genius is grounding sci-fi speculation in immediately recognizable human psychology and social dynamics. Best episodes blur line between entertainment and genuine dread. Later seasons lose sharpness, relying on twist endings rather than thematic depth, but earlier work remains unnervingly prophetic. A show that understood technology before technology understood itself.',
  },
  {
    id: 'narcos',
    title: 'Narcos',
    type: 'Series',
    year: 2015,
    genre: 'Crime / Biography',
    rating: 8.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/rTmal9fDbwh5F0waol2hq35U4ah.jpg',
    region: 'Hollywood',
    ownerReview:
      'Joe Pettigrew and Carlo Bernard created a crime epic structured around DEA agent Steve Murphy hunting Colombian kingpin Pablo Escobar. Pedro Pascal\'s Murphy navigates institutional corruption and moral compromise during the height of drug trafficking. Wagner Moura\'s Escobar is charismatic and increasingly volatile—a man building empire while paranoia corrodes judgment. The series uses documentary-style narration to anchor chaos while maintaining narrative momentum. Cinematography captures Colombia\'s tropical beauty contrasted against cartel brutality. The first season remains taut procedural; later seasons expand scope geographically while potentially losing psychological sharpness. The real-life events give narrative weight—this tragedy actually occurred. The series examines how war on drugs became personal vendetta. Gritty, addictive, and unapologetically violent television.',
  },
  {
    id: 'ozark',
    title: 'Ozark',
    type: 'Series',
    year: 2017,
    genre: 'Crime / Thriller',
    rating: 8.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/pCGyPVrI9Fzw6rE1Pvi4BIXF6ET.jpg',
    region: 'Hollywood',
    ownerReview:
      'Bill Dubuque created a pressure-cooker crime series where a financial advisor launders cartel money in rural Missouri, transforming his ordinary family into money criminals. Jason Bateman carries the series through moral compromise—each decision justified until he\'s unrecognizable. Laura Linney\'s Wendy evolves from victim into architect of family ambitions. The Ozarks become character themselves—beautiful landscape masking criminal infrastructure. The series escalates stakes methodically—each season raising danger while complicating escape routes. Supporting characters are fully realized, with Julia Garner\'s Ruth breaking out as emotional core. The final season spreads itself thin but maintains tension through character relationships rather than plot mechanics. The show understands that criminals convincing themselves of morality become most dangerous. Cold, pervasive dread throughout.',
  },
  {
    id: 'mindhunter',
    title: 'Mindhunter',
    type: 'Show',
    year: 2017,
    genre: 'Crime / Psychological',
    rating: 8.9,
    imageUrl: 'https://image.tmdb.org/t/p/w780/fbKE87mojpIETWepSbD5Qt741fp.jpg',
    region: 'Hollywood',
    ownerReview:
      'David Fincher directed the pilot and set the template—meticulous procedural about FBI profilers constructing criminal psychology from interview sessions. Jonathan Groff\'s Holden Ford obsesses over understanding serial killers, interviewing incarcerated men to map behavioral patterns. Holt McCallany\'s Bill Tench provides grounded counterweight to Holden\'s emerging theorizing. The genius is making dialogue scenes as suspenseful as interrogations. Cinematography favors cold institutional lighting, reinforcing sterile psychological dissection. The show understands that motivation matters more than crime scenes. Interviews with real killers—Ed Kemper, Jerry Brudos—create psychological dread through casual, articulate evil. Rather than glorify violence, the series dissects mindset. Cancelled prematurely, but the first two seasons remain masterwork of procedural television. Unnerving, methodical brilliance.',
  },
  {
    id: 'money-heist',
    title: 'Money Heist',
    type: 'Series',
    year: 2017,
    genre: 'Crime / Thriller',
    rating: 8.2,
    imageUrl: 'https://image.tmdb.org/t/p/w780/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    region: 'Hollywood',
    ownerReview:
      'Alex de la Iglesia created a Spanish heist series that understands entertainment momentum and character mythology. The Professor\'s genius scheme unfolds across seasons with escalating complications that feel earned rather than contrived. The ensemble cast members—Lisbon, Denver, Berlin—transcend archetypes through consistent character writing. The series doesn\'t fear melodrama; instead, it embraces emotional stakes alongside tactical planning. Cinematography shifts between tense interiors and sprawling landscapes, reinforcing scale and danger. Later seasons expand globally, testing narrative coherence, but the core appeal remains—watching intelligent people execute impossible plans. The show is self-aware about its own implausibility, winking at the audience without breaking tension. Addictive television that knows exactly what it wants to be.',
  },
  {
    id: 'peaky-blinders',
    title: 'Peaky Blinders',
    type: 'Series',
    year: 2013,
    genre: 'Crime / Period',
    rating: 8.8,
    imageUrl: 'https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
    region: 'Hollywood',
    ownerReview:
      'Steven Knight created a post-WWI crime saga where trauma becomes the hidden engine driving every character. Birmingham\'s Shelby gang uses violence and ambitious schemes to escape poverty, but history and family psychology prove more dangerous than any rival. Cillian Murphy\'s Thomas Shelby carries emotional scars beneath calculated ruthlessness. The production design is meticulous, creating a grimy universe where expensive suits contrast with brutal methods. The series balances cool aesthetics—sharp editing, anachronistic music—with devastating psychological depth. Later seasons expand scope internationally while maintaining intimate family dysfunction. Helen McCrory as Polly provides moral anchor. The show argues that violence inherited becomes generational curse. A period crime epic that uses style to hide desperate, broken people.',
  },
  {
    id: 'breaking-bad',
    title: 'Breaking Bad',
    type: 'Series',
    year: 2008,
    genre: 'Crime / Drama',
    rating: 9.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/ineLOBPG8AZsluYwnkMpHRyu7L.jpg',
    region: 'Hollywood',
    ownerReview:
      'Vince Gilligan created television\'s greatest moral descent by tracking Walter White from desperate teacher to ruthless kingpin with forensic precision. Every season escalates stakes while maintaining character logic—Walt isn\'t driven by external forces but by ego and pride masquerading as necessity. Bryan Cranston\'s performance captures white-collar resentment morphing into sociopathy. Aaron Paul\'s Jesse Pinkman provides moral counterweight, watching his mentor destroy everything including him. The series understands that chemistry is not just the show\'s metaphor but its structure—tense ingredients combining into explosive reactions. The cinematography captures New Mexico\'s beauty to juxtapose against moral ugliness. By series end, Walt achieves everything he wanted and loses everything that mattered. A tragedy about how ambition consumes the ambitious.',
  },
  {
    id: 'better-call-saul',
    title: 'Better Call Saul',
    type: 'Series',
    year: 2015,
    genre: 'Crime / Legal Drama',
    rating: 9.4,
    imageUrl: 'https://image.tmdb.org/t/p/w780/zjg4jpK1Wp2kiRvtt5ND0kznako.jpg',
    region: 'Hollywood',
    ownerReview:
      'Peter Gould and Vince Gilligan crafted a prequel to Breaking Bad that arguably surpasses its predecessor through meticulous character work and thematic precision. Bob Odenkirk\'s Jimmy McGill transforms from struggling lawyer into slick criminal attorney Saul Goodman, but the series refuses to glamorize his descent. Instead, it traces how rationalization and moral compromise compound. Kim Wexler, played with devastating nuance by Rhea Seehorn, becomes the show\'s moral center—someone repeatedly choosing complicity beside Jimmy. Jonathan Banks returns as Mike Ehrmantraut, and his storyline parallels Jimmy\'s moral erosion through profession rather than personality. The cinematography is deliberately composed, using negative space and symmetry to reinforce institutional coldness. The series takes time with scenes—no rushed momentum, just meticulous attention to dialogue and reaction. The final season devastates through accumulated consequence. A triumph of long-form serialized television that trusts viewers with silence and restraint.',
  },
  {
    id: 'the-crown',
    title: 'The Crown',
    type: 'Series',
    year: 2016,
    genre: 'Historical / Drama',
    rating: 8.6,
    imageUrl: 'https://image.tmdb.org/t/p/w780/1M876KPjulVwppEpldhdc8V4o68.jpg',
    region: 'Hollywood',
    ownerReview:
      'Peter Morgan created a lavish historical drama examining the British monarchy through intimate character focus rather than pageantry. Claire Foy\'s Elizabeth II embodies public restraint versus private anguish—a woman bound by obligation and constitutional duty. The series excels at political maneuvering, showing how queens exercise power through diplomatic subtlety. Gillian Anderson\'s Margaret Thatcher and Olivia Colman\'s later-years Elizabeth bring thematic complexity. Cinematography is deliberately formal, mirrors and frames emphasizing institutional grandeur versus personal isolation. The series navigates allegations and real-life events with dramatization, occasionally favoring narrative drama over historical accuracy—criticism that\'s fair but misses the point. The show examines duty versus personality, institution versus individual. Later seasons become more theatrical as real-world politics blur with fictional interpretation. Elegant, complex, and utterly compelling.',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    type: 'Series',
    year: 2016,
    genre: 'Sci-Fi / Mystery',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    region: 'Hollywood',
    ownerReview:
      'The Duffer Brothers nailed the small-town mystery box formula by grounding supernatural horror in intimate character relationships and authentic 1980s Americana. The ensemble cast chemistry is the series\' greatest asset—every minor character becomes believable and invested. Season One remains a masterclass in pacing and tension, introducing the Upside Down with perfect proportions of horror and wonder. The chemistry between Winona Ryder\'s desperate maternal love and David Harbour\'s gruff redemption carries emotional weight through grotesque set pieces. Later seasons expand scope to global stakes, sometimes sacrificing the intimate horror for spectacle, but never losing the core family dynamics. The show understands that monsters are scariest when they threaten people you care about. A phenomenon that revitalized genre television.',
  },
  {
    id: 'dark',
    title: 'Dark',
    type: 'Series',
    year: 2017,
    genre: 'Sci-Fi / Thriller',
    rating: 9.1,
    imageUrl: 'https://image.tmdb.org/t/p/w780/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
    region: 'Hollywood',
    ownerReview:
      'Baran bo Odar and Jantje Friese created the gold standard for time-travel television by refusing to compromise on logic or emotional stakes. The small German town of Winden becomes a character itself—every location carries narrative weight. The interwoven timelines and family trees demand viewer engagement and reward detailed attention with revelations that recontextualize earlier scenes. Rather than rely on spectacle, Dark builds dread through inevitability. The cinematography is deliberately cold, all grays and amber light, reflecting a world trapped by fate. The ensemble embraces quiet desperation. By series end, the show argues that every small action echoes across decades with devastating consequence. A masterpiece of serialized television that respects audience intelligence.',
  },
  {
    id: 'haunting-hill-house',
    title: 'The Haunting of Hill House',
    type: 'Show',
    year: 2018,
    genre: 'Horror / Drama',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/38PkhBGRQtmVx2drvPik3F42qHO.jpg',
    region: 'Hollywood',
    ownerReview:
      'Mike Flanagan adapted Shirley Jackson\'s novel by balancing supernatural horror with family trauma exploration. The Crain family\'s childhood experiences in Hill House echo across adulthood, with psychological damage proving more destructive than ghosts. The production design—creeping shadows, architectural dread—makes the house genuinely unsettling. Flanagan\'s signature extended takes and subtle reveals create sustained tension. Each episode focuses on different family member, revealing how shared trauma creates divergent coping mechanisms. The cinematography moves between warm memories and cold present-day darkness, reinforcing temporal fracture. Victoria Pedretti\'s Nell carries emotional core, with her climactic episode ranking among television\'s greatest hours. The show understands that horror\'s most effective when grounded in believable emotional stakes. Later episodes venture into supernatural spectacle but maintain character focus. A rare horror series that balances scares with profound character writing.',
  },
  {
    id: 'inception',
    title: 'Inception',
    type: 'Movie',
    year: 2010,
    genre: 'Sci-Fi / Heist',
    rating: 9.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg',
    region: 'Hollywood',
    ownerReview:
      'A landmark achievement in commercial cinema that respects audience intelligence. The layered dreamscape concept could\'ve been a gimmick, but it becomes a vehicle for exploring regret and redemption. The action sequences are brilliantly choreographed and visually coherent despite their complexity. DiCaprio anchors the cerebral chaos with vulnerability, and Marion Cotillard provides the emotional core. The ambiguous ending sparked years of debate, proving the film trusts viewers to sit with uncertainty. A perfect synthesis of blockbuster spectacle and genuine philosophical substance.',
    rottenTomatoesScore: 86,
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    type: 'Movie',
    year: 2017,
    genre: 'Sci-Fi / Neo-noir',
    rating: 8.7,
    imageUrl: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    region: 'Hollywood',
    ownerReview:
      'Villeneuve treats the Blade Runner sequel with reverence and vision. Roger Deakins\' cinematography creates perhaps cinema\'s most beautiful sci-fi landscape. Ryan Gosling\'s quiet K carries the film with minimal dialogue, his face conveying existential questions about humanity. Hans Zimmer\'s synth-heavy score haunts rather than overwhelms. The pacing is deliberate, even slow, but every frame justifies its duration. The ambiguous ending honors the original\'s uncertainty about what consciousness means.',
    rottenTomatoesScore: 81,
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    type: 'Movie',
    year: 2014,
    genre: 'Sci-Fi / Drama',
    rating: 9.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    region: 'Hollywood',
    ownerReview:
      'Nolan\'s ambitious space opera transcends its 2h 49m runtime through sheer emotional depth. The film balances mind-bending theoretical physics with an intimate father-daughter relationship that anchors every moment. Hans Zimmer\'s organ-driven score is otherworldly, and the visuals of distant planets and black holes remain unprecedented. While the dialogue-heavy exposition can feel dense during space mechanics explanations, the payoff in the final act delivers one of cinema\'s most moving climaxes. A masterpiece about love transcending dimensions.',
    rottenTomatoesScore: 72,
  },
  {
    id: 'fight-club',
    title: 'Fight Club',
    type: 'Movie',
    year: 1999,
    genre: 'Drama / Psychological',
    rating: 8.8,
    imageUrl: 'https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    region: 'Hollywood',
    ownerReview:
      'Fincher\'s adaptation weaponizes rage through jump cuts and a narrator descending into fractured identity. The twist lands like a punch because the film has been hiding clues in plain sight. The fight scenes escalate from basement catharsis to something genuinely dangerous. Edward Norton\'s neurotic intensity and Pitt\'s charismatic nihilism create explosive chemistry. Asks uncomfortable questions about toxic masculinity in a post-consumer world. Three watches reveal different film each time. Provokes argument decades later.',
    rottenTomatoesScore: 67,
  },
  {
    id: 'the-godfather',
    title: 'The Godfather',
    type: 'Movie',
    year: 1972,
    genre: 'Crime / Classic',
    rating: 9.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    region: 'Hollywood',
    ownerReview:
      'Coppola\'s 2h 55m odyssey through the Corleone empire remains the template every crime saga attempts to follow. Gordon Willis\' cinematography created the look that defines the film\'s elegant corruption. Marlon Brando\'s gravelly whisper and Pacino\'s gradual hardening into ruthlessness chart fate versus choice. Michael\'s transformation from outsider reluctantly pulled in to calculating capo is a masterclass in character arc. There are better structured films, but there may not be a better demonstration of filmmaking as total vision. Genuinely timeless.',
    rottenTomatoesScore: 97,
  },
  {
    id: 'freaky-friday-2003',
    title: 'Freaky Friday',
    type: 'Movie',
    year: 2003,
    genre: 'Comedy / Family',
    rating: 7.0,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/98/Freaky_Friday_%282003_film%29.png',
    region: 'Hollywood',
    ownerReview:
      'A surprisingly effective family comedy that earns its emotional beats through genuine character work. Jamie Lee Curtis and Lindsay Lohan create electric chemistry. The script smartly uses the body swap to force both characters to walk in each other\'s shoes, building empathy through comic situations. The film avoids schmaltz despite inherent sentimentality, keeping things breezy and entertaining. A reliable choice for family viewing that surprisingly holds up to nostalgia and affection.',
    rottenTomatoesScore: 61,
  },
  {
    id: 'back-to-the-future',
    title: 'Back to the Future',
    type: 'Movie',
    year: 1985,
    genre: 'Comedy / Sci-Fi',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/nTEz3FxB7yX1yVlNdYL2vQwt8EJ.jpg',
    region: 'Hollywood',
    ownerReview:
      'Robert Zemeckis created the perfect blockbuster—a time-travel romp with genuine emotional stakes. Christopher Lloyd\'s crazed scientist and Michael J. Fox\'s enthusiastic teenager have perfect chemistry. The script respects temporal logic while maintaining breakneck pacing. Every frame crackles with energy. The film became a cultural phenomenon because it nailed the formula: spectacle, humor, sentiment, and adventure. Three films, and only the first truly satisfied all components.',
    rottenTomatoesScore: 85,
  },
  {
    id: 'jaws',
    title: 'Jaws',
    type: 'Movie',
    year: 1975,
    genre: 'Thriller / Horror',
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w780/V3N0bFXEzFurR1CqrSNKSbLlc8q.jpg',
    region: 'Hollywood',
    ownerReview:
      'Spielberg\'s debut feature essentially created the modern blockbuster. Forced to work with a malfunctioning mechanical shark, Spielberg crafted suspense through suggestion, music, and editing rather than spectacle. The small-town politics subplot grounds the horror in human conflict. Roy Scheider, Robert Shaw, and Richard Dreyfuss create palpable tension. Pacing builds relentlessly across two hours. The minimalist approach paradoxically creates maximum dread. Essential cinema.',
    rottenTomatoesScore: 93,
  },
  {
    id: 'casablanca',
    title: 'Casablanca',
    type: 'Movie',
    year: 1942,
    genre: 'Drama / Romance',
    rating: 8.5,
    imageUrl: 'https://image.tmdb.org/t/p/w780/gJB8gxLkDTZHZVJN1Z8SevumBS1.jpg',
    region: 'Hollywood',
    ownerReview:
      'Michael Curtiz created a wartime romance that transcends its historical moment to speak to timeless themes of love, sacrifice, and duty. Humphrey Bogart and Ingrid Bergman create electric tension while maintaining emotional restraint befitting the era. The supporting cast—Peter Lorre, Claude Rains, Sydney Greenstreet—provides rich character texture. Every scene crackles with purpose. The ending remains devastating precisely because it refuses sentimentality. Essential cinema.',
    rottenTomatoesScore: 97,
  },
  // ========== BOLLYWOOD ==========
  {
    id: 'dhurandar-2',
    title: 'Dhurandar 2',
    type: 'Movie',
    year: 2026,
    genre: 'Action / Thriller',
    rating: 7.8,
    imageUrl: '/dhurandar.jpg',
    region: 'Bollywood',
    ownerReview:
      'Dhurandar 2 deepens the franchise story by following its lead hero into a larger conspiracy where personal loyalty collides with public duty. The screenplay keeps the emotional spine clear, so even the high-stakes twists feel connected to character choices instead of pure spectacle. Cinematography leans into wide, kinetic frames during action passages, then shifts to tighter, lower-light compositions in confrontational scenes to underline moral pressure. The visuals are polished and scale-driven, with stronger production design, cleaner stunt geography, and explosive set pieces that still remain readable. Performances carry the film: the lead brings conviction and restraint, the antagonist adds menace without caricature, and the supporting cast gives the drama enough texture that the sequel feels bigger emotionally, not just louder technically.',
    rottenTomatoesScore: 79,
  },
  {
    id: 'dhurandar',
    title: 'Dhurandar',
    type: 'Movie',
    year: 2025,
    genre: 'Action / Drama',
    rating: 7.6,
    imageUrl: '/dhurandar.jpg',
    region: 'Bollywood',
    ownerReview:
      'Dhurandar opens as a revenge-driven action drama and gradually evolves into a character story about justice, anger, and the cost of power. The plot follows a familiar commercial template, but it is staged with enough narrative momentum that each major turn feels earned. Cinematography gives the film an energetic but controlled rhythm, using sharp contrast, moving camera setups, and practical-location framing to keep tension alive. Visually, the film blends mass-cinema scale with contemporary texture, especially in its action blocks where choreography, editing, and sound design work together effectively. The performances are a key strength: the lead anchors the film with commanding screen presence, emotional scenes are played with sincerity, and the supporting ensemble adds weight to the hero arc rather than functioning as filler. It is a confident franchise starter that works both as spectacle and as character-led drama.',
    rottenTomatoesScore: 74,
  },
  {
    id: 'chup-2-revenge',
    title: 'Chup: Revenge of the Artist',
    type: 'Movie',
    year: 2023,
    genre: 'Thriller / Dark Comedy',
    rating: 8.2,
    imageUrl: '/chup revenge of the artist.jpg',
    region: 'Bollywood',
    ownerReview:
      'Balaji Mohan crafted a meta-thriller about a serial killer targeting film critics. Sunny Deol\'s ruthless protagonist becomes darkly sympathetic through thematic examination of artistic integrity versus commercial compromise. The film asks uncomfortable questions about criticism\'s role in cinema. Blood-soaked and absurdist, yet emotionally intelligent. A refreshing departure from Bollywood convention while maintaining commercial appeal.',
  },
  {
    id: 'dunki',
    title: 'Dunki',
    type: 'Movie',
    year: 2023,
    genre: 'Comedy / Drama',
    rating: 7.8,
    imageUrl: '/dunki.jpg',
    region: 'Bollywood',
    ownerReview:
      'Rajkumar Hirani created an immigration comedy that balances humor with legitimate social commentary. Shah Rukh Khan\'s character navigates the absurdities of immigration law while confronting class inequality. The film doesn\'t shy from political critique while maintaining entertainment value. Mahira Khan provides emotional counterweight. A rare Bollywood film that entertains and educates simultaneously.',
  },
  {
    id: 'bhool-bhulaiya-3',
    title: 'Bhool Bhulaiyaa 3',
    type: 'Movie',
    year: 2024,
    genre: 'Horror / Comedy',
    rating: 7.5,
    imageUrl: '/bhool bhulaiyaa 3.jpg',
    region: 'Bollywood',
    ownerReview:
      'A delightfully absurd supernatural comedy that prioritizes entertainment over coherence. Kartik Aaryan\'s manic energy carries the film through convoluted plot mechanics. The haunted house setting becomes excuse for elaborate set pieces and comedic scenarios. While narratively loose, the chemistry between leads sustains momentum. A film comfortable with its own silliness.',
  },
  {
    id: 'bhediya',
    title: 'Bhediya',
    type: 'Movie',
    year: 2022,
    genre: 'Horror / Comedy',
    rating: 7.2,
    imageUrl: '/bhediya.jpg',
    region: 'Bollywood',
    ownerReview:
      'Amar Kaushik created a werewolf comedy that blends Indian mythology with contemporary horror. Varun Dhawan\'s transformation sequence parallels moral compromise. The film uses body-horror humor to explore identity and belonging. While occasionally uneven tonally, the film\'s heart lies in celebrating difference rather than mocking it. A charming mess of a movie.',
  },
  {
    id: 'phir-hera-pheri',
    title: 'Phir Hera Pheri',
    type: 'Movie',
    year: 2006,
    genre: 'Comedy / Crime',
    rating: 7.3,
    imageUrl: '/phir hera pheri.jpg',
    region: 'Bollywood',
    ownerReview:
      'Neeraj Vora created a heist comedy that prioritizes character charm over plot coherence. Akshay Kumar and Suniel Shetty\'s chemistry carries the film through absurd twists. The film understands that Bollywood audiences attend for stars and humor rather than narrative logic. Entertaining within its own logic.',
  },
  {
    id: 'dil-chahta-hai',
    title: 'Dil Chahta Hai',
    type: 'Movie',
    year: 2001,
    genre: 'Romance / Comedy',
    rating: 8.1,
    imageUrl: '/dil chahta hai.jpg',
    region: 'Bollywood',
    ownerReview:
      'Farhan Akhtar\'s directorial debut revolutionized Bollywood by introducing naturalism and genuine character development. Three friends navigate relationships with emotional complexity rarely seen in Indian cinema. The famous Portugal sequence captures wanderlust and introspection. Aamir Khan and Saif Ali Khan\'s performances feel lived-in rather than performed. A watershed moment in Hindi cinema.',
  },
  {
    id: 'rang-de-basanti',
    title: 'Rang De Basanti',
    type: 'Movie',
    year: 2006,
    genre: 'Drama / Action',
    rating: 8.0,
    imageUrl: '/rang de basanti.jpg',
    region: 'Bollywood',
    ownerReview:
      'Rakeysh Omprakash Mehra created a youth-oriented political thriller that ignited conversations about activism and sacrifice. Aamir Khan\'s character evolution from apathetic to politically engaged tracks personal awakening. The film argues that individual conscience can catalyze systemic change. Climactic action sequence remains shocking through emotional investment. A rare Bollywood film that entertains while challenging complacency.',
  },
  {
    id: 'lagaan',
    title: 'Lagaan',
    type: 'Movie',
    year: 2001,
    genre: 'Historical / Drama',
    rating: 8.2,
    imageUrl: '/lagaan.jpg',
    region: 'Bollywood',
    ownerReview:
      'Ashutosh Gowariker created an epic period film that uses cricket as metaphor for colonial resistance. Aamir Khan\'s village headman mobilizes his community against oppressive British taxation. The cricket match becomes climactic battle, elevating sports entertainment into political allegory. The scope is genuinely cinematic—landscapes dwarf characters, reinforcing power dynamics. A film that proved Bollywood could achieve international prestige. Nominated for Academy Award.',
  },
  {
    id: 'dev-d',
    title: 'Dev.D',
    type: 'Movie',
    year: 2009,
    genre: 'Romance / Drama',
    rating: 7.9,
    imageUrl: '/dev.d.jpg',
    region: 'Bollywood',
    ownerReview:
      'Anurag Kashyap subverted the Devdas narrative by centering the female character\'s agency. Abhay Deol\'s Dev spirals toward addiction while Mahie Gill\'s character transcends victimhood. The film refuses romantic redemption, instead depicting genuine psychological damage. Cinematography captures urban decay and despair. A dark, uncompromising adaptation that subverts Bollywood convention.',
  },
  {
    id: 'pink',
    title: 'Pink',
    type: 'Movie',
    year: 2016,
    genre: 'Thriller / Legal Drama',
    rating: 8.0,
    imageUrl: '/pink.jpg',
    region: 'Bollywood',
    ownerReview:
      'Aniruddha Roy Chowdhury created a courtroom drama that challenges victim-blaming through meticulous legal procedure. Three women navigate false accusations of assault. Amitabh Bachchan\'s lawyer provides institutional critique while defending their rights. The film refuses sensationalism, instead examining how society judges women. A rare Bollywood film that entertained while advancing social conversation.',
  },
  {
    id: 'kabhi-khushi-kabhie-gham',
    title: 'Kabhi Khushi Kabhie Gham',
    type: 'Movie',
    year: 2001,
    genre: 'Romance / Drama',
    rating: 7.4,
    imageUrl: '/kabhi khushi kabhie gham.jpg',
    region: 'Bollywood',
    ownerReview:
      'Karan Johar perfected the family melodrama formula—multigenerational conflict resolved through emotional catharsis. Shah Rukh Khan and Kajol\'s chemistry transcends their roles. The film\'s logic is entirely emotional rather than rational, but it works magnificently within that framework. Excessive production design captures aspiration and spectacle. A comfort film that defined an era.',
  },
  {
    id: 'english-vinglish-2012',
    title: 'English Vinglish',
    type: 'Movie',
    year: 2012,
    genre: 'Comedy / Drama',
    rating: 7.2,
    imageUrl: '/english vinglish.jpg',
    region: 'Bollywood',
    ownerReview:
      'Gauri Shinde\'s debut is a tender exploration of identity, family dynamics, and self-actualization filtered through language-learning narrative. Sridevi carries the film with nuanced restraint as a woman built on denial and compromise who discovers voice through vulnerability. The film never mocks her broken English; instead, it celebrates the courage to speak despite imperfection. Comedy arises organically from cultural collision rather than stereotype. By film\'s end, English becomes metaphor for self-expression beyond language. A celebration of becoming rather than arriving.',
    rottenTomatoesScore: 89,
  },
  {
    id: 'jai-bhim',
    title: 'Jai Bhim',
    type: 'Movie',
    year: 2021,
    genre: 'Legal Drama / Thriller',
    rating: 8.4,
    imageUrl: '/jai bhim.jpg',
    region: 'Bollywood',
    ownerReview:
      'S. Nithya Menen created a searing indictment of caste-based oppression and judicial corruption. Suriya\'s lawyer fights for marginalized communities exploited by the system. The film doesn\'t shy from depicting brutality while maintaining focus on human dignity. Cinematography captures humid despair. A rare Indian film that achieves political urgency alongside commercial success.',
  },
  {
    id: 'bandit-queen',
    title: 'Bandit Queen',
    type: 'Movie',
    year: 1994,
    genre: 'Biography / Action',
    rating: 7.6,
    imageUrl: '/bandit queen.jpg',
    region: 'Bollywood',
    ownerReview:
      'Shekhar Kapur created a controversial biography of Phoolan Devi that refused to sanitize her violent rise. The film depicts brutality without glorifying it, instead examining how patriarchal oppression drives women toward rebellion. Seema Biswas\'s performance is animal and uncompromising. The censorship battle that followed proved the film\'s cultural impact. Uncomfortable and essential cinema.',
  },
  {
    id: 'amar-akbar-anthony',
    title: 'Amar Akbar Anthony',
    type: 'Movie',
    year: 1977,
    genre: 'Action / Comedy',
    rating: 7.5,
    imageUrl: '/amar akbar anthony.jpg',
    region: 'Bollywood',
    ownerReview:
      'Manmohan Desai created a definitional masala film—three brothers separated at birth, raised under different religions, reunited for action-packed chaos. Amitabh Bachchan dominates every frame with charisma. The film\'s logic is absurdist, but earnestness sells every moment. Comedy, action, romance—everything coexist without contradiction. A blueprint for Bollywood spectacle.',
  },
  {
    id: 'sholay',
    title: 'Sholay',
    type: 'Movie',
    year: 1975,
    genre: 'Western / Action',
    rating: 8.1,
    imageUrl: '/sholay.jpg',
    region: 'Bollywood',
    ownerReview:
      'Ramesh Sippy created the Indian Western—a 3.5-hour epic that defined commercial cinema for a generation. Two drifters hired to capture a dacoit. The film has everything: action, romance, comedy, philosophy. Amitabh Bachchan and Dharmendra\'s chemistry is monumental. Laxmikant-Pyarelal\'s score elevates everything. A foundational film that proved Bollywood could achieve international scope.',
  },
  {
    id: 'mughal-a-5',
    title: 'Mughal-E-Azam',
    type: 'Movie',
    year: 1960,
    genre: 'Historical / Romance',
    rating: 7.8,
    imageUrl: '/mughal e  azam.jpg',
    region: 'Bollywood',
    ownerReview:
      'K. Asif created a technological marvel for its era—sweeping historical drama with elaborate sets and cinematography. A Mughal emperor and a slave girl forbidden romance becomes metaphor for duty versus desire. Dilip Kumar delivers restrained performance amid production spectacle. The film\'s length matches its ambition. A monument of Indian cinema.',
  },
  {
    id: 'mother-india',
    title: 'Mother India',
    type: 'Movie',
    year: 1957,
    genre: 'Drama / Social Realism',
    rating: 7.7,
    imageUrl: '/mother india.jpg',
    region: 'Bollywood',
    ownerReview:
      'Mehboob Khan created an early socially conscious Bollywood film emphasizing agrarian hardship and maternal sacrifice. Nargis\'s performance as a widow navigating poverty and violence remains devastating. The film uses melodrama to emotional effect rather than sentimentality. A watershed moment for Indian cinema pursuing neorealist ambitions.',
  },
  {
    id: 'andaz-apna-apna',
    title: 'Andaz Apna Apna',
    type: 'Movie',
    year: 1994,
    genre: 'Comedy / Romance',
    rating: 7.6,
    imageUrl: '/andaaz apna apna.jpg',
    region: 'Bollywood',
    ownerReview:
      'Rajul Kumarmukherjee\'s slapstick comedy champions physical humor and character absurdity. Two conmen pursue wealthy heiress. Aamir Khan and Salman Khan\'s chemistry creates comedic alchemy. The film doesn\'t require plot logic, just earnest commitment to silliness. A cult favorite that elevated comedy in Indian cinema.',
  },
  {
    id: 'dilwale-dulhaniya-le-jayenge',
    title: 'Dilwale Dulhaniya Le Jayenge',
    type: 'Movie',
    year: 1995,
    genre: 'Romance / Drama',
    rating: 8.0,
    imageUrl: '/dilwale dulhaniya le jayenge.jpg',
    region: 'Bollywood',
    ownerReview:
      'Aditya Chopra directed what became the defining romance of Hindi cinema—two young people negotiating parental expectations and personal choice. Shah Rukh Khan\'s earnest romantic hero transcended stereotypes. The film balanced traditional values with modern sensibilities. The Swiss scenery becomes character itself. Essential Bollywood that defined an era.',
  },
  // ========== LOLLYWOOD ==========
  {
    id: 'aag-lagey-basti-main',
    title: 'Aag Lagey Basti Main',
    type: 'Movie',
    year: 2024,
    genre: 'Drama / Social',
    rating: 8.2,
    imageUrl: '/aag lage basti mein.jpg',
    region: 'Lollywood',
    ownerReview:
      'A powerful social drama that ignites urgent conversations about inequality and systemic injustice. Director\'s unflinching portrayal of urban despair and community resilience creates a visceral, thought-provoking experience that resonates long after viewing.',
  },
  {
    id: 'na-maloom-afraad-3',
    title: 'Na Maloom Afraad 3',
    type: 'Movie',
    year: 2023,
    genre: 'Comedy / Drama',
    rating: 7.8,
    imageUrl: '/na maloon afraad.jpg',
    region: 'Lollywood',
    ownerReview:
      'The trilogy\'s final installment maintains the franchise\'s comedic charm while exploring deeper themes of friendship and loyalty. Smart humor balanced with genuine emotional stakes delivers entertainment with substance.',
  },
  {
    id: 'load-wedding',
    title: 'Load Wedding',
    type: 'Movie',
    year: 2023,
    genre: 'Comedy / Coming-of-Age',
    rating: 8.0,
    imageUrl: '/load wedding.jpg',
    region: 'Lollywood',
    ownerReview:
      'A refreshing coming-of-age comedy that celebrates Pakistani youth culture with infectious energy. Warm-hearted storytelling about friendship and ambition, shot with vibrant cinematography that captures the spirit of contemporary Lahore.',
  },
  {
    id: 'khel-khel-mein',
    title: 'Khel Khel Mein',
    type: 'Movie',
    year: 2021,
    genre: 'Comedy / Drama',
    rating: 7.5,
    imageUrl: '/khel khel mein.jpg',
    region: 'Lollywood',
    ownerReview:
      'An ensemble comedy that weaves multiple interconnected stories with wit and heart. While plot threads occasionally tangle, the chemistry between cast members and cultural specificity make it an entertaining snapshot of Karachi life.',
  },
  {
    id: 'joyland',
    title: 'Joyland',
    type: 'Movie',
    year: 2021,
    genre: 'Drama / Family',
    rating: 8.4,
    imageUrl: '/joyland.jpg',
    region: 'Lollywood',
    ownerReview:
      'A gender-bending masterpiece that deconstructs masculinity and societal expectations with devastating grace. Intimate cinematography combined with nuanced performances creates an unforgettable exploration of identity and family bonds.',
  },
  {
    id: 'actor-in-law',
    title: 'Actor in Law',
    type: 'Movie',
    year: 2016,
    genre: 'Comedy / Romance',
    rating: 7.2,
    imageUrl: '/actor in law.jpg',
    region: 'Lollywood',
    ownerReview:
      'A lighthearted romantic comedy that plays with Lahore\'s film industry backdrop. While the plot follows predictable beats, the chemistry between leads and satirical takes on celebrity culture provide consistent entertainment.',
  },
  {
    id: 'na-maloom-afraad',
    title: 'Na Maloom Afraad',
    type: 'Movie',
    year: 2014,
    genre: 'Comedy / Drama',
    rating: 7.6,
    imageUrl: '/na maloon afraad.jpg',
    region: 'Lollywood',
    ownerReview:
      'A triple-narrative comedy that revitalized Pakistani cinema with intelligent humor and relatable characters. Three interconnected stories weave together with genuine laughs and unexpected emotional depth, marking a watershed moment for Lollywood.',
  },
  {
    id: 'waar',
    title: 'Waar',
    type: 'Movie',
    year: 2013,
    genre: 'Action / Thriller',
    rating: 7.0,
    imageUrl: '/waar.jpg',
    region: 'Lollywood',
    ownerReview:
      'Pakistan\'s biggest action-thriller spectacle, combining Hollywood-scale setpieces with local storytelling. Despite occasional narrative stumbles, the ambition and technical achievement established new standards for Pakistani blockbuster filmmaking.',
  },
  {
    id: 'bol',
    title: 'Bol',
    type: 'Movie',
    year: 2011,
    genre: 'Drama / Thriller',
    rating: 7.3,
    imageUrl: '/bol.jpg',
    region: 'Lollywood',
    ownerReview:
      'Habib\'s audacious exploration of religious hypocrisy and female agency provoked both acclaim and controversy. Visually striking and intellectually ambitious, though heavy-handed at times, it remains a bold statement about freedom of expression.',
  },
  {
    id: 'khuda-kay-liye',
    title: 'Khuda Kay Liye',
    type: 'Movie',
    year: 2007,
    genre: 'Drama / Romance',
    rating: 7.8,
    imageUrl: '/khuda kay liye.jpg',
    region: 'Lollywood',
    ownerReview:
      'A transformative film that reignited Pakistani cinema with nuanced storytelling and artistic vision. The exploration of faith, identity, and redemption through intimate characterization set a new benchmark for local filmmaking.',
  },
  {
    id: '3-bahadur',
    title: '3 Bahadur',
    type: 'Movie',
    year: 2015,
    genre: 'Animation / Action',
    rating: 6.9,
    imageUrl: '/3 bahadur.jpg',
    region: 'Lollywood',
    ownerReview:
      'An animated adventure that captures Pakistani heroism and humor with infectious energy. While the narrative remains simple, the film\'s celebration of local culture and infectious enthusiasm make it delightful family viewing.',
  },
  {
    id: 'aina',
    title: 'Aina',
    type: 'Movie',
    year: 1977,
    genre: 'Thriller / Drama',
    rating: 7.4,
    imageUrl: '/aina.jpg',
    region: 'Lollywood',
    ownerReview:
      'A cult classic that became Pakistan\'s entry to international film festivals. The psychological thriller\'s exploration of duality and inner darkness through a transformative performance remains haunting and emotionally devastating.',
  },
  {
    id: 'armaan',
    title: 'Armaan',
    type: 'Movie',
    year: 1966,
    genre: 'Drama / Romance',
    rating: 7.2,
    imageUrl: '/armaan.jpg',
    region: 'Lollywood',
    ownerReview:
      'An early romantic drama that showcased Pakistani cinema\'s sophistication and emotional depth. The nuanced portrayal of human connection and conflict established templates still followed by contemporary Pakistani filmmakers.',
  },
]

const storageKey = 'moview-feedback-v1'
type CategoryFilter = 'All' | ShowType
type RegionFilter = 'All' | Region
type SortOption = 'rating-desc' | 'rating-asc' | 'year-desc' | 'title-asc'
type Page = 'home' | 'library' | 'about'

const regionOptions: SelectOption<RegionFilter>[] = [
  { value: 'All', label: 'All Regions' },
  { value: 'Hollywood', label: 'Hollywood' },
  { value: 'Bollywood', label: 'Bollywood' },
  { value: 'Lollywood', label: 'Lollywood' },
]

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
  const [region, setRegion] = useState<RegionFilter>('All')
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
    let filtered = [...catalog]

    if (region !== 'All') {
      filtered = filtered.filter((show) => show.region === region)
    }

    if (category !== 'All') {
      filtered = filtered.filter((show) => show.type === category)
    }

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
  }, [region, category, sortBy])

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
  const featuredImageUrl = resolveImageUrl(featuredShow)

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
    const fallback = img.dataset.fallback || LOCAL_FALLBACK_POSTER
    if (img.src !== fallback) {
      img.src = fallback
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
              backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.86)), url(${featuredImageUrl})`,
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
                  <img src={resolveImageUrl(show)} alt={show.title} className="show-poster" data-fallback={LOCAL_FALLBACK_POSTER} onError={handleImageError} />
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
                  <img src={resolveImageUrl(show)} alt={show.title} className="show-poster" data-fallback={LOCAL_FALLBACK_POSTER} onError={handleImageError} />
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
              Region
              <DarkSelect
                value={region}
                onChange={(value) => setRegion(value as RegionFilter)}
                options={regionOptions}
                ariaLabel="Region"
              />
            </label>

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

          {region === 'All' ? (
            <>
              {(['Hollywood', 'Bollywood', 'Lollywood'] as const).map((regionName) => {
                const regionShows = filteredAndSortedCatalog.filter(
                  (show) => show.region === regionName,
                )
                if (regionShows.length === 0) return null
                return (
                  <section key={regionName} className="region-section">
                    <div className="region-header">
                      <h2>{regionName}</h2>
                      <p>{regionShows.length} titles</p>
                    </div>
                    <div className="catalog-grid">
                      {regionShows.map((show) => (
                        <article key={show.id} className="show-card">
                          <img src={resolveImageUrl(show)} alt={show.title} className="show-poster" data-fallback={LOCAL_FALLBACK_POSTER} onError={handleImageError} />
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
                      ))}
                    </div>
                  </section>
                )
              })}
            </>
          ) : (
            <main className="catalog-grid">
              {filteredAndSortedCatalog.map((show) => {
                return (
                  <article key={show.id} className="show-card">
                    <img src={resolveImageUrl(show)} alt={show.title} className="show-poster" data-fallback={LOCAL_FALLBACK_POSTER} onError={handleImageError} />
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
          )}
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

            <img src={resolveImageUrl(activeShow)} alt={activeShow.title} className="modal-poster" data-fallback={LOCAL_FALLBACK_POSTER} onError={handleImageError} />

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
