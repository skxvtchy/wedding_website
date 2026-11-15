import type { Metadata } from "next";
import { Album } from "@/components/Album";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { allPhotos } from "@/lib/allPhotos";
import { wedding } from "@/lib/content";

export const metadata: Metadata = {
  title: `The Album · ${wedding.partnerA} & ${wedding.partnerB}`,
  description: `${allPhotos.length} photos from ${wedding.together.since} to today.`,
};

export default function AlbumPage() {
  return (
    <>
      <Nav solid />
      <main className="flex-1 bg-paper">
        <Album />
      </main>
      <Footer />
    </>
  );
}
