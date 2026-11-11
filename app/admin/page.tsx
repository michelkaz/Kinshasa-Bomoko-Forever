import AdminApp from "@/components/admin/AdminApp";
import { getAllActivities, getNews, getPhotos, site } from "@/lib/content";

export default function Page() {
  const activities = getAllActivities().map((a) => ({ slug: a.slug, title: a.title, domain: a.domain, type: a.type, isEvent: a.isEvent, eventDate: a.eventDate, eventDateLabel: a.eventDateLabel, publishedLabel: a.publishedLabel, publish: a.publish, cover: a.cover, nPhotos: a.photos.length, toConfirm: a.toConfirm }));
  const news = getNews(true).map((n) => ({ slug: n.slug, title: n.title, kind: n.kind, published: n.published, publishedLabel: n.publishedLabel, summary: n.summary, publish: n.publish }));
  const photos = getPhotos().map((p) => ({ id: p.id, event: p.event, alt: p.alt, credit: p.credit, published: p.published, minors: p.minors, authorization: p.authorization }));
  return <AdminApp activities={activities} news={news} photos={photos} home={site.home} contact={site.contact} facebook={site.facebook} />;
}
