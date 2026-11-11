import { getPhoto } from "@/lib/content";

/** Photo du site : AVIF puis WebP, plusieurs largeurs, aperçu flou pendant le chargement. */
export default function Photo({
  id,
  sizes = "100vw",
  priority = false,
  alt,
  className,
  style,
}: {
  id: string;
  sizes?: string;
  priority?: boolean;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const p = getPhoto(id);
  if (!p) return null;
  const set = (ext: string) => p.widths.map((w) => `/img/${id}-${w}.${ext} ${w}w`).join(", ");
  const mid = p.widths.filter((w) => w <= 1200).pop() ?? p.widths[0];
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/img/${id}-${mid}.webp`}
        alt={alt ?? p.alt}
        width={p.w}
        height={p.h}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={className}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundImage: `url(${p.blur})`, backgroundSize: "cover", ...style }}
      />
    </picture>
  );
}
