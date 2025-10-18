'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { BrandExtractionSection } from '@/components/brand-extraction-section';
import { ComplianceSection } from '@/components/compliance-section';
import { StrategySection } from '@/components/strategy-section';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';
import { Separator } from '@/components/ui/separator';
import { VideogenSection } from '@/components/videogen-section';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export default function Home() {
  const [brandGuidelines, setBrandGuidelines] =
    useState<ExtractBrandElementsOutput | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-12">
          <BrandExtractionSection onExtractionComplete={setBrandGuidelines} />

          {brandGuidelines && (
            <>
              <Separator className="my-12" />
              <StrategySection />
              <Separator className="my-12" />
              <ComplianceSection brandGuidelines={brandGuidelines} />
              <Separator className="my-12" />
              <VideogenSection brandGuidelines={brandGuidelines} />
              <div className="text-center mt-12">
                <Button asChild size="lg" variant="destructive" className="mb-12">
                  <Link href="/vidgen">
                    <Film className="mr-2" /> Generate Video from Script
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>Built with Brand Maestro. Controlled chaos, with training wheels.</p>
        </div>
      </footer>
    </div>
  );
}
