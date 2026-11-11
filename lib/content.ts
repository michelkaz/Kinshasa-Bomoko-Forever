import activitiesJson from "@/content/activities.json";
import newsJson from "@/content/news.json";
import photosJson from "@/content/photos.json";
import siteJson from "@/content/site.json";
import mediaJson from "@/content/media.generated.json";

/** Modèle de données proche d'un CMS : chaque contenu porte ses sources et ses champs « à confirmer ». */
export type Domain = "sport" | "citoyen" | "solidarite";

export type Activity = {
  slug: string;
  title: string;
  short: string;
  domain: Domain;
  type: string;
  isEvent: boolean;
  status: "prevue" | "en_cours" | "terminee";
  eventDate: string | null;
  eventDateLabel: string;
  publishedLabel: string;
  place: string;
  intro: string;
  body: string[];
  results: { label: string; value: string; note?: string }[];
  prizes: { rank: string; amount: string }[];
  press: string[];
  cover: string | null;
  photos: string[];
  sources: string[];
  toConfirm: string[];
  publish: boolean;
};

export type News = {
  slug: string;
  title: string;
  kind: "compte-rendu" | "communique";
  published: string;
  publishedLabel: string;
  summary: string;
  activity: string | null;
  publish: boolean;
};

export type PhotoMeta = {
  id: string;
  file: string;
  event: string;
  alt: string;
  credit: string;
  published: string;
  authorization: "confirmee" | "a_confirmer";
  minors: boolean;
  order: number;
};

type MediaInfo = { w: number; h: number; widths: number[]; blur: string };

export const site = siteJson;
export const domains: Record<Domain, string> = {
  sport: "Sport et jeunesse",
  citoyen: "Vie citoyenne",
  solidarite: "Solidarité et éducation",
};

const activities = activitiesJson as unknown as Activity[];
const news = newsJson as unknown as News[];
const photos = photosJson as unknown as PhotoMeta[];
const media = mediaJson as Record<string, MediaInfo>;

const byDateDesc = (a: { eventDate?: string | null; published?: string }, b: typeof a) =>
  String(b.eventDate ?? b.published ?? "").localeCompare(String(a.eventDate ?? a.published ?? ""));

export function getActivities(opts: { events?: boolean } = {}): Activity[] {
  return activities
    .filter((a) => a.publish)
    .filter((a) => (opts.events ? a.isEvent : true))
    .sort(byDateDesc);
}
export function getAllActivities(): Activity[] {
  return [...activities].sort(byDateDesc);
}
export function getActivity(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
export function getNews(includeDrafts = false): News[] {
  return news.filter((n) => includeDrafts || n.publish).sort(byDateDesc);
}
export function getPhoto(id: string): (PhotoMeta & MediaInfo) | undefined {
  const p = photos.find((x) => x.id === id);
  const m = media[id];
  return p && m ? { ...p, ...m } : undefined;
}
export function getPhotos(): PhotoMeta[] {
  return photos;
}
export function getUpcomingEvents(now = new Date("2026-11-09")): Activity[] {
  return getActivities({ events: true }).filter(
    (a) => a.eventDate && new Date(a.eventDate) >= now && a.status !== "terminee",
  );
}
export function yearOf(a: Activity): string {
  return (a.eventDate ?? a.publishedLabel).slice(0, 4).match(/\d{4}/)?.[0] ?? a.publishedLabel.match(/\d{4}/)?.[0] ?? "";
}
