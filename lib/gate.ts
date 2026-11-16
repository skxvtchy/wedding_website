/**
 * Site-wide password gate — see proxy.ts and app/unlock/.
 * Server-only: never import this from a client component.
 *
 * The password is numbers only. The repo is public, so the default is stored
 * as a hash rather than in plain text. To change it, set SITE_PASSWORD (digits)
 * in Vercel → Settings → Environment Variables and redeploy.
 */
export const GATE_COOKIE = "jj_gate";

const DEFAULT = {
  length: 4,
  token: "701e892f119fb70aac0c4de097d5da70baf9e6b37232f93f819b5b2c084a3199",
};

const fromEnv = () => {
  const value = process.env.SITE_PASSWORD?.trim();
  return value && /^\d+$/.test(value) ? value : null;
};

/** Hash used for both checking a guess and the unlocked cookie. */
export async function gateToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`jasmine-and-jon:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** What a valid cookie holds once unlocked. */
export async function expectedToken(): Promise<string> {
  const env = fromEnv();
  return env ? gateToken(env) : DEFAULT.token;
}

export async function isCorrectPassword(guess: string): Promise<boolean> {
  return /^\d+$/.test(guess) && (await gateToken(guess)) === (await expectedToken());
}

/** How many digits to ask for. */
export function passwordLength(): number {
  return fromEnv()?.length ?? DEFAULT.length;
}
