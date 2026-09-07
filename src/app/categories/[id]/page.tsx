import { Metadata } from "next";
import CategoryServicesPage from "./CategoryServicesPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";
    const res = await fetch(
      `${apiBase}/category/${id}`,
      { next: { revalidate: 3600 } }
    );
    const json = await res.json();
    const cat = json?.data || json;
    const name = cat?.name || "Category";
    const title = `${name} Services in Kolkata, West Bengal | Rajseba`;
    const description = cat?.description || `Browse and book verified ${name} services in Kolkata, West Bengal, India with Rajseba. Instant booking, transparent pricing, guaranteed satisfaction.`;
    return {
      title,
      description,
      keywords: [
        name,
        `${name} Kolkata`,
        `${name} West Bengal`,
        `${name} India`,
        "home services Kolkata",
        "Rajseba Kolkata",
      ],
      alternates: {
        canonical: `https://rajseba.in/categories/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `https://rajseba.in/categories/${id}`,
        siteName: "Rajseba Kolkata",
        locale: "en_IN",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Category Services in Kolkata | Rajseba",
      description: "Browse professional home services in Kolkata, West Bengal, India with Rajseba.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF6014]" />
        </div>
      }
    >
      <CategoryServicesPage categoryId={id} />
    </Suspense>
  );
}
