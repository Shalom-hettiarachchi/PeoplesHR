import { GUIDES, getGuide } from "@/lib/content/guides";
import { TOPICS } from "@/lib/content/types";
import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "PeoplesHR guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return ogImage(guide?.title ?? "HR and payroll guides", guide ? `Guide · ${TOPICS[guide.topic]}` : "PeoplesHR");
}
