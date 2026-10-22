import type { Metadata } from "next";
import { DemoDashboard } from "@/components/demo/demo-dashboard";

export const metadata: Metadata = {
  title: "Behind the scenes",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Prototype only</p>
      <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-950">Behind the scenes</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-500">
        What sales and marketing would see after visitors use the tools. In production, leads would go to the CRM and
        events to analytics. Here, both are kept in this browser so you can try it.
      </p>
      <div className="mt-10">
        <DemoDashboard />
      </div>
    </div>
  );
}
