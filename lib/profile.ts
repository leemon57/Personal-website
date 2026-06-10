export const profile = {
  name: "Hany Jiang",
  siteUrl: "https://hanyjiang.com",
  email: "hanyjiang@gmail.com",
  location: "Waterloo, Ontario",
  locationLong: "Waterloo, Ontario, Canada",
  school: "University of Waterloo",
  program: "Data Science",
  educationDates: "2024-2028",
  seeking: "WINTER 2027 co-op",
  focus: "Backend, data, and ML-adjacent engineering",
  github: "https://github.com/leemon57",
  linkedin: "https://www.linkedin.com/in/hany-jiang-909250335/",
  resume: "/resume.pdf",
};

export const profileFacts = [
  {
    label: "Based",
    value: profile.location,
  },
  {
    label: "Education",
    value: `${profile.program}, ${profile.school} · ${profile.educationDates}`,
  },
  {
    label: "Seeking",
    value: profile.seeking,
  },
];

export const profileLinks = [
  { href: `mailto:${profile.email}`, label: profile.email },
  { href: profile.github, label: "github" },
  { href: profile.linkedin, label: "linkedin" },
  { href: profile.resume, label: "resume (pdf)" },
];
