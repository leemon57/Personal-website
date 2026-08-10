import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AccessGate } from "@/components/AccessGate";
import { BentoCard } from "@/components/ui/BentoCard";
import { BentoGrid } from "@/components/ui/BentoGrid";
import { Section } from "@/components/ui/Section";
import { ACCESS_COOKIE, isSessionUnlocked } from "@/lib/access";
import { courseNotes, gpaStats, program, type Term, terms } from "@/lib/courses";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Courses",
  description: `Coursework for ${profile.name} — ${program.degree} at the ${program.school}, ${program.years}.`,
  alternates: {
    canonical: "/courses",
  },
  robots: {
    index: false,
    follow: false,
  },
};

function gradeBand(grade: number): "high" | "mid" | "low" {
  if (grade >= 85) {
    return "high";
  }
  if (grade >= 70) {
    return "mid";
  }
  return "low";
}

function formatTermGrade(entry: Term): string | null {
  const parts = [
    typeof entry.average === "number" ? `${entry.average}%` : null,
    typeof entry.gpa === "number" ? `${entry.gpa.toFixed(2)} GPA` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}

export default async function CoursesPage() {
  const store = await cookies();
  const unlocked = await isSessionUnlocked(store.get(ACCESS_COOKIE)?.value);

  if (!unlocked) {
    return (
      <div className="layout">
        <Section
          eyebrow="Academics"
          lead={`${program.degree} · ${program.school} · ${program.years}.`}
          title="Courses"
        >
          <div className="about-panel courses-locked" data-reveal>
            <p className="bento-label">Recruiter access</p>
            <p className="muted">
              The full transcript — term-by-term courses, grades, and GPA — is
              shared with recruiters. Leave a quick message to unlock it.
            </p>
            <AccessGate next="/courses" />
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="layout">
      <Section
        eyebrow="Academics"
        lead={`${program.degree} · ${program.school} · ${program.years}. Grades are shown for completed terms; later terms are planned.`}
        title="Courses"
      >
        <dl aria-label="Grade summary" className="gpa-strip" data-reveal>
          {gpaStats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
              <span>{stat.detail}</span>
            </div>
          ))}
        </dl>

        <BentoGrid className="courses-bento">
          {terms.map((entry) => {
            const termGrade = formatTermGrade(entry);
            return (
              <BentoCard
                className={`term-card ${entry.status}`}
                col={3}
                key={entry.id}
              >
                <div className="term-card-head">
                  <h3 className="bento-title">{entry.term}</h3>
                  <div className="term-meta">
                    {entry.coop ? (
                      <span className="term-tag coop">co-op</span>
                    ) : null}
                    <span className={`term-tag ${entry.status}`}>
                      {entry.status}
                    </span>
                    {entry.status === "completed" && termGrade ? (
                      <span className="term-grade">{termGrade}</span>
                    ) : null}
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
                      {typeof course.grade === "number" ? (
                        <span className={`grade-pill ${gradeBand(course.grade)}`}>
                          {course.grade}
                        </span>
                      ) : (
                        <span className="grade-pill pending">
                          {entry.status === "completed" ? "CR" : "—"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </BentoCard>
            );
          })}
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
