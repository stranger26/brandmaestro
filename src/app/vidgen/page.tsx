
'use client';

import { useState, useTransition } from 'react';
import { Loader2, Wand2, Facebook, Youtube, Instagram } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const XLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const TikTokLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

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
              <div className="space-y-2">
                <Label>Target Platforms</Label>
                <div className="flex items-center justify-around gap-4 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="facebook" />
                    <Label htmlFor="facebook">
                      <Facebook className="h-6 w-6 text-blue-600" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="youtube" />
                    <Label htmlFor="youtube">
                      <Youtube className="h-6 w-6 text-red-600" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="instagram" />
                    <Label htmlFor="instagram">
                      <Instagram className="h-6 w-6 text-pink-600" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="tiktok" />
                    <Label htmlFor="tiktok">
                      <TikTokLogo className="h-6 w-6 fill-foreground" />
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="x" />
                    <Label htmlFor="x">
                      <XLogo className="h-5 w-5 fill-foreground" />
                    </Label>
                  </div>
                </div>
              </div>
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
            </CardContent>
          </Card>
        </section>

        {isPending && (
          <div className="flex flex-col items-center justify-center text-center p-6 mt-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="font-semibold">Generating Video...</p>
            <p className="text-sm text-muted-foreground">
              This may take up to a minute. Please wait.
            </p>
          </div>
        )}

        {videoUrl && !isPending && (
          <div className="mt-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-4 text-center">
              Generated Video
            </h3>
            <div className="aspect-video bg-secondary rounded-lg overflow-hidden shadow-lg">
              <video src={videoUrl} controls className="w-full h-full" />
            </div>
          </div>
        )}
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
