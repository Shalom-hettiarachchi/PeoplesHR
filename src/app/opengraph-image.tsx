import { ogImage, OG_SIZE } from "@/lib/og";

export const alt = "PeoplesHR: free HR tools and guides";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage("Free HR and payroll tools and guides for growing teams", "PeoplesHR");
}
