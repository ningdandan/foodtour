import sourceData from "./tour-data.json";

export type StopStatus = "completed" | "pending";

export interface AppStop {
  id: string;
  name: string;
  emoji: string;
  status: StopStatus;
  desc: string;
  longDesc: string;
  photo: string;
  address: string;
  cuisine: string;
  useImageContain: boolean;
  useStickerStyle: boolean;
  stickerScale: number;
}

export interface AppChapter {
  id: string;
  title: string;
  subtitle: string;
  flag: string;
  pathColor: string;
  bannerFrom: string;
  bannerTo: string;
  shadowColor: string;
  locked: boolean;
  stops: AppStop[];
}

export interface AppGuide {
  name: string;
  nameEn: string;
  role: string;
  bio: string;
  contact: string;
  photo: string;
}

interface RawTourData {
  tour?: {
    title?: string;
    title_en?: string;
    city?: string;
    guide?: {
      name?: string;
      name_en?: string;
      bio?: string;
      avatar_url?: string;
      contact?: string;
    };
    sections?: RawSection[];
  };
}

interface RawSection {
  id?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  position?: number;
  locked?: boolean;
  points?: RawPoint[];
}

interface RawPoint {
  id?: string;
  name_zh?: string;
  name_en?: string;
  description?: string;
  location_text?: string;
  image_url?: string;
  position?: number;
  status?: StopStatus;
  attributes?: {
    country_flag?: string;
  };
}

interface AppTourContent {
  tourTitle: string;
  tourMeta: string;
  chapters: AppChapter[];
  guide: AppGuide;
}

const rawData = sourceData as RawTourData;

const CHAPTER_COLORS = [
  { pathColor: "#FBBF24", bannerFrom: "#FB923C", bannerTo: "#DC2626", shadowColor: "#FCA572" },
  { pathColor: "#C4B5FD", bannerFrom: "#7C3AED", bannerTo: "#4C1D95", shadowColor: "#A78BFA" },
  { pathColor: "#6EE7B7", bannerFrom: "#059669", bannerTo: "#064E3B", shadowColor: "#34D399" },
  { pathColor: "#67E8F9", bannerFrom: "#0891B2", bannerTo: "#155E75", shadowColor: "#22D3EE" },
  { pathColor: "#F9A8D4", bannerFrom: "#DB2777", bannerTo: "#831843", shadowColor: "#F472B6" },
] as const;

const FALLBACK_GUIDE_AVATAR =
  "https://images.unsplash.com/photo-1552912470-ee2e96439539?w=600&h=600&fit=crop&auto=format";

const FALLBACK_STOP_IMAGE =
  "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=600&h=380&fit=crop&auto=format";

const STICKER_SCALE_OVERRIDES: Record<string, number> = {
  "pt-bakso": 1.42,
};

const localDishImages = Object.entries(
  import.meta.glob("./*.png", { eager: true, import: "default" }) as Record<string, string>,
)
  .filter(([path]) => /\d+\.png$/.test(path))
  .sort((a, b) => {
    const aNum = Number(a[0].match(/(\d+)\.png$/)?.[1] || "0");
    const bNum = Number(b[0].match(/(\d+)\.png$/)?.[1] || "0");
    return aNum - bNum;
  })
  .map(([, url]) => url);

const sortByPosition = <T extends { position?: number }>(items: T[] = []): T[] =>
  [...items].sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER));

const pickChapterStyle = (index: number) => CHAPTER_COLORS[index % CHAPTER_COLORS.length];

const normalizeStop = (point: RawPoint | undefined, section: RawSection, index: number): AppStop => {
  const fallbackName = point?.name_en || point?.name_zh || `Stop ${index + 1}`;
  return {
    id: point?.id || `${section.id || "section"}-stop-${index + 1}`,
    name: point?.name_zh || point?.name_en || fallbackName,
    emoji: point?.attributes?.country_flag || section.icon || "🍽️",
    status: point?.status === "completed" ? "completed" : "pending",
    desc: point?.name_en || point?.name_zh || fallbackName,
    longDesc: point?.description || "No description provided yet.",
    photo: point?.image_url || FALLBACK_STOP_IMAGE,
    address: point?.location_text || "Location details coming soon.",
    cuisine: section.subtitle || "Food stop",
    useImageContain: false,
    useStickerStyle: false,
    stickerScale: 1,
  };
};

const sections = sortByPosition(rawData.tour?.sections || []);

const chapters: AppChapter[] = sections.map((section, sectionIndex) => {
  const points = sortByPosition(section.points || []);
  const style = pickChapterStyle(sectionIndex);

  return {
    id: section.id || `section-${sectionIndex + 1}`,
    title: section.title || `Section ${sectionIndex + 1}`,
    subtitle: section.subtitle || "Food tour",
    flag: section.icon || "🍽️",
    ...style,
    locked: false,
    stops: points.map((point, pointIndex) => normalizeStop(point, section, pointIndex)),
  };
});

const doneCount = chapters.flatMap((chapter) => chapter.stops).filter((stop) => stop.status === "completed").length;
const totalStops = chapters.flatMap((chapter) => chapter.stops).length;
const pendingCount = Math.max(totalStops - doneCount, 0);

const city = rawData.tour?.city ? `${rawData.tour.city} · ` : "";
const tourMeta = `${city}還剩 ${pendingCount} 站`;

const guideInfo = rawData.tour?.guide;

const guide: AppGuide = {
  name: guideInfo?.name || "Your Guide",
  nameEn: guideInfo?.name_en || "",
  role: `美食向導 · ${rawData.tour?.city || "Food Tour"}`,
  bio: guideInfo?.bio || "Guide bio is not available yet.",
  contact: guideInfo?.contact || "Contact not provided",
  photo: guideInfo?.avatar_url || FALLBACK_GUIDE_AVATAR,
};

export const tourContent: AppTourContent = {
  tourTitle: rawData.tour?.title || "Food Tour",
  tourMeta,
  chapters: (() => {
    let imageCursor = 0;
    return chapters.map((chapter) => ({
    ...chapter,
      locked: false,
      stops: chapter.stops.map((stop) => {
        const localImage = localDishImages[imageCursor];
        imageCursor += 1;
        if (!localImage) return stop;

        return {
          ...stop,
          photo: localImage,
          useImageContain: true,
          useStickerStyle: true,
          stickerScale: STICKER_SCALE_OVERRIDES[stop.id] ?? 1.18,
        };
      }),
    }));
  })(),
  guide,
};
