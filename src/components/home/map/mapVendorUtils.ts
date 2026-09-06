import { Expert, ExpertIcon } from "./types";

const KOLKATA_CENTER = { lat: 22.5726, lng: 88.3639 };

const CATEGORY_ICON_MAP: Record<string, ExpertIcon> = {
  "ac repair": "ac",
  ac: "ac",
  cleaning: "cleaning",
  electrical: "electric",
  plumbing: "plumbing",
  shifting: "shifting",
  painting: "painting",
  cctv: "cctv",
  security: "cctv",
  salon: "salon",
  "home salon": "salon",
};

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function namesMatch(a: string, b: string) {
  const left = normalizeName(a);
  const right = normalizeName(b);
  return left === right || left.includes(right) || right.includes(left);
}

function dedupeLocationParts(parts: string[]) {
  const seen = new Set<string>();
  return parts.filter((part) => {
    const key = normalizeName(part);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanAddress(locationText: string, district: string, division: string, area: string) {
  const parts = locationText
    .split(/[,/|]+/)
    .map((part: string) => part.trim())
    .filter(Boolean);
  const unique = dedupeLocationParts(parts);
  const filtered = unique.filter((part) => {
    if (area && namesMatch(part, area)) return false;
    if (district && namesMatch(part, district)) return false;
    if (division && namesMatch(part, division)) return false;
    if (normalizeName(part) === "bangladesh") return false;
    return true;
  });
  return filtered.join(", ");
}

function parseCoord(value: unknown): number | null {
  if (value == null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function parseGoogleMapCoords(link?: string): { lat: number; lng: number } | null {
  if (!link) return null;
  const atMatch = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  const qMatch = link.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };
  return null;
}

export function resolveVendorLocation(
  profile: any,
  allDistricts: any[] = [],
  allDivisions: any[] = []
) {
  let area = profile.area?.name ?? "";
  let district = profile.district?.name ?? "";
  let division = profile.devision?.name ?? profile.district?.devision?.name ?? "";
  let districtBangla = profile.district?.banglaName ?? "";
  let divisionBangla = profile.devision?.banglaName ?? profile.district?.devision?.banglaName ?? "";

  const locationText = profile.location?.trim() ?? "";
  const parts = locationText
    ? locationText.split(/[,/|]+/).map((part: string) => part.trim()).filter(Boolean)
    : [];

  for (const part of parts) {
    const matchedDistrict = allDistricts.find(
      (item) =>
        namesMatch(item.name ?? "", part) || namesMatch(item.banglaName ?? "", part)
    );
    if (matchedDistrict) {
      if (!district) district = matchedDistrict.name;
      if (!districtBangla && matchedDistrict.banglaName) {
        districtBangla = matchedDistrict.banglaName;
      }
      if (!division && matchedDistrict.devision?.name) {
        division = matchedDistrict.devision.name;
      }
      if (!divisionBangla && matchedDistrict.devision?.banglaName) {
        divisionBangla = matchedDistrict.devision.banglaName;
      }
      continue;
    }

    const matchedDivision = allDivisions.find(
      (item) =>
        namesMatch(item.name ?? "", part) || namesMatch(item.banglaName ?? "", part)
    );
    if (matchedDivision && !division) {
      division = matchedDivision.name;
    }
    if (matchedDivision && !divisionBangla && matchedDivision.banglaName) {
      divisionBangla = matchedDivision.banglaName;
    }
  }

  if (district && !division) {
    const parentDistrict = allDistricts.find((item) => namesMatch(item.name ?? "", district));
    if (parentDistrict?.devision?.name) {
      division = parentDistrict.devision.name;
    }
    if (!divisionBangla && parentDistrict?.devision?.banglaName) {
      divisionBangla = parentDistrict.devision.banglaName;
    }
  }

  if (!district && parts[0] && !allDistricts.some((item) => namesMatch(item.name ?? "", parts[0]))) {
    district = parts[0];
  }

  if (!division && parts[1] && !allDivisions.some((item) => namesMatch(item.name ?? "", parts[1]))) {
    if (!area) area = parts[1];
  } else if (!area && parts[1]) {
    area = parts[1];
  }

  if (!district && !division && locationText) {
    district = parts[0] || locationText;
  }

  const address = cleanAddress(locationText, district, division, area);
  const locationParts = [address, area, district, division].filter(Boolean);
  const location = locationParts.join(", ") || locationText || "Kolkata, India";

  return { area, district, division, districtBangla, divisionBangla, address, location };
}

export function getProfileCoordinates(
  profile: any,
  allDistricts: any[] = [],
  allDivisions: any[] = []
): { lat: number; lng: number } {
  const sources = [
    { lat: profile.area?.latitude, lng: profile.area?.longitude },
    { lat: profile.district?.latitude, lng: profile.district?.longitude },
    { lat: profile.devision?.latitude, lng: profile.devision?.longitude },
  ];

  for (const source of sources) {
    const lat = parseCoord(source.lat);
    const lng = parseCoord(source.lng);
    if (lat != null && lng != null) return { lat, lng };
  }

  const { district, division } = resolveVendorLocation(profile, allDistricts, allDivisions);
  const matchedDistrict = allDistricts.find((item) => namesMatch(item.name ?? "", district));
  if (matchedDistrict) {
    const lat = parseCoord(matchedDistrict.latitude);
    const lng = parseCoord(matchedDistrict.longitude);
    if (lat != null && lng != null) return { lat, lng };
  }

  const matchedDivision = allDivisions.find((item) => namesMatch(item.name ?? "", division));
  if (matchedDivision) {
    const lat = parseCoord(matchedDivision.latitude);
    const lng = parseCoord(matchedDivision.longitude);
    if (lat != null && lng != null) return { lat, lng };
  }

  const fromLink = parseGoogleMapCoords(profile.google_map_link);
  if (fromLink) return fromLink;

  const id = Number(profile.id) || 0;
  return {
    lat: KOLKATA_CENTER.lat + ((id * 7) % 50) / 500,
    lng: KOLKATA_CENTER.lng + ((id * 13) % 50) / 500,
  };
}

function categoryToIcon(category: string): ExpertIcon {
  const key = category.toLowerCase();
  return CATEGORY_ICON_MAP[key] || "general";
}

function getBadge(rating: number): Expert["badge"] {
  if (rating >= 4.8) return "Top Rated";
  if (rating >= 4.5) return "Expert";
  return "Popular";
}

export function getVendorProfiles(profiles: any[]): any[] {
  return profiles.filter(
    (profile) =>
      profile.type === "company" ||
      profile.company_name ||
      (Array.isArray(profile.categories) && profile.categories.length > 0)
  );
}

export function mapProfileToExpert(
  profile: any,
  index: number,
  allDistricts: any[] = [],
  allDivisions: any[] = []
): Expert {
  const user = profile.user ?? {};
  const { area, district, division, districtBangla, divisionBangla, address, location } =
    resolveVendorLocation(profile, allDistricts, allDivisions);
  const { lat, lng } = getProfileCoordinates(profile, allDistricts, allDivisions);
  const profileCategories: string[] = Array.isArray(profile.categories)
    ? profile.categories.map((cat: any) => cat?.name).filter(Boolean)
    : [];
  const categoryIds: number[] = Array.isArray(profile.categories)
    ? profile.categories.map((cat: any) => Number(cat?.id)).filter((id: number) => id > 0)
    : [];
  const category = profileCategories[0] ?? "General";
  const rating =
    profile.rating && Number(profile.rating) > 0
      ? Number(Number(profile.rating).toFixed(1))
      : Number((4.5 + (index % 5) * 0.1).toFixed(1));
  const reviews = profile.total_reviews ?? Math.floor(20 + ((index * 17) % 200));
  const completedJobs = Number(profile.total_projects) || 0;
  const price = Number(profile.min_starting_price) || 500;
  const avatarSeed = encodeURIComponent(user.name ?? user.email ?? `vendor-${profile.id}`);

  return {
    id: String(profile.id),
    profileId: profile.id,
    name: profile.company_name || user.name || "Service Provider",
    category,
    categories: profileCategories.length > 0 ? profileCategories : [category],
    rating,
    reviews,
    badge: getBadge(rating),
    location,
    address,
    division,
    district,
    divisionBangla,
    districtBangla,
    area,
    distance: "Nearby",
    status: user.status === "active" ? "Identity Verified" : "Verified Provider",
    description:
      profile.description || "Professional service provider available on Rajseba.",
    price,
    lat,
    lng,
    icon: categoryToIcon(category),
    phone: user.phone || "",
    completedJobs,
    avatar:
      user.profileImage ??
      user.avatar ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
    companyName: profile.company_name,
    userId: Number(user.id) || 0,
    categoryIds,
  };
}

export function buildVendorServicesUrl(expert: Expert): string {
  const params = new URLSearchParams();

  if (expert.userId) params.set("vendor", String(expert.userId));
  if (expert.name) params.set("vendor_name", expert.name);

  if (expert.categoryIds.length === 1) {
    params.set("category", String(expert.categoryIds[0]));
  } else if (expert.categoryIds.length > 1) {
    params.set("categories", expert.categoryIds.join(","));
  } else if (expert.categories[0]) {
    params.set("q", expert.categories[0]);
  }

  const query = params.toString();
  return query ? `/services?${query}` : "/services";
}

export function mapProfilesToExperts(
  profiles: any[],
  allDistricts: any[] = [],
  allDivisions: any[] = []
): Expert[] {
  return getVendorProfiles(profiles).map((profile, index) =>
    mapProfileToExpert(profile, index, allDistricts, allDivisions)
  );
}
