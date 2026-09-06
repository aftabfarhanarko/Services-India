"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchPublicServicesQuery } from "@/redux/features/landing/landingApi";
import { useGetAllHeroesQuery } from "@/redux/features/admin/hero";

import { formatImageUrl } from "@/lib/utils";

const HERO_CONTENT = {
  accentTitleText: "Services,",
  subtitleText: "Simplified.",
  description: "Premium marketplace for all your household needs in Kolkata, West Bengal, India.",
  bgImage: "/cleaner-hero.png",
  bgAlt: "Expert home services background",
  searchButtonText: "Search",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 18,
    },
  },
} as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
    opacity: 0,
  }),
};

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: searchRes, isFetching: isSearching } = useSearchPublicServicesQuery(
    { q: searchQuery || undefined },
    { skip: !searchQuery }
  );

  const searchResults = searchRes?.data || [];

  const { data: apiHeroesRes, isLoading } = useGetAllHeroesQuery();
  const heroes = apiHeroesRes?.data || (Array.isArray(apiHeroesRes) ? apiHeroesRes : []);

  const slides = heroes.length > 0
    ? heroes.flatMap((hero: any) => {
        let rawImgs: string[] = [];
        if (Array.isArray(hero.images)) {
          rawImgs = hero.images;
        } else if (typeof hero.images === 'string') {
          try {
            const parsed = JSON.parse(hero.images);
            if (Array.isArray(parsed)) {
              rawImgs = parsed;
            } else {
              rawImgs = hero.images.split(',').filter(Boolean);
            }
          } catch {
            rawImgs = hero.images.split(',').filter(Boolean);
          }
        } else if (hero.image) {
          rawImgs = [hero.image];
        }

        const cleaned = rawImgs
          .map((img: any) => {
            if (typeof img !== 'string') return '';
            return img.trim().replace(/^["'\[\s]+|["'\]\s]+$/g, "");
          })
          .filter(Boolean);

        return cleaned.map((img: string) => ({
          image: img,
          hero: hero,
        }));
      })
    : [{ image: HERO_CONTENT.bgImage, hero: null }];

  const [[currentSlideIndex, direction], setSlideState] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    if (slides.length <= 1) return;
    setSlideState(([prevIndex]) => {
      let nextIndex = (prevIndex + newDirection) % slides.length;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      return [nextIndex, newDirection];
    });
  };

  const handleIndicatorClick = (index: number) => {
    if (index === currentSlideIndex) return;
    const clickDirection = index > currentSlideIndex ? 1 : -1;
    setSlideState([index, clickDirection]);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (currentSlideIndex >= slides.length) {
      setSlideState([0, 0]);
    }
  }, [slides.length, currentSlideIndex]);

  const activeSlide = slides[currentSlideIndex];
  const activeHero = activeSlide?.hero || heroes[0];
  const activeImage = activeSlide?.image;

  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  useEffect(() => {
    if (activeImage) {
      setIsImageLoading(true);
      const timer = setTimeout(() => {
        setIsImageLoading(false);
        setHasInitialLoaded(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [activeImage]);



  const { scrollY } = useScroll();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchOpacity = useTransform(scrollY, (y) => {
    if (isMobile) return 1;
    if (y <= 0) return 1;
    if (y >= 200) return 0;
    return 1 - y / 200;
  });
  const searchScale = useTransform(scrollY, (y) => {
    if (isMobile) return 1;
    if (y <= 0) return 1;
    if (y >= 200) return 0.85;
    return 1 - (y / 200) * 0.15;
  });
  const searchY = useTransform(scrollY, (y) => {
    if (isMobile) return 0;
    if (y <= 0) return 0;
    if (y >= 200) return -60;
    return -(y / 200) * 60;
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    const qs = params.toString();
    router.push(qs ? `/services?${qs}` : "/services");
  };

  const handleSlideClick = () => {
    const link = activeSlide?.hero?.link;
    if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        router.push(link);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-0 md:px-6 pt-0 md:pt-[3px]">
        <div className="relative w-full aspect-[16/9.5] md:aspect-auto md:min-h-[45vh] lg:min-h-[50vh] mt-0 md:mt-0 flex items-center rounded-none md:rounded-[26px] overflow-hidden justify-center py-0 md:py-0">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-0 md:px-6 pt-0 md:pt-4">
      <div className="relative w-full aspect-[16/9.5] md:aspect-auto md:min-h-[46vh] lg:min-h-[52vh] flex items-center rounded-none md:rounded-2xl overflow-hidden justify-center border-0 md:border border-white/70 shadow-none md:shadow-[0_12px_45px_0_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,96,20,0.15)] bg-white/40 backdrop-blur-xl">
        {isImageLoading && !hasInitialLoaded && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6014]" />
          </div>
        )}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Sliding images background */}
          {slides.length > 0 && activeImage && (
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentSlideIndex}
                  src={formatImageUrl(activeImage)}
                  alt="Hero Slide Background"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.25 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(event, info) => {
                    const swipe = info.offset.x;
                    if (swipe < -50) {
                      paginate(1);
                    } else if (swipe > 50) {
                      paginate(-1);
                    }
                  }}
                  className={`absolute inset-0 w-full h-full object-cover ${activeSlide?.hero?.link ? "cursor-pointer" : ""
                    }`}
                  onClick={handleSlideClick}
                  loading="eager"
                  onLoad={() => {
                    setIsImageLoading(false);
                    setHasInitialLoaded(true);
                  }}
                  onError={() => {
                    setIsImageLoading(false);
                    setHasInitialLoaded(true);
                  }}
                />
              </AnimatePresence>
            </div>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-full md:max-w-[92%] lg:max-w-[960px] xl:max-w-[1140px] min-[1440px]:max-w-[1280px] 2xl:max-w-[1400px] mx-auto px-4 md:px-6 text-center"
        >

        </motion.div>

        {/* Slide Indicators - Ultra-Premium Light Glass Pill */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center justify-center bg-white/40 backdrop-blur-xl px-3.5 py-2 rounded-full border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            {slides.map((_, index) => {
              const isActive = index === currentSlideIndex;
              return (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${isActive
                    ? "w-7 bg-[#FF6014] shadow-[0_0_12px_rgba(255,96,20,0.8)]"
                    : "w-2 bg-slate-400/60 hover:bg-slate-700"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;