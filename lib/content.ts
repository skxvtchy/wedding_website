/**
 * All copy and photo choices for the site live here.
 * Edit this file to change names, dates, venue details, etc.
 */

export const wedding = {
  partnerA: "Jonathan",
  partnerB: "Jasmine",
  fullNameA: "Jonathan Wong",
  fullNameB: "Jasmine Then",
  /** Her last name is Then… */
  hashtag: "#ThenshebecameaWong",
  yearsTogether: 10,
  tagline: "We're getting married",
  /** ISO date-time of the ceremony, in the venue's local time. */
  dateISO: "2027-07-03T16:00:00-04:00",
  date: "Saturday, July 3, 2027",
  dateShort: "07.03.27",
  time: "4:00 PM",
  together: { since: 2017 },
  venue: {
    name: "The Madison Hotel",
    city: "Morristown, NJ",
    address: "1 Convent Road, Morristown, NJ 07960",
    mapsUrl: "https://maps.google.com/?q=The+Madison+Hotel,+1+Convent+Road,+Morristown,+NJ+07960",
  },
} as const;

export const images = {
  hero: "/images/years/2025/007.jpg",
  balloon: "/images/props/balloon-hearts.webp",
} as const;

/**
 * "Our story" chapters. Each one shows its photos as a stack of polaroids that
 * shuffle on their own; the first photo is the cover.
 * Most of these are the iPhone (HEIC) originals, converted by
 * scripts/build-photos.mjs. A photo can also be a short muted clip — e.g. a
 * Live Photo exported as .mov/.mp4 into public/videos/ — and it will loop.
 */
export type StoryPhoto = {
  src: string;
  /** CSS object-position for the crop. */
  focus?: string;
};

export type Snippet = {
  year: string;
  title: string;
  caption: string;
  photos: StoryPhoto[];
};

const y = (year: string, ...files: string[]): StoryPhoto[] =>
  files.map((f) => ({ src: `/images/years/${year}/${f}.jpg` }));

export const snippets: Snippet[] = [
  {
    year: "2017",
    title: "Where it started",
    caption: "Two goofs, one frame, zero idea what was coming.",
    photos: y("2017", "009", "001", "005", "018"),
  },
  {
    year: "2018",
    title: "Prom, obviously",
    caption: "Corsage pinned, dad jokes deployed, hearts fully committed.",
    photos: y("2018", "030", "034", "031", "037"),
  },
  {
    year: "2019",
    title: "Snow days",
    caption: "Still figuring it out. Still choosing each other.",
    photos: y("2019", "009", "003", "006", "008"),
  },
  {
    year: "2021",
    title: "Tractor era",
    caption: "Apple picking, flannel season, and one very red tractor.",
    photos: y("2021", "011", "001", "009", "008"),
  },
  {
    year: "2022",
    title: "Caps in the air",
    caption: "Graduated together. Celebrated louder.",
    photos: y("2022", "008", "006", "004", "010"),
  },
  {
    year: "2023",
    title: "Big trips",
    caption: "New cities, same silly faces.",
    photos: y("2023", "025", "018", "023", "006"),
  },
  {
    year: "2024",
    title: "Swept off her feet",
    caption: "Literally. Sunset optional, piggyback mandatory.",
    photos: [{ src: "/images/years/2024/003.jpg", focus: "45% center" }, ...y("2024", "006", "007", "012")],
  },
  {
    year: "2025",
    title: "A sky full of lanterns",
    caption: "Wishes sent up. Most of them about each other.",
    photos: y("2025", "007", "003", "001", "005"),
  },
  {
    year: "2026",
    title: "Up, up, and away",
    caption: "A hot air balloon. A question. A very loud yes.",
    photos: y("2026", "011", "012", "013"),
  },
  {
    year: "2026",
    title: "Said yes",
    caption: "Now we float.",
    photos: y("2026", "015", "016", "009", "027"),
  },
];

export const stats = [
  { value: wedding.yearsTogether, suffix: "", label: "years together" },
  { value: 191, suffix: "", label: "photos below" },
  { value: 1, suffix: "", label: "hot air balloon" },
  { value: 1, suffix: "", label: "very loud yes" },
] as const;

/** "A few of our favorite things" — scrolls across the night band. */
export const favorites = [
  "Orange cats",
  "Nike Dunks",
  "Cat naps",
  "Jordan 1s",
  "Hypebeast kicks",
  "Air Max",
  "Sneaker drops",
] as const;

export const rotatingWords = ["love", "laughter", "adventures", "late-night talks", "us"] as const;

export const photoBreaks = {
  afterSchedule: {
    src: "/images/years/2026/010.jpg",
    caption: "Said yes. Now we float.",
  },
  afterTravel: {
    src: "/images/years/2023/012.jpg",
    caption: "Gifts optional. Dancing mandatory.",
  },
  afterDress: {
    src: "/images/years/2026/018.jpg",
    caption: "Come as you are — comfy shoes welcome.",
  },
} as const;

export const navLinks = [
  { href: "/#story", label: "Our Story" },
  { href: "/#photos", label: "Photos" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#travel", label: "Travel" },
  { href: "/#dress-code", label: "Dress Code" },
  { href: "/#faq", label: "FAQ" },
  { href: "/game", label: "Game" },
] as const;

export const travel = {
  title: "Getting there",
  lead: "Easy to find, easier to stay. A few notes so arrival feels calm.",
  directions:
    "The Madison Hotel sits on Convent Road just off Route 124 (Madison Avenue), a few minutes from I-287. Rideshare drop-off is at the main entrance.",
  parkingNotes: [
    { title: "Parking", body: "On-site parking at the hotel." },
    { title: "By train", body: "Convent Station on NJ Transit's Morristown Line is just down the road." },
    { title: "Staying over", body: "The venue is a hotel — stay right where the party is." },
  ],
};

export const schedule = {
  title: "The big day",
  lead: "Ceremony, dinner, and dancing on a summer night.",
  items: [
    { time: "3:30 PM", title: "Guest arrival", detail: "Find your seat and settle in." },
    { time: "4:00 PM", title: "Ceremony", detail: "The part where we say I do." },
    { time: "4:45 PM", title: "Cocktail hour", detail: "Drinks, bites, and photos welcome." },
    { time: "6:00 PM", title: "Dinner", detail: "Seated dinner and toasts." },
    { time: "7:30 PM", title: "Dancing", detail: "Open floor until late." },
  ],
};

export const dressCode = {
  title: "Dress code",
  lead: "Summer formal — think polished, with room to dance.",
  palette: [
    { name: "Dusk blue", hex: "#5b7aa6" },
    { name: "Lantern gold", hex: "#e2b25c" },
    { name: "Balloon rose", hex: "#d4506d" },
    { name: "Sage", hex: "#9bae92" },
    { name: "Champagne", hex: "#efe2c8" },
  ],
  details: [
    "Suits, cocktail dresses, or dressy separates.",
    "Soft florals and sky blues feel right for a July evening.",
    "Comfortable shoes encouraged — the dance floor runs late.",
  ],
};

export const faq = [
  {
    q: "Can I bring my kids?",
    a: "Yes! Kids are welcome — bring the whole family.",
  },
  {
    q: "Can I bring a plus one?",
    a: "Plus ones are included when named on your invitation. If you’re unsure, check the envelope or message us.",
  },
  {
    q: "Where should I stay?",
    a: "The Madison Hotel is the venue and a hotel, so you can stay right where the party is. More details soon.",
  },
  {
    q: "Can I take photos?",
    a: `During the ceremony, we’d love an unplugged moment. After that — snap away and tag ${wedding.hashtag}.`,
  },
];
