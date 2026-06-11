export interface SkillsetGroup {
  area: string;
  items: string[];
}

export const skillsetGroups: SkillsetGroup[] = [
  { area: "Languages", items: ["Python", "C++", "Javascript/TypeScript", "SQL", "DAX"] },
  {
    area: "Backend & cloud",
    items: ["AWS Lambda", "DynamoDB", "AWS SAM", "Docker", "Flask", "WebSockets / REST"],
  },
  {
    area: "Frontend & mobile",
    items: ["Next.js", "React", "React Native / Expo", "Material UI"],
  },
  {
    area: "Data & ML",
    items: [
      "pandas",
      "scikit-learn",
      "TensorFlow / Keras",
      "Power BI",
      "anomaly detection",
      "OpenAI APIs",
    ],
  },
  {
    area: "Practices",
    items: [
      "OOP design patterns",
      "testing (Jest / pytest)",
      "local-first data",
      "resilient services",
    ],
  },
];

export function formatSkillsetGroups(): string {
  return skillsetGroups
    .map((group) => `${group.area}: ${group.items.join(", ")}`)
    .join("; ");
}
