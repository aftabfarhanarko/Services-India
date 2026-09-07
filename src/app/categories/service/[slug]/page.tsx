import { Metadata } from "next";
import CategoryDetailClientPage from "./CategoryDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";
    const allRes = await fetch(`${apiBase}/services/public`, {
      next: { revalidate: 3600 },
    });
    const allJson = await allRes.json();
    const serviceObj = allJson?.data?.find((s: any) => s.slug === slug);
    if (!serviceObj) {
      return {
        title: "Category Details - Rajseba",
        description: "Professional service category details.",
      };
    }

    const res = await fetch(`${apiBase}/services/${serviceObj.id}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Service Category Details in Kolkata | Rajseba",
        description: "Professional service category details in Kolkata, West Bengal, India.",
      };
    }

    const title = `${service.name} in Kolkata, West Bengal | Rajseba`;
    const description = service.description || `Book expert ${service.name} services in Kolkata, West Bengal, India. Professional and trusted technicians at your service with guaranteed quality.`;

    return {
      title,
      description,
      keywords: [
        service.name,
        `${service.name} Kolkata`,
        `${service.name} West Bengal`,
        `${service.name} India`,
        "home services Kolkata",
        "Rajseba Kolkata",
      ],
      alternates: {
        canonical: `https://rajseba.in/categories/service/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `https://rajseba.in/categories/service/${slug}`,
        siteName: "Rajseba Kolkata",
        locale: "en_IN",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Service Category Details in Kolkata | Rajseba",
      description: "Professional service category details in Kolkata, West Bengal, India with Rajseba.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryDetailClientPage slug={slug} />;
}
