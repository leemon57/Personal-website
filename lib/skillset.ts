import skillsetContent from "@/content/skillset.json";

export interface SkillsetGroup {
  area: string;
  items: string[];
}

export const skillsetGroups = skillsetContent as SkillsetGroup[];

export function formatSkillsetGroups(): string {
  return skillsetGroups
    .map((group) => `${group.area}: ${group.items.join(", ")}`)
    .join("; ");
}
