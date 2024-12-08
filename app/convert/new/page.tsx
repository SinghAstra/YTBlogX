"use client";

import { ConversionForm } from "@/components/conversion/conversion-form";
import { ConversionHeader } from "@/components/conversion/conversion-header";

export default function ConvertNew() {
  return (
    <div className="min-h-screen pb-8">
      <ConversionHeader />
      <main className="container mx-auto px-4 mt-8">
        <ConversionForm />
      </main>
    </div>
  );
}
