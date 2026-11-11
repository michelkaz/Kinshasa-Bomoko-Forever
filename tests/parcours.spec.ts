import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/association/", "/actions/", "/evenements/", "/actualites/", "/rejoindre/", "/contact/", "/mentions-legales/", "/evenements/finale-tournoi-2026/", "/actions/semaine-actions-citoyennes-2025/"];

test("aucune erreur console ni débordement horizontal sur les pages principales", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const r of ROUTES) {
    await page.goto(r, { waitUntil: "networkidle" });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over, `débordement horizontal sur ${r}`).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test("aucun lien interne mort", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const r of ROUTES) {
    await page.goto(r, { waitUntil: "domcontentloaded" });
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => h && seen.add(h));
  }
  for (const h of seen) {
    const res = await request.get(h);
    expect(res.status(), `lien mort : ${h}`).toBeLessThan(400);
  }
});

test("accueil : titre, phrase d'accroche, état vide du prochain événement, navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "La voix de l'unité et de l'espoir." })).toBeVisible();
  await expect(page.getByText("Grandir, partager, s’entraider, s’unir. Ensemble, faisons avancer Kinshasa.")).toBeVisible();
  await expect(page.getByText("Prochain rendez-vous bientôt annoncé")).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) >= 1024) await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
});

test("la barre de navigation change d'apparence après la première section", async ({ page }) => {
  const isMobile = (page.viewportSize()?.width ?? 0) < 1024;
  test.skip(isMobile, "pill complète vérifiée sur bureau");
  await page.goto("/");
  const header = page.locator("header").first();
  const before = await header.evaluate((e) => getComputedStyle(e).backgroundColor);
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.6));
  await page.waitForTimeout(900);
  const after = await header.evaluate((e) => getComputedStyle(e).backgroundColor);
  expect(after).not.toBe(before);
});

test("fiche action : faits, sources et à confirmer", async ({ page }) => {
  await page.goto("/actions/");
  await page.getByRole("link", { name: /semaine d'actions citoyennes/i }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("semaine");
  await expect(page.getByText("Sources")).toBeVisible();
  await expect(page.getByText("À confirmer").first()).toBeVisible();
});

test("fiche événement : score, prix et galerie plein écran", async ({ page }) => {
  await page.goto("/evenements/finale-tournoi-2026/");
  await expect(page.getByRole("img", { name: "JSK 1, Mateta 0" })).toBeVisible();
  await expect(page.getByText("1re place").first()).toBeAttached();
  await page.locator(".gal-btn").first().scrollIntoViewIfNeeded();
  await page.locator(".gal-btn").first().click();
  await expect(page.getByRole("dialog", { name: "Photo agrandie" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Photo agrandie" })).toBeHidden();
});

test("nous rejoindre : erreurs de saisie puis accusé de réception", async ({ page }) => {
  await page.goto("/rejoindre/");
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByText("Indiquez votre nom.")).toBeVisible();
  await expect(page.getByText("Cochez la case pour envoyer votre demande.")).toBeVisible();
  await page.getByLabel("Nom complet").fill("Personne Exemple");
  await page.getByLabel("Téléphone ou WhatsApp").fill("000000000");
  await page.getByLabel(/J’accepte que l’ASBL/).check();
  await page.getByRole("button", { name: "Envoyer ma demande" }).click();
  await expect(page.getByRole("status")).toContainText("votre demande est enregistrée");
  await expect(page.getByRole("status")).toContainText("jamais validée automatiquement");
});

test("admin : connexion simulée puis circuit brouillon → publié", async ({ page }) => {
  await page.goto("/admin/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByText("Démonstration : aucun compte réel")).toBeVisible();
  await page.getByRole("button", { name: "Entrer" }).click();
  await page.getByRole("button", { name: "Actualités" }).click();
  await page.getByRole("button", { name: /Communiqué officiel de l'ASBL/ }).click();
  await expect(page.getByRole("button", { name: "Envoyer pour validation" })).toBeVisible();
  await page.getByRole("button", { name: "Envoyer pour validation" }).click();
  await page.getByRole("button", { name: "Valider et publier" }).click();
  await expect(page.getByText("Passé en « Publié »").first()).toBeVisible();
});
