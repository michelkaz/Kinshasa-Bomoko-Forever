/** Vague de séparation entre deux sections : remplace la ligne droite par une courbe qui dérive lentement. */
export default function Wave({
  fill,
  flip = false,
  height = 90,
  variant = 1,
}: {
  fill: string;
  flip?: boolean;
  height?: number;
  variant?: 1 | 2;
}) {
  const d1 = "M0 60 C 150 10, 300 110, 450 60 S 750 10, 900 60 S 1200 110, 1350 60 S 1650 10, 1800 60 V121 H0Z";
  const d2 = "M0 40 C 200 100, 380 0, 600 50 S 1000 100, 1200 40 S 1600 0, 1800 50 V121 H0Z";
  return (
    <div aria-hidden="true" style={{ height, overflow: "hidden", lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined, position: "relative", marginBlock: -1 }}>
      <svg viewBox="0 0 1800 120" preserveAspectRatio="none" style={{ width: "200%", height: "100%", animation: `wave${variant} ${variant === 1 ? 22 : 30}s linear infinite` }}>
        <path d={variant === 1 ? d1 : d2} fill={fill} />
      </svg>
      <style>{`@keyframes wave1{to{transform:translateX(-50%)}}@keyframes wave2{from{transform:translateX(-50%)}to{transform:translateX(0)}}`}</style>
    </div>
  );
}
