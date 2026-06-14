import type { Metadata } from "next";
import { courseNotes, gpaStats, program, type Term, terms } from "@/lib/courses";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Courses",
  description: `Coursework for ${profile.name} — ${program.degree} at the ${program.school}, ${program.years}.`,
  alternates: {
    canonical: "/courses",
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

export default function CoursesPage() {
  return (
    <div className="layout">
      <article className="courses-page">
        <header className="courses-header">
          <p className="caps">Academics</p>
          <h1>Courses</h1>
          <p className="lede muted">
            {program.degree} · {program.school} · {program.years}. Grades are shown for
            completed terms; later terms are planned.
          </p>
        </header>

        <dl className="gpa-strip" data-reveal aria-label="Grade summary">
          {gpaStats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
              <span>{stat.detail}</span>
            </div>
          ))}
        </dl>

        <div className="term-list">
          {terms.map((entry) => {
            const termGrade = formatTermGrade(entry);

            return (
              <section
                aria-labelledby={`term-${entry.id}`}
                className={`term ${entry.status}`}
                data-reveal
                key={entry.id}
              >
                <div className="term-head">
                  <h2 id={`term-${entry.id}`}>{entry.term}</h2>
                  <div className="term-meta">
                    {entry.coop ? <span className="term-tag coop">co-op</span> : null}
                    <span className={`term-tag ${entry.status}`}>{entry.status}</span>
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
              </section>
            );
          })}
        </div>

        <section aria-labelledby="courses-notes" className="courses-notes" data-reveal>
          <p className="caps" id="courses-notes">
            Notes
          </p>
          <ul>
            {courseNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
