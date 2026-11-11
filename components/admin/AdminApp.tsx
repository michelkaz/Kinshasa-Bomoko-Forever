"use client";
/**
 * Espace d'administration SIMULÉ. Les contenus publics (actions, actualités, photos) sont les vrais contenus sourcés ;
 * les demandes, adhésions, membres et utilisateurs sont des données de démonstration, toujours badgées.
 * Les modifications vivent dans le navigateur (localStorage) et ne sont jamais envoyées.
 */
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Act = { slug: string; title: string; domain: string; type: string; isEvent: boolean; eventDate: string | null; eventDateLabel: string; publishedLabel: string; publish: boolean; cover: string | null; nPhotos: number; toConfirm: string[] };
type News = { slug: string; title: string; kind: string; published: string; publishedLabel: string; summary: string; publish: boolean };
type Ph = { id: string; event: string; alt: string; credit: string; published: string; minors: boolean; authorization: string };
type Props = { activities: Act[]; news: News[]; photos: Ph[]; home: Record<string, string>; contact: { siege: string }; facebook: string };

const STAGES = ["Brouillon", "À valider", "Publié", "Archivé"] as const;
type Stage = (typeof STAGES)[number];
type Role = "Administrateur" | "Responsable éditorial" | "Contributeur" | "Secrétariat";
const CAN: Record<Role, string[]> = {
  Administrateur: ["dashboard", "pages", "actions", "news", "media", "requests", "members", "team", "users", "settings"],
  "Responsable éditorial": ["dashboard", "pages", "actions", "news", "media"],
  Contributeur: ["dashboard", "news", "media"],
  Secrétariat: ["dashboard", "requests", "members", "team"],
};
const NAV: { id: string; label: string }[] = [
  { id: "dashboard", label: "Tableau de bord" },
  { id: "pages", label: "Pages" },
  { id: "actions", label: "Actions et événements" },
  { id: "news", label: "Actualités" },
  { id: "media", label: "Médiathèque" },
  { id: "requests", label: "Demandes" },
  { id: "members", label: "Adhésions et bénévolat" },
  { id: "team", label: "Équipe et partenaires" },
  { id: "users", label: "Utilisateurs et rôles" },
  { id: "settings", label: "Paramètres" },
];

const DEMO_REQUESTS = [
  { id: 1, nom: "Personne Exemple A", type: "Contact", msg: "Question sur les horaires (donnée fictive).", date: "Il y a 2 h", owner: "", status: "À traiter" },
  { id: 2, nom: "Organisation Exemple B", type: "Partenariat", msg: "Proposition de soutien (donnée fictive).", date: "Hier", owner: "", status: "À traiter" },
  { id: 3, nom: "Personne Exemple C", type: "Contact", msg: "Demande de statuts (donnée fictive).", date: "Il y a 3 j", owner: "Secrétariat (fictif)", status: "En cours" },
  { id: 4, nom: "Organisation Exemple D", type: "Partenariat", msg: "Prise de contact (donnée fictive).", date: "Il y a 6 j", owner: "Secrétariat (fictif)", status: "Clôturée" },
];
const DEMO_MEMBERS = [
  { id: 1, nom: "Personne Exemple E", kind: "Adhésion", com: "Kingasani", mot: "Je veux participer aux activités (fictif).", date: "Il y a 1 j", status: "À examiner", traite: "" },
  { id: 2, nom: "Personne Exemple F", kind: "Bénévolat", com: "Masina", mot: "Disponible le week-end (fictif).", date: "Il y a 2 j", status: "À examiner", traite: "" },
  { id: 3, nom: "Personne Exemple G", kind: "Adhésion", com: "Lukunga", mot: "Contact via un ami (fictif).", date: "Il y a 5 j", status: "Acceptée", traite: "6 nov. 2026" },
  { id: 4, nom: "Personne Exemple H", kind: "Bénévolat", com: "Kimbanseke", mot: "Aide à l'organisation (fictif).", date: "Il y a 8 j", status: "Refusée", traite: "3 nov. 2026" },
];
const DEMO_USERS = [
  { id: 1, nom: "Utilisateur Exemple 1", mail: "admin@exemple.test", role: "Administrateur" as Role },
  { id: 2, nom: "Utilisateur Exemple 2", mail: "editeur@exemple.test", role: "Responsable éditorial" as Role },
  { id: 3, nom: "Utilisateur Exemple 3", mail: "contrib@exemple.test", role: "Contributeur" as Role },
  { id: 4, nom: "Utilisateur Exemple 4", mail: "secretariat@exemple.test", role: "Secrétariat" as Role },
];
const TEAM = [
  { id: 1, nom: "Me Ephraïm Mpanda", role: "Initiateur", demo: false },
  { id: 2, nom: "Cellule de communication", role: "Cellule", demo: false },
  { id: 3, nom: "Fédération Congolaise de Football Association (FECOFA)", role: "Partenaire (Play Off 2025)", demo: false },
  { id: 4, nom: "Télé 50 · Bosolo TV · Kelbull Mag", role: "Médias cités", demo: false },
];

function useStore<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    try {
      const s = localStorage.getItem("kbf-admin-" + key);
      if (s) setV(JSON.parse(s));
    } catch {}
  }, [key]);
  const set = (n: T | ((p: T) => T)) =>
    setV((p) => {
      const nv = typeof n === "function" ? (n as (p: T) => T)(p) : n;
      try {
        localStorage.setItem("kbf-admin-" + key, JSON.stringify(nv));
      } catch {}
      return nv;
    });
  return [v, set] as const;
}

const Demo = () => <span className="ad-demo">Donnée de démonstration</span>;

export default function AdminApp(props: Props) {
  const [role, setRole] = useStore<Role | null>("role", null);
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState<string | null>(null);
  const [acts, setActs] = useStore<Act[]>("acts", props.activities);
  const [news, setNews] = useStore<(News & { stage: Stage; history: string[] })[]>(
    "news",
    props.news.map((n) => ({ ...n, stage: (n.publish ? "Publié" : "Brouillon") as Stage, history: [n.publish ? "Publié (contenu importé)" : "Brouillon importé"] })),
  );
  const [photos, setPhotos] = useStore<(Ph & { caption: string; ok: boolean })[]>("photos", props.photos.map((p) => ({ ...p, caption: p.alt, ok: false })));
  const [reqs, setReqs] = useStore("reqs", DEMO_REQUESTS);
  const [mem, setMem] = useStore("mem", DEMO_MEMBERS);
  const [users, setUsers] = useStore("users", DEMO_USERS);
  const [team, setTeam] = useStore("team", TEAM.map((t) => ({ ...t, logoOk: false })));
  const [home, setHome] = useStore("home", { ...props.home });
  const [settings, setSettings] = useStore("settings", { whatsapp: "", facebook: props.facebook, notif: "", instagram: "" });

  const say = (t: string) => {
    setToast(t);
    setTimeout(() => setToast(null), 2200);
  };

  if (!role) return <Login onEnter={(r) => setRole(r)} />;
  const allowed = CAN[role];
  const cur = allowed.includes(tab) ? tab : "dashboard";

  return (
    <div className="ad">
      <style>{CSS}</style>
      <aside className="ad-side" aria-label="Administration">
        <Link href="/" className="ad-logo" aria-label="Retour au site public">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/kbf-logo.png" alt="Logo Kinshasa Bomoko Forever" height={36} />
        </Link>
        {NAV.filter((n) => allowed.includes(n.id)).map((n) => (
          <button key={n.id} aria-current={cur === n.id ? "page" : undefined} onClick={() => setTab(n.id)}>{n.label}</button>
        ))}
        <div style={{ marginTop: "auto", fontSize: 12, color: "#8fa2e0", padding: "10px 12px" }}>
          Connecté : {role}
          <br />
          <button className="ad-link" onClick={() => setRole(null)}>Se déconnecter</button>
        </div>
      </aside>
      <div className="ad-main">
        <header className="ad-top">
          <h1>{NAV.find((n) => n.id === cur)?.label}</h1>
          <span className="ad-demo big">Mode démonstration : rien n'est envoyé</span>
        </header>
        <AnimatePresence mode="wait">
          <m.div key={cur} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {cur === "dashboard" && <Dashboard acts={acts} news={news} reqs={reqs} mem={mem} go={setTab} />}
            {cur === "pages" && <Pages home={home} setHome={setHome} contact={props.contact} say={say} />}
            {cur === "actions" && <Actions acts={acts} setActs={setActs} say={say} />}
            {cur === "news" && <NewsAdmin news={news} setNews={setNews} say={say} />}
            {cur === "media" && <Media photos={photos} setPhotos={setPhotos} say={say} />}
            {cur === "requests" && <Requests reqs={reqs} setReqs={setReqs} say={say} />}
            {cur === "members" && <Members mem={mem} setMem={setMem} say={say} />}
            {cur === "team" && <Team team={team} setTeam={setTeam} say={say} />}
            {cur === "users" && <Users users={users} setUsers={setUsers} say={say} />}
            {cur === "settings" && <Settings s={settings} set={setSettings} say={say} />}
          </m.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {toast && (
          <m.div role="status" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="ad-toast">{toast}</m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function Login({ onEnter }: { onEnter: (r: Role) => void }) {
  const [r, setR] = useState<Role>("Administrateur");
  return (
    <div className="ad-login">
      <style>{CSS}</style>
      <m.form initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} onSubmit={(e) => { e.preventDefault(); onEnter(r); }} className="ad-card" style={{ maxWidth: 460, width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo/kbf-logo.png" alt="Logo Kinshasa Bomoko Forever" height={48} style={{ height: 48, width: "auto" }} />
        <h1 className="ad-h">Espace d'administration</h1>
        <p className="ad-demo big">Démonstration : aucun compte réel</p>
        <label htmlFor="lg-mail">Courriel</label>
        <input id="lg-mail" defaultValue="demo@exemple.test" />
        <label htmlFor="lg-pass">Mot de passe</label>
        <input id="lg-pass" type="password" defaultValue="demonstration" />
        <label htmlFor="lg-role">Se connecter en tant que</label>
        <select id="lg-role" value={r} onChange={(e) => setR(e.target.value as Role)}>
          {(Object.keys(CAN) as Role[]).map((x) => <option key={x}>{x}</option>)}
        </select>
        <button className="btn btn-red" type="submit" style={{ width: "100%" }}>Entrer</button>
        <Link href="/" className="ad-link" style={{ textAlign: "center" }}>Retour au site public</Link>
      </m.form>
    </div>
  );
}

function Dashboard({ acts, news, reqs, mem, go }: { acts: Act[]; news: { title: string; stage: Stage; publishedLabel: string }[]; reqs: typeof DEMO_REQUESTS; mem: typeof DEMO_MEMBERS; go: (t: string) => void }) {
  const pending = reqs.filter((r) => r.status === "À traiter").length + mem.filter((r) => r.status === "À examiner").length;
  const drafts = news.filter((n) => n.stage === "Brouillon" || n.stage === "À valider").length;
  const upcoming = acts.filter((a) => a.isEvent && a.eventDate && a.eventDate >= "2026-11-10").length;
  const bars = [3, 5, 4, 8, 6, 4];
  return (
    <>
      <div className="ad-kpis">
        <button className="ad-kpi al" onClick={() => go("requests")}><span>Demandes à traiter <Demo /></span><b>{pending}</b></button>
        <button className="ad-kpi" onClick={() => go("news")}><span>Brouillons et à valider</span><b>{drafts}</b></button>
        <div className="ad-kpi"><span>Actualités publiées</span><b>{news.filter((n) => n.stage === "Publié").length}</b></div>
        <div className="ad-kpi"><span>Événements à venir</span><b>{upcoming}</b></div>
      </div>
      <div className="ad-cols">
        <section className="ad-card">
          <h2 className="ad-h2">Activité par mois <Demo /></h2>
          <div className="ad-bars" role="img" aria-label="Graphique de démonstration">
            {bars.map((h, i) => <m.span key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 90 }} style={{ height: h * 11 + "%", background: i % 2 ? "var(--color-blue)" : "var(--color-red)" }} />)}
          </div>
          <div className="ad-bar-l">{["Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov."].map((x) => <span key={x}>{x}</span>)}</div>
        </section>
        <section className="ad-card">
          <h2 className="ad-h2">Prochains événements</h2>
          {upcoming === 0 ? <p className="ad-muted">Aucun événement à venir : l'accueil affiche « Prochain rendez-vous bientôt annoncé ».</p> : null}
          <button className="btn btn-red" style={{ marginTop: 12 }} onClick={() => go("actions")}>Créer un événement</button>
        </section>
      </div>
      <section className="ad-card" style={{ marginTop: 14 }}>
        <h2 className="ad-h2">Dernières publications</h2>
        <table className="ad-t"><tbody>
          {news.slice(0, 5).map((n) => <tr key={n.title}><td>{n.title}</td><td>{n.publishedLabel}</td><td><Pill s={n.stage} /></td></tr>)}
        </tbody></table>
      </section>
    </>
  );
}

const Pill = ({ s }: { s: string }) => {
  const c: Record<string, string> = { Publié: "ok", "À valider": "warn", Brouillon: "mute", Archivé: "mute", "À traiter": "warn", "En cours": "info", Clôturée: "ok", "À examiner": "warn", Acceptée: "ok", Refusée: "bad", Archivée: "mute" };
  return <span className={"ad-pill " + (c[s] ?? "mute")}>{s}</span>;
};

function Pages({ home, setHome, contact, say }: { home: Record<string, string>; setHome: (v: Record<string, string>) => void; contact: { siege: string }; say: (t: string) => void }) {
  const [h, setH] = useState(home);
  const f = (k: string, label: string, area = false) => (
    <div className="ad-f"><label htmlFor={"pg-" + k}>{label}</label>{area ? <textarea id={"pg-" + k} rows={4} value={h[k] ?? ""} onChange={(e) => setH({ ...h, [k]: e.target.value })} /> : <input id={"pg-" + k} value={h[k] ?? ""} onChange={(e) => setH({ ...h, [k]: e.target.value })} />}</div>
  );
  return (
    <div className="ad-cols">
      <section className="ad-card">
        <h2 className="ad-h2">Page d'accueil</h2>
        {f("heroKicker", "Petit titre")}{f("heroTitle", "Titre")}{f("heroSub", "Phrase d'accroche", true)}{f("introTitle", "Titre de présentation")}{f("introText", "Texte de présentation", true)}
        <div className="ad-f"><label htmlFor="pg-siege">Siège</label><input id="pg-siege" defaultValue={contact.siege} /></div>
        <button className="btn btn-red" onClick={() => { setHome(h); say("Textes enregistrés (démonstration)"); }}>Enregistrer</button>
      </section>
      <section className="ad-card" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <h2 className="ad-h2">Aperçu</h2>
        <div style={{ background: "var(--color-blue)", color: "#fff", borderRadius: 28, padding: 24 }}>
          <p className="lab" style={{ color: "var(--color-pale)" }}>{h.heroKicker}</p>
          <p className="disp" style={{ fontSize: 44, marginTop: 8 }}>{h.heroTitle}</p>
          <p style={{ marginTop: 10, color: "#e6ecff" }}>{h.heroSub}</p>
        </div>
      </section>
    </div>
  );
}

function Actions({ acts, setActs, say }: { acts: Act[]; setActs: (v: Act[] | ((p: Act[]) => Act[])) => void; say: (t: string) => void }) {
  const [form, setForm] = useState({ title: "", date: "", domain: "sport" });
  const today = "2026-11-10";
  const status = (a: Act) => (!a.publish ? "Brouillon" : a.eventDate && a.eventDate < today ? "Archivée" : "Publié");
  return (
    <>
      <section className="ad-card">
        <h2 className="ad-h2">Créer une action ou un événement</h2>
        <form className="ad-row" onSubmit={(e) => { e.preventDefault(); if (!form.title.trim()) return say("Indiquez un titre"); setActs((p) => [{ slug: "nouveau-" + p.length, title: form.title, domain: form.domain, type: "Événement", isEvent: true, eventDate: form.date || null, eventDateLabel: form.date || "Date à confirmer", publishedLabel: "—", publish: false, cover: null, nPhotos: 0, toConfirm: ["Tout le contenu"] }, ...p]); setForm({ title: "", date: "", domain: "sport" }); say("Brouillon créé"); }}>
          <div className="ad-f" style={{ flex: 2 }}><label htmlFor="ac-t">Titre</label><input id="ac-t" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="ad-f"><label htmlFor="ac-d">Date de l'événement</label><input id="ac-d" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
          <div className="ad-f"><label htmlFor="ac-g">Domaine</label><select id="ac-g" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}><option value="sport">Sport et jeunesse</option><option value="solidarite">Solidarité et éducation</option><option value="citoyen">Vie citoyenne</option></select></div>
          <button className="btn btn-blue" type="submit" style={{ alignSelf: "end" }}>Créer le brouillon</button>
        </form>
        <p className="ad-muted" style={{ marginTop: 8 }}>Un événement passe automatiquement en « Archivée » le lendemain de sa date.</p>
      </section>
      <section className="ad-card" style={{ marginTop: 14 }}>
        <div className="ad-scroll"><table className="ad-t"><thead><tr><th>Titre</th><th>Type</th><th>Date</th><th>Photos</th><th>Statut</th><th>À confirmer</th><th /></tr></thead><tbody>
          {acts.map((a) => (
            <tr key={a.slug}><td><b>{a.title}</b></td><td>{a.type}</td><td>{a.eventDateLabel}</td><td>{a.nPhotos}</td><td><Pill s={status(a)} /></td><td className="ad-muted">{a.toConfirm.length ? a.toConfirm.length + " point(s)" : "—"}</td>
              <td><button className="ad-btn" onClick={() => { setActs((p) => p.map((x) => (x.slug === a.slug ? { ...x, publish: !x.publish } : x))); say(a.publish ? "Repassé en brouillon" : "Publié (démonstration)"); }}>{a.publish ? "Dépublier" : "Publier"}</button></td></tr>
          ))}
        </tbody></table></div>
      </section>
    </>
  );
}

function NewsAdmin({ news, setNews, say }: { news: (News & { stage: Stage; history: string[] })[]; setNews: (v: (News & { stage: Stage; history: string[] })[] | ((p: (News & { stage: Stage; history: string[] })[]) => (News & { stage: Stage; history: string[] })[])) => void; say: (t: string) => void }) {
  const [sel, setSel] = useState(news[0]?.slug ?? "");
  const n = news.find((x) => x.slug === sel) ?? news[0];
  const upd = (patch: Partial<typeof n>, log?: string) => setNews((p) => p.map((x) => (x.slug === n.slug ? { ...x, ...patch, history: log ? [log, ...x.history] : x.history } : x)));
  if (!n) return null;
  const idx = STAGES.indexOf(n.stage);
  const move = (d: number) => {
    const ns = STAGES[Math.max(0, Math.min(3, idx + d))];
    if (ns === n.stage) return;
    upd({ stage: ns, publish: ns === "Publié" }, ns === "Brouillon" ? "Renvoyé en brouillon" : `Passé en « ${ns} »`);
    say(ns === "Publié" ? "Publié" : `Passé en « ${ns} »`);
  };
  return (
    <div className="ad-news">
      <section className="ad-card" style={{ alignSelf: "start" }}>
        <h2 className="ad-h2">Articles</h2>
        <div className="ad-list">
          {news.map((x) => <button key={x.slug} aria-pressed={x.slug === n.slug} onClick={() => setSel(x.slug)}><span>{x.title}</span><Pill s={x.stage} /></button>)}
        </div>
      </section>
      <section className="ad-card">
        <ol className="ad-steps" aria-label="Circuit de publication">
          {STAGES.map((s, i) => <li key={s} className={i === idx ? "on" : i < idx ? "done" : ""}>{s}</li>)}
        </ol>
        <div className="ad-f"><label htmlFor="n-t">Titre</label><input id="n-t" value={n.title} onChange={(e) => upd({ title: e.target.value })} /></div>
        <div className="ad-row">
          <div className="ad-f"><label htmlFor="n-pub">Date de publication</label><input id="n-pub" value={n.publishedLabel} onChange={(e) => upd({ publishedLabel: e.target.value })} /></div>
          <div className="ad-f"><label htmlFor="n-k">Type</label><select id="n-k" value={n.kind} onChange={(e) => upd({ kind: e.target.value })}><option value="compte-rendu">Compte rendu</option><option value="communique">Communiqué</option></select></div>
        </div>
        <p className="ad-muted" style={{ marginTop: -6, marginBottom: 10 }}>Ne confondez pas la date de publication et la date de l'événement.</p>
        <div className="ad-f"><label htmlFor="n-s">Texte</label><textarea id="n-s" rows={6} value={n.summary} onChange={(e) => upd({ summary: e.target.value })} /></div>
        <div className="ad-prev"><p className="lab" style={{ color: "var(--color-red)" }}>Aperçu · {n.publishedLabel}</p><p className="disp" style={{ fontSize: 34, color: "var(--color-blue)", margin: "6px 0" }}>{n.title}</p><p>{n.summary}</p></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
          <button className="btn btn-ghost-dark" onClick={() => (idx === 0 ? say("Brouillon enregistré") : move(-1))}>{idx === 0 ? "Enregistrer le brouillon" : "Revenir en arrière"}</button>
          <button className="btn btn-red" disabled={idx === 3} onClick={() => move(1)}>{["Envoyer pour validation", "Valider et publier", "Archiver", "Archivée"][idx]}</button>
        </div>
        <h3 className="ad-h2" style={{ marginTop: 22 }}>Historique</h3>
        <ul className="ad-hist">{n.history.map((h, i) => <li key={i}>{h}</li>)}</ul>
      </section>
    </div>
  );
}

function Media({ photos, setPhotos, say }: { photos: (Ph & { caption: string; ok: boolean })[]; setPhotos: (v: (Ph & { caption: string; ok: boolean })[] | ((p: (Ph & { caption: string; ok: boolean })[]) => (Ph & { caption: string; ok: boolean })[])) => void; say: (t: string) => void }) {
  const [sel, setSel] = useState(photos[0]?.id);
  const [ev, setEv] = useState("all");
  const events = useMemo(() => [...new Set(photos.map((p) => p.event))], [photos]);
  const list = ev === "all" ? photos : photos.filter((p) => p.event === ev);
  const p = photos.find((x) => x.id === sel) ?? photos[0];
  const upd = (patch: Partial<typeof p>) => setPhotos((q) => q.map((x) => (x.id === p.id ? { ...x, ...patch } : x)));
  return (
    <div className="ad-news" style={{ gridTemplateColumns: "minmax(0,1fr) 340px" }}>
      <section>
        <div className="ad-drop">Déposez des photos ici ou choisissez des fichiers. L'envoi est simulé dans cette démonstration.</div>
        <div className="ad-chips">
          {["all", ...events].map((e) => <button key={e} aria-pressed={ev === e} onClick={() => setEv(e)}>{e === "all" ? "Toutes" : e}</button>)}
        </div>
        <p className="ad-muted" style={{ margin: "8px 0" }}>{list.length} photos · {photos.filter((x) => x.ok).length} autorisations confirmées</p>
        <div className="ad-grid">
          {list.map((x) => (
            <button key={x.id} className={"ad-th" + (x.id === p.id ? " on" : "")} onClick={() => setSel(x.id)} aria-label={x.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/img/${x.id}-480.webp`} alt="" loading="lazy" />
              <span className={x.ok ? "ok" : "no"}>{x.ok ? "Autorisée" : x.minors ? "Mineurs ?" : "À confirmer"}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="ad-card" style={{ position: "sticky", top: 16, alignSelf: "start" }}>
        <h2 className="ad-h2">Détails de la photo</h2>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/img/${p.id}-480.webp`} alt={p.alt} style={{ width: "100%", borderRadius: 20, marginBottom: 12 }} />
        <div className="ad-f"><label htmlFor="m-c">Légende</label><textarea id="m-c" rows={2} value={p.caption} onChange={(e) => upd({ caption: e.target.value })} /></div>
        <div className="ad-f"><label htmlFor="m-a">Texte alternatif</label><textarea id="m-a" rows={3} value={p.alt} onChange={(e) => upd({ alt: e.target.value })} /></div>
        <div className="ad-f"><label htmlFor="m-cr">Crédit</label><input id="m-cr" value={p.credit} onChange={(e) => upd({ credit: e.target.value })} /></div>
        <div className="ad-check"><input id="m-ok" type="checkbox" checked={p.ok} onChange={(e) => upd({ ok: e.target.checked })} /><label htmlFor="m-ok"><b>Autorisation de diffusion confirmée</b><br /><span className="ad-muted">À cocher après accord écrit{p.minors ? ", surtout : des mineurs sont probablement reconnaissables" : ""}.</span></label></div>
        <button className="btn btn-red" style={{ width: "100%" }} onClick={() => say("Photo enregistrée")}>Enregistrer la photo</button>
      </section>
    </div>
  );
}

function Requests({ reqs, setReqs, say }: { reqs: typeof DEMO_REQUESTS; setReqs: (v: typeof DEMO_REQUESTS) => void; say: (t: string) => void }) {
  const set = (id: number, patch: Partial<(typeof DEMO_REQUESTS)[number]>) => setReqs(reqs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return (
    <section className="ad-card">
      <p><Demo /> <span className="ad-muted">Noms et messages fictifs.</span></p>
      <div className="ad-scroll"><table className="ad-t"><thead><tr><th>Nom</th><th>Type</th><th>Message</th><th>Reçue</th><th>Affectée à</th><th>Statut</th><th /></tr></thead><tbody>
        {reqs.map((r) => (
          <tr key={r.id}><td><b>{r.nom}</b></td><td>{r.type}</td><td>{r.msg}</td><td>{r.date}</td>
            <td><select aria-label={"Affecter " + r.nom} value={r.owner} onChange={(e) => { set(r.id, { owner: e.target.value, status: r.status === "À traiter" ? "En cours" : r.status }); say("Demande affectée"); }}><option value="">Non affectée</option><option>Secrétariat (fictif)</option><option>Cellule de communication (fictif)</option></select></td>
            <td><Pill s={r.status} /></td>
            <td><button className="ad-btn" onClick={() => { set(r.id, { status: r.status === "Clôturée" ? "En cours" : "Clôturée" }); say(r.status === "Clôturée" ? "Demande rouverte" : "Demande clôturée"); }}>{r.status === "Clôturée" ? "Rouvrir" : "Clôturer"}</button></td></tr>
        ))}
      </tbody></table></div>
    </section>
  );
}

function Members({ mem, setMem, say }: { mem: typeof DEMO_MEMBERS; setMem: (v: typeof DEMO_MEMBERS) => void; say: (t: string) => void }) {
  const set = (id: number, status: string) => { setMem(mem.map((r) => (r.id === id ? { ...r, status, traite: "10 nov. 2026" } : r))); say(`Candidature : ${status.toLowerCase()}`); };
  const csv = () => {
    const rows = [["Nom", "Type", "Commune", "Statut", "Date de traitement"], ...mem.map((r) => [r.nom, r.kind, r.com, r.status, r.traite])];
    const blob = new Blob(["﻿" + rows.map((r) => r.map((c) => `"${c}"`).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "adhesions-demonstration.csv";
    a.click();
    say("Export CSV généré (données fictives)");
  };
  return (
    <section className="ad-card">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}><p><Demo /> <span className="ad-muted">Aucune candidature n'est validée automatiquement.</span></p><button className="btn btn-blue" onClick={csv}>Exporter en CSV</button></div>
      <div className="ad-scroll"><table className="ad-t"><thead><tr><th>Nom</th><th>Type</th><th>Commune</th><th>Motivation</th><th>Statut</th><th>Traitée le</th><th /></tr></thead><tbody>
        {mem.map((r) => (
          <tr key={r.id}><td><b>{r.nom}</b></td><td>{r.kind}</td><td>{r.com}</td><td>{r.mot}</td><td><Pill s={r.status} /></td><td>{r.traite || "—"}</td>
            <td style={{ whiteSpace: "nowrap" }}><button className="ad-btn" onClick={() => set(r.id, "Acceptée")}>Accepter</button> <button className="ad-btn" onClick={() => set(r.id, "Refusée")}>Refuser</button></td></tr>
        ))}
      </tbody></table></div>
    </section>
  );
}

function Team({ team, setTeam, say }: { team: (typeof TEAM[number] & { logoOk: boolean })[]; setTeam: (v: (typeof TEAM[number] & { logoOk: boolean })[]) => void; say: (t: string) => void }) {
  return (
    <div className="ad-grid3">
      {team.map((t) => (
        <section key={t.id} className="ad-card">
          <h2 className="ad-h2">{t.nom}</h2>
          <p className="ad-muted">{t.role}</p>
          <div className="ad-f" style={{ marginTop: 10 }}><label htmlFor={"t-f" + t.id}>Fonction</label><input id={"t-f" + t.id} defaultValue={t.role} /></div>
          <div className="ad-check"><input id={"t-l" + t.id} type="checkbox" checked={t.logoOk} onChange={(e) => { setTeam(team.map((x) => (x.id === t.id ? { ...x, logoOk: e.target.checked } : x))); say("Autorisation du logo mise à jour"); }} /><label htmlFor={"t-l" + t.id}>Logo ou photo autorisé à l'affichage</label></div>
        </section>
      ))}
      <section className="ad-card" style={{ borderStyle: "dashed" }}><h2 className="ad-h2">Ajouter une fiche</h2><p className="ad-muted">Bureau, cellules, partenaires : à renseigner avec l'association.</p><button className="btn btn-blue" style={{ marginTop: 10 }} onClick={() => say("Fiche ajoutée (démonstration)")}>Ajouter</button></section>
    </div>
  );
}

function Users({ users, setUsers, say }: { users: typeof DEMO_USERS; setUsers: (v: typeof DEMO_USERS) => void; say: (t: string) => void }) {
  return (
    <section className="ad-card">
      <p><Demo /></p>
      <div className="ad-scroll"><table className="ad-t"><thead><tr><th>Nom</th><th>Courriel</th><th>Rôle</th></tr></thead><tbody>
        {users.map((u) => <tr key={u.id}><td><b>{u.nom}</b></td><td>{u.mail}</td><td><select aria-label={"Rôle de " + u.nom} value={u.role} onChange={(e) => { setUsers(users.map((x) => (x.id === u.id ? { ...x, role: e.target.value as Role } : x))); say("Rôle mis à jour"); }}>{(Object.keys(CAN) as Role[]).map((r) => <option key={r}>{r}</option>)}</select></td></tr>)}
      </tbody></table></div>
      <h2 className="ad-h2" style={{ marginTop: 22 }}>Ce que chaque rôle voit</h2>
      <div className="ad-grid3">{(Object.keys(CAN) as Role[]).map((r) => <div key={r} className="ad-prev"><b>{r}</b><p className="ad-muted">{CAN[r].map((id) => NAV.find((n) => n.id === id)?.label).join(", ")}</p></div>)}</div>
    </section>
  );
}

function Settings({ s, set, say }: { s: { whatsapp: string; facebook: string; notif: string; instagram: string }; set: (v: typeof s) => void; say: (t: string) => void }) {
  const [v, setV] = useState(s);
  const f = (k: keyof typeof s, label: string, ph = "") => <div className="ad-f"><label htmlFor={"s-" + k}>{label}</label><input id={"s-" + k} placeholder={ph} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></div>;
  return (
    <section className="ad-card" style={{ maxWidth: 640 }}>
      <div className="ad-f"><label>Logo</label><div style={{ background: "#fff", border: "1px solid var(--color-line)", borderRadius: 20, padding: 14, display: "inline-flex" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/logo/kbf-logo.png" alt="Logo actuel" height={54} style={{ height: 54, width: "auto" }} /></div><span className="ad-muted">Fichier fourni, à remplacer par une version haute définition ou vectorielle.</span></div>
      {f("whatsapp", "Lien WhatsApp", "https://wa.me/… (à confirmer)")}{f("facebook", "Page Facebook")}{f("instagram", "Autre réseau")}{f("notif", "Destinataires des notifications (courriels séparés par une virgule)", "nom@exemple.test")}
      <button className="btn btn-red" onClick={() => { set(v); say("Paramètres enregistrés (démonstration)"); }}>Enregistrer</button>
    </section>
  );
}

const CSS = `
.ad,.ad-login{font:400 15px/1.5 var(--font-body);color:var(--color-ink);background:#f4f6fb;min-height:100vh}
.ad{display:grid;grid-template-columns:250px minmax(0,1fr)}
.ad-login{display:grid;place-items:center;padding:24px;background:linear-gradient(160deg,var(--color-blue),var(--color-night))}
.ad-side{background:var(--color-blue);color:#fff;padding:18px 12px;display:flex;flex-direction:column;gap:4px;position:sticky;top:0;height:100vh;overflow:auto;border-radius:0 32px 32px 0}
.ad-side>button{text-align:left;background:none;border:0;color:#dce5ff;font:500 15px var(--font-body);padding:11px 14px;border-radius:999px;cursor:pointer;transition:background .2s}
.ad-side>button:hover{background:var(--color-blue-2)}
.ad-side>button[aria-current=page]{background:#fff;color:var(--color-blue);font-weight:700}
.ad-logo{background:#fff;padding:7px 12px;border-radius:999px;display:inline-flex;align-self:flex-start;margin-bottom:12px}
.ad-logo img{height:36px;width:auto}
.ad-link{background:none;border:0;color:var(--color-coral);cursor:pointer;font:600 13px var(--font-body);padding:0;text-decoration:underline}
.ad-main{padding:22px clamp(16px,3vw,36px) 60px;min-width:0}
.ad-top{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:18px}
.ad-top h1{font:800 clamp(34px,4vw,46px)/1 var(--font-display);font-stretch:70%;text-transform:uppercase;color:var(--color-blue);margin:0}
.ad-demo{display:inline-block;background:#fff3c4;color:#5a4500;font:600 12px var(--font-body);padding:4px 10px;border-radius:999px}
.ad-demo.big{font-size:13px;padding:6px 14px}
.ad-card{background:#fff;border:1px solid var(--color-line);border-radius:28px;padding:22px 24px;display:grid;gap:12px;align-content:start}
.ad-h{font:800 32px/1 var(--font-display);font-stretch:70%;text-transform:uppercase;color:var(--color-blue);margin:6px 0}
.ad-h2{font:700 17px var(--font-body);margin:0}
.ad-muted{color:var(--color-slate);font-size:13px}
.ad-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.ad-kpi{background:#fff;border:1px solid var(--color-line);border-radius:28px;padding:18px 22px;text-align:left;font:inherit;display:grid;gap:4px}
button.ad-kpi{cursor:pointer;transition:transform .25s}button.ad-kpi:hover{transform:translateY(-3px)}
.ad-kpi.al{border-left:6px solid var(--color-red)}
.ad-kpi span{color:var(--color-slate);font-size:13px}.ad-kpi b{font:800 44px/1 var(--font-display);font-stretch:75%;color:var(--color-blue)}
.ad-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:14px;margin-top:14px}
.ad-bars{display:flex;align-items:flex-end;gap:10px;height:150px;border-bottom:2px solid var(--color-blue);padding:0 4px}
.ad-bars span{flex:1;border-radius:12px 12px 0 0;transform-origin:50% 100%}
.ad-bar-l{display:flex;gap:10px;font-size:12px;color:var(--color-slate)}.ad-bar-l span{flex:1;text-align:center}
.ad-t{border-collapse:collapse;width:100%;min-width:640px}.ad-t th,.ad-t td{text-align:left;padding:10px 8px;border-bottom:1px solid #e6eaf4;font-size:14px;vertical-align:top}
.ad-t th{font:600 11px var(--font-body);letter-spacing:.1em;text-transform:uppercase;color:var(--color-slate)}
.ad-scroll{overflow-x:auto}
.ad-pill{font:600 12px var(--font-body);padding:3px 10px;border-radius:999px;white-space:nowrap;display:inline-block}
.ad-pill.ok{background:#d6f2e0;color:#0a4d26}.ad-pill.warn{background:#fff3c4;color:#5a4500}.ad-pill.info{background:#dde8ff;color:var(--color-blue)}.ad-pill.mute{background:#eef1f8;color:var(--color-slate)}.ad-pill.bad{background:#fde1e1;color:#7a0000}
.ad-btn{font:600 13px var(--font-body);padding:7px 14px;border:1.5px solid var(--color-blue);background:#fff;color:var(--color-blue);border-radius:999px;cursor:pointer;transition:background .2s,color .2s}
.ad-btn:hover{background:var(--color-blue);color:#fff}
.btn-ghost-dark{border:2px solid var(--color-blue);color:var(--color-blue);background:#fff}
.btn:disabled{opacity:.5;cursor:not-allowed}
.ad-f{display:grid;gap:5px;min-width:0;flex:1}.ad-f label,.ad-card>label,.ad-login label{font-weight:600;font-size:14px}
.ad input,.ad textarea,.ad select,.ad-login input,.ad-login select{font:400 15px var(--font-body);padding:10px 14px;border:2px solid #8e97b5;border-radius:16px;background:#fff;min-height:44px;width:100%}
.ad input:focus,.ad textarea:focus,.ad select:focus{border-color:var(--color-blue)}
.ad input[type=checkbox]{width:22px;height:22px;min-height:0;margin-top:2px;flex:none}
.ad-row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start}
.ad-news{display:grid;grid-template-columns:300px minmax(0,1fr);gap:14px;align-items:start}
.ad-list{display:grid;gap:6px}
.ad-list button{display:flex;justify-content:space-between;gap:8px;align-items:center;text-align:left;border:2px solid transparent;background:#f4f6fb;border-radius:18px;padding:10px 12px;font:inherit;cursor:pointer;font-size:14px}
.ad-list button[aria-pressed=true]{border-color:var(--color-red);background:#fff}
.ad-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;list-style:none;padding:0;margin:0}
.ad-steps li{padding:10px 12px;border-radius:999px;background:#eef1f8;color:var(--color-slate);font-weight:600;text-align:center;font-size:14px}
.ad-steps li.on{background:var(--color-blue);color:#fff}.ad-steps li.done{background:#dde8ff;color:var(--color-blue)}
.ad-prev{background:#f4f6fb;border-radius:22px;padding:16px 18px}
.ad-hist{list-style:none;padding:0;margin:0}.ad-hist li{padding:8px 0;border-bottom:1px solid #e6eaf4;font-size:14px}
.ad-drop{border:2px dashed #8e97b5;border-radius:24px;padding:20px;text-align:center;color:var(--color-slate);background:#fff;margin-bottom:12px}
.ad-chips{display:flex;gap:8px;flex-wrap:wrap}.ad-chips button{border:2px solid var(--color-blue);background:#fff;color:var(--color-blue);border-radius:999px;padding:6px 14px;font:600 13px var(--font-body);cursor:pointer}
.ad-chips button[aria-pressed=true]{background:var(--color-blue);color:#fff}
.ad-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.ad-th{position:relative;padding:0;border:3px solid transparent;border-radius:22px;overflow:hidden;cursor:pointer;aspect-ratio:1;background:#d5dae8}
.ad-th.on{border-color:var(--color-red)}.ad-th img{width:100%;height:100%;object-fit:cover;display:block}
.ad-th span{position:absolute;left:6px;bottom:6px;font:700 11px var(--font-body);padding:2px 8px;border-radius:999px;background:#fff}.ad-th .ok{color:#0a4d26}.ad-th .no{color:#7a0000}
.ad-check{display:flex;gap:10px;align-items:flex-start;background:#eef1f8;border-radius:18px;padding:12px}
.ad-grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.ad-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--color-blue);color:#fff;padding:12px 22px;border-radius:999px;font-weight:600;z-index:200;box-shadow:0 12px 30px rgba(0,15,58,.3)}
.ad-login .ad-card{gap:10px}
@media(max-width:1000px){.ad{grid-template-columns:1fr}.ad-side{position:static;height:auto;flex-direction:row;flex-wrap:wrap;border-radius:0 0 28px 28px}.ad-news{grid-template-columns:1fr!important}}
`;
