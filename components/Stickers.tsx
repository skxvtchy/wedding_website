/** Hand-drawn stickers for the "favorite things" band. */

export function OrangeCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Orange cat">
      {/* tail */}
      <path
        d="M84 100c18 3 28-8 25-21-2-9-11-12-15-6"
        fill="none"
        stroke="#e8822f"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* body */}
      <path d="M33 106c-5-23 3-46 27-48 24 2 32 25 27 48z" fill="#f0913a" />
      <path d="M47 106c-2-15 2-29 13-30 11 1 15 15 13 30z" fill="#fde7c8" />
      <path
        d="M37 80c5 1 8 4 9 8M83 80c-5 1-8 4-9 8M35 93c5 0 8 2 10 6M85 93c-5 0-8 2-10 6"
        stroke="#d26a22"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* paws */}
      <ellipse cx="50" cy="106" rx="7.5" ry="4.5" fill="#fde7c8" />
      <ellipse cx="70" cy="106" rx="7.5" ry="4.5" fill="#fde7c8" />
      {/* ears */}
      <path d="M37 40 34 14l21 13z" fill="#f0913a" />
      <path d="M83 40l3-26-21 13z" fill="#f0913a" />
      <path d="M40 34l-1.5-12 10 6.5z" fill="#f6b3b0" />
      <path d="M80 34l1.5-12-10 6.5z" fill="#f6b3b0" />
      {/* head */}
      <ellipse cx="60" cy="51" rx="27" ry="23.5" fill="#f0913a" />
      <path d="M60 28.5v8M52.5 30l2.2 7M67.5 30l-2.2 7" stroke="#d26a22" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="60" cy="60" rx="12.5" ry="8.5" fill="#fde7c8" />
      {/* eyes */}
      <ellipse cx="49.5" cy="49.5" rx="3.8" ry="4.8" fill="#1c1814" />
      <ellipse cx="70.5" cy="49.5" rx="3.8" ry="4.8" fill="#1c1814" />
      <circle cx="50.8" cy="47.8" r="1.3" fill="#fff" />
      <circle cx="71.8" cy="47.8" r="1.3" fill="#fff" />
      {/* nose, mouth, whiskers */}
      <path d="M56.8 55.5h6.4L60 59z" fill="#e7787f" />
      <path
        d="M60 59v2.4M60 61.4c-1.6 2.1-4.2 2.1-5.2 0M60 61.4c1.6 2.1 4.2 2.1 5.2 0"
        stroke="#1c1814"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M45 59H31M45 62.5l-13 3.5M75 59h14M75 62.5l13 3.5"
        stroke="#fff7ea"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {/* blush */}
      <ellipse cx="42" cy="58" rx="4" ry="2.4" fill="#f6b3b0" opacity="0.6" />
      <ellipse cx="78" cy="58" rx="4" ry="2.4" fill="#f6b3b0" opacity="0.6" />
    </svg>
  );
}

/** A high-top sneaker in a red/white/black colorway (no brand marks). */
export function Sneaker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 104" className={className} role="img" aria-label="High-top sneaker">
      {/* outsole + midsole */}
      <path d="M9 80h124c7 0 11 4 11 9v1c0 5-4 8-9 8H15c-6 0-10-4-10-9v-1c0-5 1-8 4-8z" fill="#d4334a" />
      <path d="M9 78h125c6 0 9 3 9 7v.5c0 3-2 5-5 5H13c-5 0-8-3-8-6.5V84c0-4 1-6 4-6z" fill="#fbf7ef" />
      {/* upper */}
      <path
        d="M14 79V30c0-7 5-12 12-12h21c5 0 8 3 9 7l7 21c2 6 7 10 14 11l31 5c14 2 24 9 26 16z"
        fill="#fbf7ef"
      />
      {/* heel + ankle panel */}
      <path d="M14 44h22c4 0 6 3 6 6v29H14z" fill="#d4334a" />
      {/* toe cap */}
      <path d="M102 61.5c12 2.3 21 8.6 23.5 17.5H95c0-8 2.5-14.5 7-17.5z" fill="#d4334a" />
      {/* eyestay */}
      <path d="M50 24l7 22c2 6 7 10 14 11l12 2-3 9-13-2c-10-2-17-8-20-17l-7-23z" fill="#1c1814" />
      {/* collar */}
      <path d="M14 30c0-7 5-12 12-12h21c5 0 8 3 9 7l2 7H14z" fill="#1c1814" />
      <path d="M22 18c-2-6 2-12 9-12h10c5 0 8 5 6 12z" fill="#1c1814" />
      {/* laces */}
      <path
        d="M52 31l9-3M55 39l9-3M58 47l10-2.5M63 54l10-1.5M70 59l10-.5"
        stroke="#fbf7ef"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* stitching */}
      <path
        d="M18 74h104M38 50v26M98 64c-2 4-3 9-3 13"
        stroke="#1c1814"
        strokeWidth="1"
        strokeDasharray="2.5 2.5"
        opacity="0.35"
        fill="none"
      />
    </svg>
  );
}
