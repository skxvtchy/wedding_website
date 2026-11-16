"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE, expectedToken, isCorrectPassword } from "@/lib/gate";

export async function unlock(
  prev: { error: boolean; tries: number },
  formData: FormData,
): Promise<{ error: boolean; tries: number }> {
  const pin = String(formData.get("pin") ?? "");
  if (!(await isCorrectPassword(pin))) {
    // A short pause makes guessing every combination tedious.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: true, tries: prev.tries + 1 };
  }

  const jar = await cookies();
  jar.set(GATE_COOKIE, await expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  const next = String(formData.get("next") ?? "/");
  // Only same-site paths, so the link can't bounce people elsewhere.
  redirect(next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/");
}
