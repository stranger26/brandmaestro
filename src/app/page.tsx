'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { BrandExtractionSection } from '@/components/brand-extraction-section';
import { StrategySection } from '@/components/strategy-section';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Film } from 'lucide-react';

export default function Home() {
  const [brandGuidelines, setBrandGuidelines] =
    useState<ExtractBrandElementsOutput | null>(null);

  useEffect(() => {
    // On component mount, try to load brand guidelines from local storage
    const storedGuidelines = localStorage.getItem('brandGuidelines');
    if (storedGuidelines) {
      setBrandGuidelines(JSON.parse(storedGuidelines));
    }
  }, []);

  const handleExtractionComplete = (guidelines: ExtractBrandElementsOutput) => {
    setBrandGuidelines(guidelines);
    localStorage.setItem('brandGuidelines', JSON.stringify(guidelines));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-12">
          <BrandExtractionSection
            onExtractionComplete={handleExtractionComplete}
          />

          {brandGuidelines && (
            <>
              <Separator className="my-12" />
              <StrategySection />
              <Separator className="my-12" />
              <div className="text-center space-y-4">
                <Button asChild size="lg">
                  <Link href="/brandcheck">
                    <CheckCircle className="mr-2" /> Run Compliance Check
                  </Link>
                </Button>
                <div className="text-center">
                    <Button asChild size="lg" variant="destructive">
                        <Link href="/vidgen">
                        <Film className="mr-2" /> Generate Video from Script
                        </Link>
                    </Button>
                </div>
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
