import type { Metadata } from "next";
import { passwordLength } from "@/lib/gate";
import { PinGate } from "./PinGate";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function UnlockPage() {
  // Only the length reaches the browser, never the password.
  return <PinGate length={passwordLength()} />;
}
