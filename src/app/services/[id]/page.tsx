import { Metadata } from "next";
import ServiceDetailClientPage from "./ServiceDetailClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://www.api.rajseba.in";
    const res = await fetch(`${apiBase}/services/${id}`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const service = json?.data;

    if (!service) {
      return {
        title: "Service Details in Kolkata | Rajseba",
        description: "Book professional home services in Kolkata, West Bengal, India with Rajseba.",
      };
    }

    const title = `${service.name} in Kolkata, West Bengal | Rajseba`;
    const description = service.description || `Book professional ${service.name} services in Kolkata, West Bengal, India. Vetted local experts, transparent pricing, guaranteed quality with Rajseba.`;

    return {
      title,
      description,
      keywords: [
        service.name,
        `${service.name} Kolkata`,
        `${service.name} West Bengal`,
        `${service.name} India`,
        "Rajseba Kolkata",
        "home services Kolkata",
      ],
      alternates: {
        canonical: `https://rajseba.com/services/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `https://rajseba.com/services/${id}`,
        siteName: "Rajseba Kolkata",
        locale: "en_IN",
        type: "website",
      },
    };
  } catch {
    return {
      title: "Service Details in Kolkata | Rajseba",
      description: "Book professional home services in Kolkata, West Bengal, India with Rajseba.",
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceDetailClientPage id={id} />;
}
