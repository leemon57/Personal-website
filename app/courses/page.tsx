import type { Metadata } from "next";
import { BentoCard } from "@/components/ui/BentoCard";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { Section } from "@/components/ui/Section";
import { courseNotes, program, terms } from "@/lib/courses";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Courses",
  description: `Coursework for ${profile.name} — ${program.degree} at the ${program.school}, ${program.years}.`,
  alternates: {
    canonical: "/courses",
  },
};

export default function CoursesPage() {
  return (
    <div className="layout">
      <Section
        eyebrow="Academics"
        lead={`${program.degree} · ${program.school} · ${program.years}. Completed and planned coursework by term.`}
        title="Courses"
      >
        <BentoGrid className="courses-bento">
          {terms.map((entry) => (
            <BentoCard className={`term-card ${entry.status}`} col={3} key={entry.id}>
              <div className="term-card-head">
                <h3 className="bento-title">{entry.term}</h3>
                <div className="term-meta">
                  {entry.coop ? <span className="term-tag coop">co-op</span> : null}
                  <span className={`term-tag ${entry.status}`}>{entry.status}</span>
                </div>
              </div>

              <ul className="course-list">
                {entry.courses.map((course) => (
                  <li className="course" key={course.code}>
                    <span className="course-main">
                      <span className="course-code">{course.code}</span>
                      {course.title ? (
                        <span className="course-title">{course.title}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            </BentoCard>
          ))}
        </BentoGrid>

        <section
          aria-labelledby="courses-notes"
          className="about-panel courses-notes-card"
          data-reveal
        >
          <p className="bento-label" id="courses-notes">
            Notes
          </p>
          <ul className="courses-notes-list">
            {courseNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </Section>
    </div>
  );
}
