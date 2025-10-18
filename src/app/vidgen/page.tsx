'use client';

import { useState, useTransition } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/header';
import { handleGenerateVideoFromScript } from '@/app/actions';

export default function VidgenPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [script, setScript] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!script) {
      toast({
        title: 'No script provided',
        description: 'Please enter a script to generate a video.',
        variant: 'destructive',
      });
      return;
    }
    setVideoUrl(null);
    startTransition(async () => {
      try {
        const result = await handleGenerateVideoFromScript({ script });
        setVideoUrl(result.videoUrl);
        toast({
          title: 'Video Generation Complete',
          description: 'Your video has been generated and will appear below.',
        });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Video Generation Failed',
          description:
            (error as Error).message ||
            'An unknown error occurred during video generation.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <section id="videogen-script">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Generate Video from Script
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Enter a text script below. Our AI will generate a short video
              based on your prompt.
            </p>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Video Script</CardTitle>
              <CardDescription>
                Describe the scene, action, and style of the video you want to
                create.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={5}
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
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <p className="font-semibold">Generating Video...</p>
                  <p className="text-sm text-muted-foreground">
                    This may take up to a minute. Please wait.
                  </p>
                </div>
              )}

              {videoUrl && !isPending && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 text-center">
                    Generated Video
                  </h3>
                  <div className="aspect-video bg-secondary rounded-lg overflow-hidden">
                    <video src={videoUrl} controls className="w-full h-full" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>
            Built with Brand Maestro. Controlled chaos, with training wheels.
          </p>
        </div>
      </footer>
    </div>
  );
}
