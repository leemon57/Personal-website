import photographyContent from "@/content/photography.json";

/**
 * Photography & Life content adapter.
 *
 * Edit content/photography.json to change the gallery, reading list, playlist,
 * blog notes, and visited places. Photo tiles show a gradient placeholder until
 * you add a `src` (an image under /public, e.g. /photography/lake.jpg). Visited
 * places are plotted on the world map from `lat`/`lon`.
 */
export interface Photo {
  label: string;
  tone?: string;
  src?: string;
}

export interface ReadingItem {
  title: string;
  author?: string;
}

export interface Track {
  title: string;
  artist?: string;
  duration?: string;
}

export interface Playlist {
  title: string;
  tracks: Track[];
}

export interface BlogNote {
  title: string;
  excerpt: string;
}

export interface VisitedPlace {
  name: string;
  lat: number;
  lon: number;
}

interface PhotographyContent {
  intro: string;
  photos: Photo[];
  reading: ReadingItem[];
  playlist: Playlist;
  blog: BlogNote[];
  visited: VisitedPlace[];
}

const data = photographyContent as PhotographyContent;

export const photographyIntro = data.intro;
export const photos = data.photos;
export const readingList = data.reading;
export const playlist = data.playlist;
export const blogNotes = data.blog;
export const visitedPlaces = data.visited;
