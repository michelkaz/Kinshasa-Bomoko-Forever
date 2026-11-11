/** Pas de rideau de transition : la page s'affiche directement (meilleur score de performance). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
