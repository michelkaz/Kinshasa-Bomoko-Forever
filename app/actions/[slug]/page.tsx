import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ActivityDetail from "@/components/ActivityDetail";
import { getActivities, getActivity } from "@/lib/content";

export const dynamicParams = false;
export const generateStaticParams = () => getActivities().filter((a) => !a.isEvent).map((a) => ({ slug: a.slug }));
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getActivity((await params).slug);
  return a ? { title: a.title, description: a.short, openGraph: { images: a.cover ? [`/img/${a.cover}-1200.webp`] : undefined } } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const a = getActivity((await params).slug);
  if (!a || !a.publish) notFound();
  return <ActivityDetail a={a} />;
}
