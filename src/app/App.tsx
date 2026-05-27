import { useState } from "react";
import { motion } from "motion/react";
import { Check, Lock, X } from "lucide-react";
import { tourContent, type AppChapter, type AppGuide, type AppStop } from "../data/tour-content";
import headerBanner from "../data/header.png";
import headerAvatar from "../../avatar.png";

const STICKER_FILTER =
  "drop-shadow(0 0 0 #fff) drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(2px 2px 0 #fff) drop-shadow(-2px 2px 0 #fff) drop-shadow(2px -2px 0 #fff) drop-shadow(-2px -2px 0 #fff) drop-shadow(0 6px 10px rgba(0,0,0,0.22))";

function scaledSize(base: number, scale: number): string {
  return `${Math.round(base * Math.max(scale, 1))}px`;
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
  const isBakso = stop.id === "pt-bakso";

  const close = () => {
    setClosing(true);
    setTimeout(onClose, 260);
  };

  const isLocked = chapterLocked;
  const isDone = !isLocked && stop.status === "completed";
  const isPending = !isLocked && stop.status === "pending";
  const stickerModalSize = scaledSize(isBakso ? 240 : 194, stop.stickerScale);

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
                ? "object-contain"
                : `w-full h-full ${stop.useImageContain ? "object-contain p-3 bg-white" : "object-cover"}`,
            ].join(" ")}
            style={{
              filter: isLocked
                ? "grayscale(70%) brightness(0.75)"
                : stop.useStickerStyle
                ? STICKER_FILTER
                : "none",
              width: stop.useStickerStyle ? stickerModalSize : undefined,
              height: stop.useStickerStyle ? stickerModalSize : undefined,
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

function StickerStopCard({
  stop,
  chapterLocked,
  onSelect,
}: {
  stop: AppStop;
  chapterLocked: boolean;
  onSelect: () => void;
}) {
  const isLocked = chapterLocked;
  const isDone = !isLocked && stop.status === "completed";
  const isSticker = stop.useStickerStyle && !isLocked;
  const isBakso = stop.id === "pt-bakso";
  const stickerNodeSize = scaledSize(isBakso ? 104 : 86, stop.stickerScale);

  return (
    <motion.button
      onClick={!isLocked ? onSelect : undefined}
      disabled={isLocked}
      whileTap={!isLocked ? { scale: 0.92 } : undefined}
      className={`shrink-0 ${isBakso ? "w-[126px]" : "w-[108px]"} text-center`}
    >
      <div
        className={[
          "relative flex items-center justify-center mx-auto",
          isSticker
            ? "w-[96px] h-[96px] overflow-visible bg-transparent"
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
                ? "object-contain"
                : `w-full h-full ${stop.useImageContain ? "object-contain p-1.5 bg-white" : "object-cover"}`
            }
            style={{
              filter: stop.useStickerStyle ? STICKER_FILTER : "brightness(0.92)",
              width: stop.useStickerStyle ? stickerNodeSize : undefined,
              height: stop.useStickerStyle ? stickerNodeSize : undefined,
            }}
          />
        )}
        {isDone && (
          <div className="absolute -bottom-1.5 -right-1.5 w-[22px] h-[22px] rounded-full bg-green-600 border-[2.5px] border-white flex items-center justify-center shadow-sm">
            <Check size={10} strokeWidth={3.5} className="text-white" />
          </div>
        )}
      </div>
      <div className="mt-2 text-center">
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
    </motion.button>
  );
}

function ChapterCard({
  chapter,
  onSelectStop,
}: {
  chapter: AppChapter;
  onSelectStop: (stop: AppStop) => void;
}) {
  const totalCount = chapter.stops.length;

  return (
    <div
      className="mx-4 mt-5 rounded-3xl p-4"
      style={{
        background: "#FFFFFF",
        boxShadow: "0 4px 0 #E5E7EB, 0 10px 24px rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[32px] leading-none">{chapter.flag}</span>
          <div className="min-w-0">
            <h3 className="text-[15px] leading-tight text-foreground truncate" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {chapter.title}
            </h3>
            <p className="text-[11px] mt-0.5 font-semibold text-muted-foreground truncate" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {chapter.subtitle}
            </p>
          </div>
        </div>
        {chapter.locked ? (
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-100">
            <Lock size={18} className="text-gray-500" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="rounded-2xl px-3 py-1.5 bg-orange-50 border border-orange-100 shrink-0">
            <span className="text-[12px] font-extrabold text-orange-500" style={{ fontFamily: "'Fredoka One', cursive" }}>
              {totalCount}/{totalCount}
            </span>
          </div>
        )}
      </div>
      <div
        className="mt-4 overflow-x-auto overflow-y-visible px-1 pt-2 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-full w-max justify-center gap-3 pr-1">
          {chapter.stops.map((stop) => (
            <StickerStopCard
              key={stop.id}
              stop={stop}
              chapterLocked={chapter.locked}
              onSelect={() => onSelectStop(stop)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedStop, setSelectedStop] = useState<{ stop: AppStop; chapterLocked: boolean } | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const { guide, chapters } = tourContent;

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
          <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-visible pb-6">
            <div className="mx-auto w-full max-w-[800px]">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 22 }}
                className="flex items-center justify-center"
              >
                <img
                  src={headerBanner}
                  alt="Food tour header"
                  className="block w-full max-w-[800px] object-contain"
                  style={{ filter: "drop-shadow(0 5px 12px rgba(255,109,46,0.28))" }}
                />
              </motion.div>
            </div>
          </div>

          <div className="relative pb-10 overflow-hidden">
            {chapters.map((chapter, idx) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.12 + 0.25, type: "spring", stiffness: 200, damping: 24 }}
              >
                <ChapterCard
                  chapter={chapter}
                  onSelectStop={(stop) => setSelectedStop({ stop, chapterLocked: chapter.locked })}
                />
              </motion.div>
            ))}
            <div className="mx-4 mt-6 pb-6 text-center">
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
