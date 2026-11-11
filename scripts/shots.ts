/**
 * Captures de contrôle : npm run shots -- /chemin 360|1440 [nom]
 * Fait défiler la page pour déclencher les animations, puis enregistre plusieurs vues dans captures/.
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const route = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 1440);
const name = process.argv[4] ?? (route === "/" ? "accueil" : route.replace(/\//g, "_"));
const base = process.env.BASE ?? "http://localhost:4173";

async function main() {
  fs.mkdirSync("captures", { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 780 : 900 }, deviceScaleFactor: 1, hasTouch: width < 600, isMobile: width < 600 });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => window.innerHeight);
  const step = Math.round(vh * 0.9);
  const shots: number[] = [];
  for (let y = 0, i = 0; y < H && i < 14; y += step * 2, i++) shots.push(y);
  let k = 0;
  for (const y of shots) {
    // défilement progressif pour laisser les animations au défilement se jouer
    const cur = await page.evaluate(() => window.scrollY);
    for (let s = cur; s <= y; s += 220) {
      await page.evaluate((v) => window.scrollTo(0, v), s);
      await page.waitForTimeout(40);
    }
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(1700);
    await page.screenshot({ path: path.join("captures", `${name}-${width}-${String(k).padStart(2, "0")}.png`) });
    k++;
  }
  console.log(`hauteur ${H}px, ${k} vues, erreurs console : ${errors.length}`);
  errors.slice(0, 5).forEach((e) => console.log(" -", e.slice(0, 200)));
  await browser.close();
}
main();
