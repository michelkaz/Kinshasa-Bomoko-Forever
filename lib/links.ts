import type { Activity } from "./content";

/** Les événements ont leur fiche sous /evenements/, les autres actions sous /actions/. */
export const hrefOf = (a: Pick<Activity, "slug" | "isEvent">) => (a.isEvent ? `/evenements/${a.slug}/` : `/actions/${a.slug}/`);

export const whatsappShare = (title: string, path: string, base = "https://kinshasa-bomoko-forever.example") =>
  `https://wa.me/?text=${encodeURIComponent(`${title} ${base}${path}`)}`;
