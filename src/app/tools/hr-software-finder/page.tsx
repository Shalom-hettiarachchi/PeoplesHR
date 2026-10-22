import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "HR software finder",
  robots: { index: false },
};

export default function Page() {
  return (
    <ComingSoon
      title="HR software finder"
      body="A guided set of questions that recommends the PeoplesHR package and modules that fit your team."
    />
  );
}
