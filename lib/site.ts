import siteContent from "@/content/site.json";

export interface SiteAddress {
  locality: string;
  region: string;
  country: string;
}

export interface SiteLink {
  href: string;
  label: string;
}

export interface SiteFact {
  label: string;
  value: string;
}

export interface SiteProfile {
  name: string;
  siteUrl: string;
  email: string;
  location: string;
  locationLong: string;
  school: string;
  program: string;
  educationDates: string;
  seeking: string;
  focus: string;
  headline: string;
  summary: string;
  github: string;
  linkedin: string;
  resume: string;
  address: SiteAddress;
  facts: SiteFact[];
  links: SiteLink[];
}

export interface PageContent {
  home: {
    metadataDescription: string;
    introLede: string;
    contact: {
      eyebrow: string;
      title: string;
      body: string;
    };
  };
  about: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    lede: string;
    skillset: {
      heading: string;
      body: string;
    };
    certificates: {
      heading: string;
      emptyText: string;
    };
    featuredWorkHeading: string;
    linksHeading: string;
    knowsAbout: string[];
  };
  contact: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    lede: string;
  };
  projects: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    lede: string;
    sectionLabel: string;
  };
  work: {
    metadataTitle: string;
    metadataDescription: string;
    title: string;
    lede: string;
    sectionLabel: string;
    emptyText: string;
  };
}

export interface AssistantScreening {
  availability: string;
  location: string;
  workAuthorization: string;
  roleType: string;
}

export interface AssistantContent {
  suggestedQuestions: string[];
  initialMessage: string;
  eyebrow: string;
  title: string;
  factSuffix: string;
  inputLabel: string;
  inputPlaceholder: string;
  thinkingStatus: string;
  screening: AssistantScreening;
}

export interface ContactFormContent {
  defaultError: string;
  successMessage: string;
  timeoutMessage: string;
  rolePlaceholder: string;
  submitLabel: string;
  submittingLabel: string;
  directEmailLabel: string;
}

interface SiteContent {
  profile: SiteProfile;
  navigation: SiteLink[];
  pages: PageContent;
  assistant: AssistantContent;
  contactForm: ContactFormContent;
}

const data: SiteContent = siteContent;

export const siteProfile = data.profile;
export const navItems = data.navigation;
export const pageContent = data.pages;
export const assistantContent = data.assistant;
export const contactFormContent = data.contactForm;
