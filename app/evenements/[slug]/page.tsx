import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActivityDetail from "@/components/ActivityDetail";
import { getActivities, getActivity, site } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => getActivities({ events: true }).map((a) => ({ slug: a.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getActivity((await params).slug);
  return a ? { title: a.title, description: a.short, openGraph: { images: a.cover ? [`/img/${a.cover}-1200.webp`] : undefined } } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = getActivity((await params).slug);
  if (!a || !a.publish || !a.isEvent) notFound();
  const ld = {
    "@context": "https://schema.org", "@type": "Event", name: a.title, description: a.short,
    startDate: a.eventDate ?? undefined, eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: a.place }, organizer: { "@type": "Organization", name: site.legalName },
  };
  return (
    <>
      <ActivityDetail a={a} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
