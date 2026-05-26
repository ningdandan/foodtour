import { useState } from "react";
import { motion } from "motion/react";
import { Check, Lock, X } from "lucide-react";
import { tourContent, type AppChapter, type AppGuide, type AppStop } from "../data/tour-content";
import headerAvatar from "../../avatar.png";

const STICKER_FILTER =
  "drop-shadow(0 0 0 #fff) drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(2px 2px 0 #fff) drop-shadow(-2px 2px 0 #fff) drop-shadow(2px -2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(0 10px 14px rgba(0,0,0,0.26))";

const BASE_X_PATTERN = [182, 268, 172, 96, 192, 254];
const W = 358;
const NODE_SPACING_Y = 118;
const START_Y = 72;

function AbstractMapBg() {
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: "100%", minHeight: 2200, zIndex: 0, pointerEvents: "none" }}
      viewBox="0 0 390 2200"
      preserveAspectRatio="xMidYMin meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="ab-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="ab-blur-sm" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="11" />
        </filter>
      </defs>

      {/* ── SOFT BLOBS (blurred) ── */}
      {/* Coral blob — upper right, Bangkok */}
      <path d="M 370 80 C 430 100 460 180 420 250 C 380 320 290 340 240 290 C 190 240 210 160 260 120 C 300 85 340 62 370 80 Z"
        fill="#FF5722" opacity="0.13" filter="url(#ab-blur)" />
      {/* Amber sweep — upper left */}
      <ellipse cx="60" cy="320" rx="140" ry="110" fill="#FBBF24" opacity="0.14" filter="url(#ab-blur)" />
      {/* Teal — centre Bangkok */}
      <path d="M 200 560 C 270 520 360 550 380 620 C 400 690 340 750 260 750 C 180 750 110 700 120 630 C 130 565 150 595 200 560 Z"
        fill="#0D9488" opacity="0.11" filter="url(#ab-blur)" />
      {/* Purple blob — Saigon zone */}
      <ellipse cx="300" cy="1020" rx="200" ry="165" fill="#7C3AED" opacity="0.11" filter="url(#ab-blur)" />
      {/* Coral — lower Saigon */}
      <ellipse cx="80" cy="1260" rx="150" ry="120" fill="#F97316" opacity="0.1" filter="url(#ab-blur)" />
      {/* Teal — Mumbai upper */}
      <path d="M 330 1460 C 400 1440 440 1510 410 1590 C 380 1670 290 1690 230 1640 C 170 1590 190 1500 250 1470 C 280 1456 310 1470 330 1460 Z"
        fill="#059669" opacity="0.13" filter="url(#ab-blur)" />
      {/* Amber — Mumbai lower */}
      <ellipse cx="110" cy="1820" rx="160" ry="130" fill="#FBBF24" opacity="0.12" filter="url(#ab-blur)" />

      {/* ── ORGANIC LINE STROKES ── */}
      {/* Wavy ribbon 1 — across chapter 1 */}
      <path d="M -10 420 C 60 400 130 445 200 425 C 270 405 340 440 400 420"
        fill="none" stroke="#F97316" strokeWidth="3" opacity="0.14" strokeLinecap="round" />
      {/* Wavy ribbon 2 — chapter 1–2 transition */}
      <path d="M -10 870 C 80 850 160 895 230 870 C 300 848 360 875 400 865"
        fill="none" stroke="#7C3AED" strokeWidth="2.5" opacity="0.13" strokeLinecap="round" />
      {/* Wavy ribbon 3 — chapter 2–3 transition */}
      <path d="M -10 1455 C 70 1432 160 1470 240 1448 C 310 1428 370 1458 400 1445"
        fill="none" stroke="#059669" strokeWidth="2.5" opacity="0.14" strokeLinecap="round" />

      {/* ── CRISP GEOMETRIC RINGS ── */}
      <circle cx="348" cy="130" r="52" fill="none" stroke="#F97316" strokeWidth="2.5" strokeDasharray="6 8" opacity="0.22" />
      <circle cx="348" cy="130" r="70" fill="none" stroke="#F97316" strokeWidth="1"   strokeDasharray="3 10" opacity="0.12" />
      <circle cx="38"  cy="590" r="42" fill="none" stroke="#0D9488" strokeWidth="2"   strokeDasharray="5 7" opacity="0.2"  />
      <circle cx="360" cy="960" r="50" fill="none" stroke="#7C3AED" strokeWidth="2"   strokeDasharray="5 8" opacity="0.18" />
      <circle cx="28"  cy="1420" r="38" fill="none" stroke="#059669" strokeWidth="2"  strokeDasharray="4 7" opacity="0.2"  />
      <circle cx="355" cy="1760" r="44" fill="none" stroke="#F97316" strokeWidth="2"  strokeDasharray="5 7" opacity="0.16" />

      {/* ── SCATTERED DOTS ── */}
      {[
        [355, 310, 5, "#F97316", 0.28], [28, 210, 4, "#FBBF24", 0.32],
        [372, 680, 6, "#0D9488", 0.22], [18, 780, 4, "#7C3AED", 0.26],
        [358, 1140, 5, "#F97316", 0.22], [22, 1080, 7, "#059669", 0.22],
        [362, 1640, 5, "#FBBF24", 0.28], [16, 1560, 4, "#F97316", 0.22],
        [195, 490, 4, "#F97316", 0.18], [195, 1330, 5, "#7C3AED", 0.18],
      ].map(([cx, cy, r, fill, op], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={fill as string} opacity={op} />
      ))}

      {/* ── PLUS MARKS ── */}
      {[
        [68, 175, "#F97316"], [322, 530, "#0D9488"],
        [55, 1170, "#7C3AED"], [335, 1800, "#059669"],
      ].map(([cx, cy, col], i) => (
        <g key={i} opacity="0.24">
          <line x1={+cx - 8} y1={+cy} x2={+cx + 8} y2={+cy} stroke={col as string} strokeWidth="2.5" strokeLinecap="round" />
          <line x1={+cx} y1={+cy - 8} x2={+cx} y2={+cy + 8} stroke={col as string} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}

      {/* ── ABSTRACT ORGANIC BLOB OUTLINES (crisp, no blur) ── */}
      <path d="M 15 950 C 40 920 90 915 110 945 C 130 975 115 1010 85 1020 C 55 1030 20 1010 15 980 Z"
        fill="#7C3AED" opacity="0.1" />
      <path d="M 270 380 C 295 360 330 370 340 395 C 350 420 330 445 305 440 C 280 435 260 410 270 380 Z"
        fill="#F97316" opacity="0.12" />
      <path d="M 30 1700 C 55 1678 90 1680 100 1705 C 110 1730 90 1755 62 1752 C 34 1749 18 1724 30 1700 Z"
        fill="#059669" opacity="0.12" />
    </svg>
  );
}

function buildSvgPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const midY = (p.y + c.y) / 2;
    d += ` C ${p.x} ${midY} ${c.x} ${midY} ${c.x} ${c.y}`;
  }
  return d;
}

function hashToInt(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rangedJitter(seed: string, min: number, max: number): number {
  const n = hashToInt(seed) / 4294967295;
  return min + n * (max - min);
}

function buildNodeLayout(chapterId: string, stopId: string, index: number): { x: number; y: number } {
  const chapterPhase = hashToInt(`${chapterId}-phase`) % BASE_X_PATTERN.length;
  const chapterBias = rangedJitter(`${chapterId}-bias`, -16, 16);
  const baseX = BASE_X_PATTERN[(index + chapterPhase) % BASE_X_PATTERN.length];
  const nodeJitterX = rangedJitter(`${chapterId}-${stopId}-x`, -20, 20);
  const nodeJitterY = rangedJitter(`${chapterId}-${stopId}-y`, -14, 14);

  const x = Math.max(72, Math.min(W - 72, baseX + chapterBias + nodeJitterX));
  const y = START_Y + index * NODE_SPACING_Y + nodeJitterY;
  return { x, y };
}


function FoodModal({
  stop,
  chapterLocked,
  onClose,
}: {
  stop: AppStop;
  chapterLocked: boolean;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 260);
  };

  const isLocked = chapterLocked;
  const isDone = !isLocked && stop.status === "completed";
  const isPending = !isLocked && stop.status === "pending";

  const ctaLabel = isDone ? "✅  再次到訪" : isPending ? "🍴  開始探索！" : "🔒  尚未解鎖";
  const ctaBg = isDone ? "#22C55E" : isPending ? "#F97316" : "#9CA3AF";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[70]"
        style={{ background: "rgba(0,0,0,0.45)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.22 }}
        onClick={close}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[80]">
        <motion.div
          className="mx-auto flex w-full max-w-[800px] flex-col bg-white"
          style={{ borderRadius: "28px 28px 0 0", maxHeight: "76vh" }}
          initial={{ y: "100%" }}
          animate={{ y: closing ? "100%" : 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-0 shrink-0">
            <div className="w-9 h-1 rounded-full bg-gray-200" />
          </div>

          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-3 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10"
          >
            <X size={15} className="text-gray-500" strokeWidth={2.5} />
          </button>

        {/* Photo */}
        <div
          className={[
            "mx-4 mt-3 shrink-0",
            stop.useStickerStyle ? "flex items-center justify-center bg-transparent" : "rounded-2xl overflow-hidden bg-gray-200",
          ].join(" ")}
          style={{ height: stop.useStickerStyle ? 220 : 192 }}
        >
          <img
            src={stop.photo}
            alt={stop.name}
            className={[
              stop.useStickerStyle
                ? "w-[88%] h-[88%] object-contain"
                : `w-full h-full ${stop.useImageContain ? "object-contain p-3 bg-white" : "object-cover"}`,
            ].join(" ")}
            style={{
              filter: isLocked
                ? "grayscale(70%) brightness(0.75)"
                : stop.useStickerStyle
                ? STICKER_FILTER
                : "none",
              transform: stop.useStickerStyle ? `scale(${stop.stickerScale})` : "none",
            }}
          />
          {/* Status badge on photo */}
          <div className="absolute top-5 left-7">
            {isDone && (
              <div className="bg-green-500 rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                <Check size={11} strokeWidth={3} className="text-white" />
                <span className="text-white text-[11px] font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  已到訪
                </span>
              </div>
            )}
            {isLocked && (
              <div className="bg-black/50 rounded-xl px-2.5 py-1 flex items-center gap-1.5 shadow-md">
                <Lock size={11} className="text-white" />
                <span className="text-white text-[11px] font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
                  已鎖定
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="px-4 pt-3 pb-8 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* Name row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="text-[28px] leading-none">{stop.emoji}</span>
              <div>
                <h2
                  className="text-[20px] leading-tight text-foreground"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  {stop.name}
                </h2>
                <p
                  className="text-[11px] text-muted-foreground font-bold mt-0.5"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {stop.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-3" />

          {/* Long description */}
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "#4B2E00", fontFamily: "'Nunito', sans-serif" }}
          >
            {stop.longDesc}
          </p>
          <div className="mt-3 rounded-xl bg-orange-50 border border-orange-100 px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-orange-500 font-extrabold" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Location
            </p>
            <p className="text-[12px] text-foreground font-semibold mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {stop.address}
            </p>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={isLocked}
            onClick={!isLocked ? close : undefined}
            className="w-full mt-5 py-4 rounded-2xl text-white font-extrabold text-[15px] transition-opacity"
            style={{
              background: ctaBg,
              boxShadow: isLocked ? "none" : isDone ? "0 5px 0 #16A34A" : "0 5px 0 #C2410C",
              fontFamily: "'Fredoka One', cursive",
              opacity: isLocked ? 0.7 : 1,
            }}
          >
            {ctaLabel}
          </motion.button>
        </div>
        </motion.div>
      </div>
    </>
  );
}

function GuideModal({ guide, onClose }: { guide: AppGuide; onClose: () => void }) {
  const [closing, setClosing] = useState(false);
  const close = () => {
    setClosing(true);
    setTimeout(onClose, 260);
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70]"
        style={{ background: "rgba(0,0,0,0.45)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: closing ? 0 : 1 }}
        transition={{ duration: 0.22 }}
        onClick={close}
      />
      <div className="fixed inset-x-0 bottom-0 z-[80]">
        <motion.div
          className="mx-auto flex w-full max-w-[800px] flex-col bg-white"
          style={{ borderRadius: "28px 28px 0 0", maxHeight: "76vh" }}
          initial={{ y: "100%" }}
          animate={{ y: closing ? "100%" : 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 shrink-0">
            <div className="w-9 h-1 rounded-full bg-gray-200" />
          </div>

        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center z-10"
        >
          <X size={15} className="text-gray-500" strokeWidth={2.5} />
        </button>

        <div className="px-5 pt-5 pb-10 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-orange-300 shadow-lg mb-3"
              style={{ boxShadow: "0 6px 0 #FED7AA" }}>
              <img src={headerAvatar} alt={guide.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-[22px] leading-tight text-foreground" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {guide.name}
              <span className="text-[15px] text-muted-foreground ml-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {guide.nameEn}
              </span>
            </h2>
            <div className="mt-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-0.5">
              <span className="text-[11px] font-bold text-orange-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
                {guide.role}
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-3" />

          <p className="text-[13px] leading-relaxed text-center" style={{ color: "#4B2E00", fontFamily: "'Nunito', sans-serif" }}>
            {guide.bio}
          </p>

          <div className="h-px bg-gray-100 my-4" />

          {/* Contact */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">💬</span>
            <span className="text-[13px] font-bold text-foreground" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {guide.contact}
            </span>
          </div>

          {/* CTA */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={close}
            className="w-full mt-5 py-4 rounded-2xl text-white font-extrabold text-[15px]"
            style={{
              background: "#F97316",
              boxShadow: "0 5px 0 #C2410C",
              fontFamily: "'Fredoka One', cursive",
            }}
          >
            🍜  開始今日遊！
          </motion.button>
        </div>
        </motion.div>
      </div>
    </>
  );
}

function FoodNode({
  stop,
  x,
  y,
  chapterLocked,
  onSelect,
}: {
  stop: AppStop;
  x: number;
  y: number;
  chapterLocked: boolean;
  onSelect: () => void;
}) {
  const isLocked = chapterLocked;
  const isDone = !isLocked && stop.status === "completed";
  const isSticker = stop.useStickerStyle && !isLocked;

  return (
    <div
      style={{
        position: "absolute",
        left: `${(x / W) * 100}%`,
        top: y,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
      }}
      className="flex flex-col items-center"
    >
      {/* Node */}
      <motion.button
        onClick={!isLocked ? onSelect : undefined}
        disabled={isLocked}
        whileTap={!isLocked ? { scale: 0.88 } : undefined}
        className={[
          "relative flex items-center justify-center",
          isSticker
            ? "w-[96px] h-[96px] bg-transparent"
            : isDone
            ? "w-[82px] h-[82px] rounded-full overflow-hidden border-[4px] border-green-500"
            : isLocked
            ? "w-[82px] h-[82px] rounded-full overflow-hidden border-[4px] border-gray-300 bg-gray-200 cursor-not-allowed"
            : "w-[82px] h-[82px] rounded-full overflow-hidden border-[4px] border-green-400",
        ].join(" ")}
        style={{
          boxShadow: isSticker
            ? "none"
            : isDone
            ? "0 6px 0 #16A34A"
            : isLocked
            ? "0 5px 0 #9CA3AF"
            : "0 5px 0 #16A34A",
        }}
      >
        {isLocked ? (
          <Lock size={22} className="text-gray-400" strokeWidth={2.5} />
        ) : (
          <img
            src={stop.photo}
            alt={stop.name}
            className={
              isSticker
                ? "w-[86px] h-[86px] object-contain"
                : `w-full h-full ${stop.useImageContain ? "object-contain p-1.5 bg-white" : "object-cover"}`
            }
            style={{
              filter: stop.useStickerStyle ? STICKER_FILTER : "brightness(0.92)",
              transform: stop.useStickerStyle ? `scale(${stop.stickerScale})` : "none",
            }}
          />
        )}
        {isDone && (
          <div className="absolute -bottom-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-green-600 border-[2.5px] border-white flex items-center justify-center shadow-sm">
            <Check size={10} strokeWidth={3.5} className="text-white" />
          </div>
        )}
      </motion.button>

      {/* Label */}
      <div className="mt-2 text-center" style={{ maxWidth: 96 }}>
        <p
          className={[
            "text-[11px] font-extrabold leading-tight",
            isLocked ? "text-gray-400" : "text-foreground",
          ].join(" ")}
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {stop.name}
        </p>
        <p
          className={[
            "text-[10px] leading-tight mt-0.5",
            isLocked ? "text-gray-400/90" : "text-muted-foreground",
          ].join(" ")}
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {stop.desc}
        </p>
      </div>
    </div>
  );
}

function MapSection({
  chapter,
  onSelectStop,
  isLast,
}: {
  chapter: AppChapter;
  onSelectStop: (stop: AppStop) => void;
  isLast: boolean;
}) {
  const basePts = chapter.stops.map((stop, i) => ({
    ...stop,
    ...buildNodeLayout(chapter.id, stop.id, i),
  }));
  const minNodeGap = chapter.stops.length <= 2 ? 156 : 112;
  const pts = basePts.map((pt, idx) => {
    if (idx === 0) return pt;
    const prevY = basePts
      .slice(0, idx)
      .reduce((acc, item) => Math.max(acc, item.y), basePts[0].y);
    return {
      ...pt,
      y: Math.max(pt.y, prevY + minNodeGap),
    };
  });
  const endPadding = isLast ? 160 : 88;
  const lastY = pts.length ? pts[pts.length - 1].y : START_Y;
  const totalH = lastY + endPadding;
  const pathD = buildSvgPath(pts);
  const pathColor = chapter.locked ? "#D1D5DB" : chapter.pathColor;

  return (
    <div className="relative mx-4" style={{ height: totalH }}>
      <svg
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        width="100%"
        height={totalH}
        viewBox={`0 0 ${W} ${totalH}`}
        preserveAspectRatio="none"
      >
        <path d={pathD} fill="none" stroke="rgba(0,0,0,0.09)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathD} fill="none" stroke={pathColor} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathD} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathD} fill="none" stroke={chapter.locked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)"} strokeWidth="3" strokeDasharray="2 20" strokeLinecap="round" />
      </svg>
      {pts.map((pos) => (
        <FoodNode
          key={pos.id}
          stop={pos}
          x={pos.x}
          y={pos.y}
          chapterLocked={chapter.locked}
          onSelect={() => onSelectStop(pos)}
        />
      ))}
    </div>
  );
}

function ChapterBanner({ chapter }: { chapter: AppChapter }) {
  const doneCount = chapter.stops.filter((s) => s.status === "completed").length;
  return (
    <motion.div
      className="mx-4 rounded-3xl p-4 mt-5 mb-0 flex items-center justify-between"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 4px 0 #E5E7EB, 0 10px 24px rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className="text-[32px] leading-none"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
        >
          {chapter.flag}
        </motion.span>
        <div>
          <h3 className="text-[15px] leading-tight text-foreground" style={{ fontFamily: "'Fredoka One', cursive" }}>
            {chapter.title}
          </h3>
          <p className="text-[11px] mt-0.5 font-semibold text-muted-foreground" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {chapter.subtitle}
          </p>
        </div>
      </div>
      {chapter.locked ? (
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-100">
          <Lock size={18} className="text-gray-500" strokeWidth={2.5} />
        </div>
      ) : (
        <div className="rounded-2xl px-3 py-1.5 bg-orange-50 border border-orange-100">
          <span className="text-[12px] font-extrabold text-orange-500" style={{ fontFamily: "'Fredoka One', cursive" }}>
            進行中
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default function App() {
  const [selectedStop, setSelectedStop] = useState<{ stop: AppStop; chapterLocked: boolean } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { guide, chapters, tourTitle, tourMeta } = tourContent;

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "linear-gradient(160deg, #FFF3C7 0%, #FFD580 52%, #FFC85A 100%)" }}
    >
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-[800px] flex-col"
        style={{
          background: "#FFFBE6",
        }}
      >
        {/* Scrollable map */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#FFC342] pb-12 pt-2">
            <div className="mx-auto w-full max-w-[800px] px-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 22 }}
                className="py-2 flex flex-col items-center text-center"
              >
                <motion.button
                  onClick={() => setShowGuide(true)}
                  whileTap={{ scale: 0.94 }}
                  className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/80"
                  style={{ boxShadow: "0 6px 14px rgba(0,0,0,0.2)" }}
                >
                  <img src={headerAvatar} alt={guide.name} className="w-full h-full object-cover" />
                </motion.button>
                <div className="min-w-0 mt-2">
                  <h2 className="text-[14px] leading-snug text-[#4B2E00]" style={{ fontFamily: "'Fredoka One', cursive" }}>
                    {`${guide.name}的${tourTitle}`}
                  </h2>
                  <p className="text-[11px] text-[#6B4F2D] font-semibold mt-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    {`${tourMeta} 🚶`}
                  </p>
                </div>
              </motion.div>
            </div>
            <svg
              className="absolute bottom-0 left-0 h-8 w-full pointer-events-none"
              viewBox="0 0 390 40"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0,8 C52,34 122,2 188,18 C254,34 322,8 390,20 L390,40 L0,40 Z" fill="#FFFBE6" />
            </svg>
          </div>

          <div className="relative pb-10 overflow-hidden">
            <AbstractMapBg />
            {chapters.map((chapter, idx) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 + 0.25, type: "spring", stiffness: 200, damping: 24 }}
              >
                <ChapterBanner chapter={chapter} />
                <MapSection
                  chapter={chapter}
                  onSelectStop={(stop) => setSelectedStop({ stop, chapterLocked: chapter.locked })}
                  isLast={idx === chapters.length - 1}
                />
              </motion.div>
            ))}
            <div className="mx-4 mt-3 pb-6 text-center">
              <p className="text-[13px] font-bold text-[#7A4A12]" style={{ fontFamily: "'Nunito', sans-serif" }}>
                祝你餐餐有驚喜，吃得開心、走到哪都香！
              </p>
            </div>
          </div>
        </div>

        {/* Food modal */}
        {selectedStop && (
          <FoodModal
            stop={selectedStop.stop}
            chapterLocked={selectedStop.chapterLocked}
            onClose={() => setSelectedStop(null)}
          />
        )}

        {/* Guide modal */}
        {showGuide && <GuideModal guide={guide} onClose={() => setShowGuide(false)} />}
      </div>
    </div>
  );
}
