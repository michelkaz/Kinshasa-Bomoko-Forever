/**
 * Prépare les photos du site à partir de sources/photos/ (les originaux restent intacts).
 * Sortie : public/img/<id>-<largeur>.avif et .webp, plus content/media.generated.json
 * (dimensions, largeurs disponibles, aperçu flou en base64).
 * Usage : npm run images
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(__dirname, "..");
const srcDir = path.join(root, "sources", "photos");
const outDir = path.join(root, "public", "img");
const WIDTHS = [480, 800, 1200, 1600];

type Photo = { id: string; file: string };
const photos: Photo[] = JSON.parse(fs.readFileSync(path.join(root, "content", "photos.json"), "utf8"));
const media: Record<string, { w: number; h: number; widths: number[]; blur: string }> = {};

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const p of photos) {
    const input = path.join(srcDir, p.file);
    if (!fs.existsSync(input)) {
      console.warn("manquant :", p.file);
      continue;
    }
    const base = sharp(input).rotate();
    const meta = await base.metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const widths = WIDTHS.filter((x) => x <= w);
    if (!widths.length || widths[widths.length - 1] < w) widths.push(Math.min(w, 1600));
    for (const width of [...new Set(widths)]) {
      const resized = sharp(input).rotate().resize({ width, withoutEnlargement: true });
      await resized.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(outDir, `${p.id}-${width}.avif`));
      await resized.clone().webp({ quality: 72 }).toFile(path.join(outDir, `${p.id}-${width}.webp`));
    }
    const blurBuf = await sharp(input).rotate().resize({ width: 24 }).jpeg({ quality: 50 }).toBuffer();
    media[p.id] = { w, h, widths: [...new Set(widths)], blur: `data:image/jpeg;base64,${blurBuf.toString("base64")}` };
    process.stdout.write(".");
  }
  fs.writeFileSync(path.join(root, "content", "media.generated.json"), JSON.stringify(media));
  console.log(`\n${Object.keys(media).length} photos prêtes dans public/img`);

  // Logo : copie telle quelle (fichier fourni), jamais retouché.
  const logo = path.join(root, "sources", "logo", "logo-kbf-fourni-par-utilisateur.png");
  fs.mkdirSync(path.join(root, "public", "logo"), { recursive: true });
  const trimmed = await sharp(logo).trim().png({ compressionLevel: 9 }).toBuffer();
  fs.writeFileSync(path.join(root, "public", "logo", "kbf-logo.png"), trimmed);
  // Icône provisoire : symbole seul (arcs et sigle), à valider par l'association.
  const lm = await sharp(logo).metadata();
  const symbol = await sharp(logo)
    .extract({ left: 90, top: 20, width: Math.min(940, (lm.width ?? 1740) - 90), height: Math.min(860, (lm.height ?? 904) - 20) })
    .flatten({ background: "#ffffff" })
    .resize(512, 512, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(root, "app", "icon.png"), symbol);
  console.log("logo et icône provisoire générés");
}
main();
