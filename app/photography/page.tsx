import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import type { CSSProperties } from "react";
import { AccessGate } from "@/components/AccessGate";
import { WorldMap } from "@/components/WorldMap";
import { BentoCard } from "@/components/ui/BentoCard";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { Section } from "@/components/ui/Section";
import { ACCESS_COOKIE, isSessionUnlocked } from "@/lib/access";
import {
  blogNotes,
  photographyIntro,
  photos,
  playlist,
  readingList,
} from "@/lib/photography";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Photography & Life",
  description: `Life outside the terminal for ${profile.name} — places, reading, and listening.`,
  alternates: {
    canonical: "/photography",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PhotographyPage() {
  const store = await cookies();
  const unlocked = await isSessionUnlocked(store.get(ACCESS_COOKIE)?.value);

  if (!unlocked) {
    return (
      <div className="layout">
        <Section title="Photography & Life">
          <div className="about-panel courses-locked" data-reveal>
            <p className="bento-label">Recruiter access</p>
            <p className="muted">
              My photos, reading, and travels are a bit more personal, so
              they&apos;re shared with recruiters. Leave a quick message to
              unlock them.
            </p>
            <AccessGate next="/photography" />
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="layout">
      <Section lead={photographyIntro} title="Photography & Life">
        <BentoGrid className="life-bento">
          {photos.map((photo, index) => (
            <article
              className="bento-card photo-tile"
              data-reveal=""
              data-tone={photo.tone ?? "sage"}
              key={`${photo.label}-${index}`}
              style={{ "--bento-col": 2 } as CSSProperties}
            >
              {photo.src ? (
                <Image
                  alt={photo.label}
                  className="photo-img"
                  fill
                  sizes="(max-width: 620px) 100vw, 33vw"
                  src={photo.src}
                />
              ) : (
                <span className="photo-fill" />
              )}
              <span className="photo-cap">{photo.label}</span>
            </article>
          ))}

          <BentoCard col={3} label="Reading">
            <ul className="life-reading">
              {readingList.map((book) => (
                <li key={book.title}>
                  <span className="life-reading-title">{book.title}</span>
                  {book.author ? (
                    <span className="life-reading-author">{book.author}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </BentoCard>

          <BentoCard col={3} label="Playlist" title={playlist.title}>
            <ol className="life-tracks">
              {playlist.tracks.map((track, index) => (
                <li key={`${track.title}-${index}`}>
                  <span className="life-track-num">{index + 1}</span>
                  <span className="life-track-title">{track.title}</span>
                  {track.duration ? (
                    <span className="life-track-time">{track.duration}</span>
                  ) : null}
                </li>
              ))}
            </ol>
          </BentoCard>

          <BentoCard col={4} label="Where I've been">
            <WorldMap />
          </BentoCard>

          <BentoCard col={2} label="Notes">
            <ul className="life-notes">
              {blogNotes.map((note) => (
                <li key={note.title}>
                  <span className="life-note-title">{note.title}</span>
                  <span className="life-note-excerpt">{note.excerpt}</span>
                </li>
              ))}
            </ul>
          </BentoCard>
        </BentoGrid>
      </Section>
    </div>
  );
}
