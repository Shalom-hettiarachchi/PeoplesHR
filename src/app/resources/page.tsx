import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "HR and payroll guides",
  robots: { index: false },
};

export default function Page() {
  return (
    <ComingSoon
      title="HR and payroll guides"
      body="Answer-first guides and checklists that connect your question to practical next steps."
    />
  );
}
