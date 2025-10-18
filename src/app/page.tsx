
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { BrandExtractionSection } from '@/components/brand-extraction-section';
import { StrategySection } from '@/components/strategy-section';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Film, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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

              <div className="grid md:grid-cols-2 gap-8">
                 <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline tracking-tight">Brand Compliance</CardTitle>
                    <CardDescription>
                      Check a new video against your brand guidelines.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-16 h-16 text-primary mb-4" />
                     <p className="mb-6 text-muted-foreground">
                      Ensure your content aligns perfectly with your extracted brand DNA.
                    </p>
                    <Button asChild size="lg" variant="success" className="w-full">
                        <Link href="/brandcheck">
                        Run a Brand Compliance Check
                        <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline tracking-tight">Video Generation</CardTitle>
                    <CardDescription>
                      Create on-brand video content from a simple text script.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                    <Film className="w-16 h-16 text-primary mb-4" />
                    <p className="mb-6 text-muted-foreground">
                      Use the power of AI to generate short videos that match your brand's style.
                    </p>
                    <Button asChild size="lg" className="w-full">
                       <Link href="/vidgen">
                        Generate Video from Script
                        <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="py-6 mt-12 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>Built with Brand Maestro. Controlled chaos, with training wheels.</p>
        </div>
      </footer>
    </div>
  );
}
