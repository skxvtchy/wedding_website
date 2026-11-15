import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { PhotoBreak } from "@/components/PhotoBreak";
import { PhotoCascade } from "@/components/PhotoCascade";
import { PhotoJourney } from "@/components/PhotoJourney";
import { Sections } from "@/components/Sections";
import { ShoeChase } from "@/components/ShoeChase";
import { photoBreaks } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <PhotoJourney />
        <PhotoCascade />
        <Sections
          breaks={{
            afterParking: (
              <PhotoBreak
                src={photoBreaks.afterParking}
                caption="Next stop: the big day details."
              />
            ),
            afterSchedule: (
              <PhotoBreak
                src={photoBreaks.afterSchedule}
                caption="Meet the chaos crew."
                tall
              />
            ),
            afterParty: (
              <PhotoBreak
                src={photoBreaks.afterParty}
                caption="Gifts optional. Dancing mandatory."
              />
            ),
            afterDress: (
              <PhotoBreak
                src={photoBreaks.afterDress}
                caption="Come as you are — comfy shoes welcome."
              />
            ),
          }}
        />
      </main>
      <ShoeChase />
    </>
  );
}
