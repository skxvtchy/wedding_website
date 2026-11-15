export const wedding = {
  partnerA: "Jasmine",
  partnerB: "Jon",
  tagline: "We're getting married",
  date: "Saturday, October 10, 2026",
  dateShort: "10.10.26",
  venue: {
    name: "Skyline Conservatory",
    address: "1200 Garden Lane, Austin, TX 78701",
    mapsUrl: "https://maps.google.com/?q=Austin+TX",
  },
  heroCta: "Scroll the story",
} as const;

export const images = {
  hero: "/images/couple/hero.jpg",
  /** Face crop sources for balloon basket (object-position set in BalloonScene). */
  jon: "/images/couple/hero.jpg",
  partner: "/images/couple/hero.jpg",
  portrait: "/images/couple/portrait.jpg",
  balloon: "/images/props/balloon.png",
  sole: "/images/props/sole.svg",
  shoes: "/images/props/shoes.svg",
} as const;

export const storyChapters = [
  {
    src: "/images/story/01.jpg",
    year: "2017",
    caption: "Where it started — two goofs, one frame.",
  },
  {
    src: "/images/story/03.jpg",
    year: "2018",
    caption: "Adventures, snacks, and zero chill.",
  },
  {
    src: "/images/story/05.jpg",
    year: "2019",
    caption: "Still figuring it out. Still choosing each other.",
  },
  {
    src: "/images/story/07.jpg",
    year: "2021",
    caption: "Home base, couch laughs, orange cat tax.",
  },
  {
    src: "/images/story/08.jpg",
    year: "2022",
    caption: "Bigger trips. Same silly faces.",
  },
  {
    src: "/images/story/10.jpg",
    year: "2023",
    caption: "Dressed up, showing up, growing up — together.",
  },
  {
    src: "/images/story/13.jpg",
    year: "2024",
    caption: "Streetwear dates and shoe piles by the door.",
  },
  {
    src: "/images/story/15.jpg",
    year: "2026",
    caption: "Said yes. Now we float.",
  },
] as const;

export const photoCascade = [
  "/images/story/02.jpg",
  "/images/story/04.jpg",
  "/images/story/06.jpg",
  "/images/story/09.jpg",
  "/images/story/11.jpg",
  "/images/story/12.jpg",
  "/images/story/14.jpg",
  "/images/story/16.jpg",
  "/images/story/17.jpg",
  "/images/story/18.jpg",
  "/images/couple/portrait.jpg",
  "/images/couple/hero.jpg",
] as const;

export const photoBreaks = {
  afterParking: "/images/story/09.jpg",
  afterSchedule: "/images/story/11.jpg",
  afterParty: "/images/story/16.jpg",
  afterDress: "/images/story/17.jpg",
} as const;

export const navLinks = [
  { href: "#story", label: "Our Story" },
  { href: "#photos", label: "Photos" },
  { href: "#parking", label: "Parking" },
  { href: "#schedule", label: "Schedule" },
  { href: "#party", label: "Party" },
  { href: "#registry", label: "Registry" },
  { href: "#dress-code", label: "Dress" },
  { href: "#kids", label: "Kids" },
] as const;

export const parking = {
  title: "Parking & Directions",
  lead: "Getting there is easy — a few notes so arrival feels calm.",
  directions:
    "From downtown, take Cesar Chavez east and follow signs for Garden Lane. Rideshare drop-off is at the conservatory porte-cochère.",
  parkingNotes: [
    "Complimentary self-parking in Lot B (enter from Willow Street).",
    "Valet available at the main entrance from 3:00 PM.",
    "Accessible spaces are marked near the east doors.",
  ],
};

export const schedule = {
  title: "Schedule",
  lead: "A day of ceremony, dinner, and dancing under the sky.",
  items: [
    {
      time: "4:00 PM",
      title: "Guest arrival",
      detail: "Drinks and lawn games on the terrace.",
    },
    {
      time: "4:30 PM",
      title: "Ceremony",
      detail: "Under the conservatory dome.",
    },
    {
      time: "5:15 PM",
      title: "Cocktail hour",
      detail: "Garden courtyard — photos welcome.",
    },
    {
      time: "6:30 PM",
      title: "Dinner",
      detail: "Seated dinner in the great hall.",
    },
    { time: "8:00 PM", title: "Dancing", detail: "Open floor until late." },
  ],
};

export const bridalParty = {
  title: "Bridal Party",
  lead: "The people who keep us laughing — and keep the shoes from running too far.",
  people: [
    { name: "Sam Rivera", role: "Maid of Honor", photo: "/images/party/1.jpg" },
    { name: "Chris Patel", role: "Best Man", photo: "/images/party/2.jpg" },
    { name: "Jordan Lee", role: "Bridesmaid", photo: "/images/party/3.jpg" },
    { name: "Taylor Brooks", role: "Groomsman", photo: "/images/party/4.jpg" },
    { name: "Riley Quinn", role: "Bridesmaid", photo: "/images/party/5.jpg" },
    { name: "Morgan Ellis", role: "Groomsman", photo: "/images/party/6.jpg" },
  ],
};

export const registry = {
  title: "Registry",
  lead: "Your presence is the gift. If you’d like to contribute, here are a few places we’ve registered.",
  links: [
    { label: "Honeymoon fund", href: "https://example.com/honeymoon" },
    { label: "Home essentials", href: "https://example.com/registry" },
  ],
};

export const dressCode = {
  title: "Dress Code",
  lead: "Garden formal — think polished, with room to dance.",
  details: [
    "Suits, cocktail dresses, or dressy separates.",
    "Soft florals and sky blues feel right for the conservatory.",
    "Comfortable shoes encouraged — the lawn is soft, and the sole may chase you.",
  ],
};

export const kidsPlusOne = {
  title: "Kids & Plus Ones",
  lead: "We kept the guest list intentional so everyone we love can celebrate fully.",
  kids: "We’re keeping the celebration adults-only (16+), with a quiet nursing/parent room available if needed.",
  plusOnes:
    "Plus ones are included when named on your invitation. If you’re unsure, check the envelope or message us.",
};
