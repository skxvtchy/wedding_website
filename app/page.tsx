import { BalloonSky } from "@/components/BalloonSky";
import { Countdown } from "@/components/Countdown";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { PhotoBreak } from "@/components/PhotoBreak";
import { DressCode, Faq, Schedule, Travel } from "@/components/Sections";
import { StoryReel } from "@/components/StoryReel";
import { YearsGallery } from "@/components/YearsGallery";
import { photoBreaks } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <BalloonSky />
      <main className="flex-1">
        <Hero />
        <Countdown />
        <StoryReel />
        <Marquee />
        <YearsGallery />
        <Schedule />
        <PhotoBreak {...photoBreaks.afterSchedule} position="center 60%" />
        <Travel />
        <PhotoBreak {...photoBreaks.afterTravel} />
        <DressCode />
        <PhotoBreak {...photoBreaks.afterDress} />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
