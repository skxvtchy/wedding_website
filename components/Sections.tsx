import type { ReactNode } from "react";
import {
  bridalParty,
  dressCode,
  kidsPlusOne,
  parking,
  registry,
  schedule,
  wedding,
} from "@/lib/content";
import { PhotoFrame } from "./PhotoFrame";
import { Reveal } from "./Reveal";

function SectionShell({
  id,
  title,
  lead,
  children,
  tone = "paper",
}: {
  id: string;
  title: string;
  lead: string;
  children: ReactNode;
  tone?: "paper" | "sky";
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-5 py-20 md:px-8 md:py-28 ${
        tone === "sky" ? "bg-sky-low/40" : "bg-paper"
      }`}
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-ink md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{lead}</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

type SectionsProps = {
  breaks?: {
    afterParking?: ReactNode;
    afterSchedule?: ReactNode;
    afterParty?: ReactNode;
    afterDress?: ReactNode;
  };
};

export function Sections({ breaks }: SectionsProps) {
  return (
    <>
      <SectionShell id="parking" title={parking.title} lead={parking.lead}>
        <p className="text-ink-soft">{parking.directions}</p>
        <p className="mt-4 font-medium text-ink">{wedding.venue.address}</p>
        <a
          href={wedding.venue.mapsUrl}
          className="mt-2 inline-block text-sole underline-offset-4 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          Open in maps
        </a>
        <ul className="mt-8 space-y-3 text-ink-soft">
          {parking.parkingNotes.map((note) => (
            <li key={note} className="border-l-2 border-gold/70 pl-4">
              {note}
            </li>
          ))}
        </ul>
      </SectionShell>

      {breaks?.afterParking}

      <SectionShell
        id="schedule"
        title={schedule.title}
        lead={schedule.lead}
        tone="sky"
      >
        <ol className="space-y-8">
          {schedule.items.map((item) => (
            <li
              key={item.time}
              className="grid gap-1 border-t border-ink/10 pt-6 sm:grid-cols-[7rem_1fr]"
            >
              <time className="font-medium text-sole">{item.time}</time>
              <div>
                <p className="text-xl text-ink">{item.title}</p>
                <p className="mt-1 text-ink-soft">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionShell>

      {breaks?.afterSchedule}

      <SectionShell
        id="party"
        title={bridalParty.title}
        lead={bridalParty.lead}
      >
        <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
          {bridalParty.people.map((person) => (
            <li key={person.name}>
              <PhotoFrame
                src={person.photo}
                alt={person.name}
                className="aspect-[4/5] w-full"
                sizes="(max-width: 640px) 45vw, 220px"
              />
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl text-ink">
                {person.name}
              </p>
              <p className="text-sm text-ink-soft">{person.role}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {breaks?.afterParty}

      <SectionShell
        id="registry"
        title={registry.title}
        lead={registry.lead}
        tone="sky"
      >
        <ul className="flex flex-col gap-4 sm:flex-row">
          {registry.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center border-b border-ink pb-1 text-lg text-ink transition-colors hover:border-sole hover:text-sole"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell
        id="dress-code"
        title={dressCode.title}
        lead={dressCode.lead}
      >
        <ul className="space-y-3 text-ink-soft">
          {dressCode.details.map((line) => (
            <li key={line} className="border-l-2 border-sky-mid pl-4">
              {line}
            </li>
          ))}
        </ul>
      </SectionShell>

      {breaks?.afterDress}

      <SectionShell
        id="kids"
        title={kidsPlusOne.title}
        lead={kidsPlusOne.lead}
        tone="sky"
      >
        <div className="space-y-6 text-ink-soft">
          <p>
            <span className="font-medium text-ink">Kids. </span>
            {kidsPlusOne.kids}
          </p>
          <p>
            <span className="font-medium text-ink">Plus ones. </span>
            {kidsPlusOne.plusOnes}
          </p>
        </div>
      </SectionShell>
    </>
  );
}
