/**
 * All copy and photo choices for the site live here.
 * Edit this file to change names, dates, venue details, etc.
 */

export const wedding = {
  partnerA: "Jasmine",
  partnerB: "Jon",
  tagline: "We're getting married",
  /** ISO date-time of the ceremony, in the venue's local time. */
  dateISO: "2026-10-10T16:30:00-05:00",
  date: "Saturday, October 10, 2026",
  dateShort: "10.10.26",
  together: { since: 2017 },
  venue: {
    name: "Skyline Conservatory",
    city: "Austin, Texas",
    address: "1200 Garden Lane, Austin, TX 78701",
    mapsUrl: "https://maps.google.com/?q=1200+Garden+Lane+Austin+TX+78701",
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
  { value: 2026 - wedding.together.since, suffix: "", label: "years together" },
  { value: 191, suffix: "", label: "photos below" },
  { value: 1, suffix: "", label: "hot air balloon" },
  { value: 1, suffix: "", label: "very loud yes" },
] as const;

/** Places we've been together — scrolls across the "Places" band. */
export const places = [
  "Thailand",
  "Binghamton",
  "Bayside",
  "Florida",
  "Upstate New York",
  "Washington",
  "Rhode Island",
] as const;

export const rotatingWords = [
  "adventures",
  "bad selfies",
  "road trips",
  "late-night snacks",
  "choosing each other",
] as const;

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
] as const;

export const travel = {
  title: "Getting there",
  lead: "Easy to find, easier to stay. A few notes so arrival feels calm.",
  directions:
    "From downtown, take Cesar Chavez east and follow signs for Garden Lane. Rideshare drop-off is at the conservatory porte-cochère.",
  parkingNotes: [
    { title: "Self-parking", body: "Complimentary in Lot B — enter from Willow Street." },
    { title: "Valet", body: "Available at the main entrance from 3:00 PM." },
    { title: "Accessible", body: "Reserved spaces are marked near the east doors." },
  ],
};

export const schedule = {
  title: "The big day",
  lead: "Ceremony, dinner, and dancing under the sky.",
  items: [
    { time: "4:00 PM", title: "Guest arrival", detail: "Drinks and lawn games on the terrace." },
    { time: "4:30 PM", title: "Ceremony", detail: "Under the conservatory dome." },
    { time: "5:15 PM", title: "Cocktail hour", detail: "Garden courtyard — photos welcome." },
    { time: "6:30 PM", title: "Dinner", detail: "Seated dinner in the great hall." },
    { time: "8:00 PM", title: "Dancing", detail: "Open floor until late." },
  ],
};

export const dressCode = {
  title: "Dress code",
  lead: "Garden formal — think polished, with room to dance.",
  palette: [
    { name: "Dusk blue", hex: "#5b7aa6" },
    { name: "Lantern gold", hex: "#e2b25c" },
    { name: "Balloon rose", hex: "#d4506d" },
    { name: "Sage", hex: "#9bae92" },
    { name: "Champagne", hex: "#efe2c8" },
  ],
  details: [
    "Suits, cocktail dresses, or dressy separates.",
    "Soft florals and sky blues feel right for the conservatory.",
    "Comfortable shoes encouraged — the lawn is soft and the dance floor runs late.",
  ],
};

export const faq = [
  {
    q: "Can I bring my kids?",
    a: "We’re keeping the celebration adults-only (16+), with a quiet nursing/parent room available if needed.",
  },
  {
    q: "Can I bring a plus one?",
    a: "Plus ones are included when named on your invitation. If you’re unsure, check the envelope or message us.",
  },
  {
    q: "Is the venue indoors or outdoors?",
    a: "Both! The ceremony is under the glass conservatory dome; cocktail hour spills out into the garden.",
  },
  {
    q: "Can I take photos?",
    a: "During the ceremony, we’d love an unplugged moment. After that — snap away and send us everything.",
  },
];
