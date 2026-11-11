import type { MetadataRoute } from "next";
import { getActivities, site } from "@/lib/content";
import { hrefOf } from "@/lib/links";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/association/", "/actions/", "/evenements/", "/actualites/", "/rejoindre/", "/contact/", ...getActivities().map(hrefOf)];
  return pages.map((p) => ({ url: site.url + p }));
}
