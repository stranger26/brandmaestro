'use client';

import { useState, useTransition } from 'react';
import { Loader2, Wand2, Film } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';
import { Textarea } from './ui/textarea';

interface VideogenSectionProps {
  brandGuidelines: ExtractBrandElementsOutput;
}

export function VideogenSection({ brandGuidelines }: VideogenSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!prompt) {
      toast({
        title: 'No prompt provided',
        description: 'Please enter a prompt to generate a video.',
        variant: 'destructive',
      });
      return;
    }
    startTransition(async () => {
      // Placeholder for video generation logic
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setVideoUrl('https://placehold.co/1920x1080.mp4?text=Generated+Video');
      toast({
        title: 'Video Generation Started',
        description: 'Your video is being generated and will appear below.',
      });
    });
  };

  return (
    <section id="videogen">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-headline tracking-tight">
          AI Video Generation
        </h2>
        <p className="text-muted-foreground mt-2">
          Generate a short video based on your brand guidelines and a prompt.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generate New Video Content</CardTitle>
          <CardDescription>
            Use your extracted brand DNA to create on-brand video clips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., A 5-second cinematic shot of a futuristic cityscape with flying cars, in our brand's color palette."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Generating...' : 'Generate Video'}
          </Button>

          {isPending && (
             <div className="flex flex-col items-center justify-center text-center p-6">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4"/>
                <p className="font-semibold">Generating Video...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments. Please wait.</p>
              </div>
          )}

          {videoUrl && !isPending && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-center">Generated Video</h3>
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                <video src={videoUrl} controls className="w-full h-full" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
