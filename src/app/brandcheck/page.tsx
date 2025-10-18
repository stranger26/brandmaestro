'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Youtube,
  ArrowLeft,
  Film,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleCheckCompliance } from '@/app/actions';
import type { CheckVideoForBrandComplianceOutput } from '@/ai/flows/check-video-for-brand-compliance';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Header } from '@/components/header';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { ComplianceReportCard } from '@/components/compliance-report-card';

const toDataURI = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });


export default function BrandCheckPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [brandGuidelines, setBrandGuidelines] =
    useState<ExtractBrandElementsOutput | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [inputType, setInputType] = useState('upload');
  const [report, setReport] =
    useState<CheckVideoForBrandComplianceOutput | null>(null);
  const [isUploadSectionOpen, setIsUploadSectionOpen] = useState(true);

  useEffect(() => {
    const storedGuidelines = localStorage.getItem('brandGuidelines');
    if (storedGuidelines) {
      setBrandGuidelines(JSON.parse(storedGuidelines));
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setYoutubeUrl('');
      setReport(null);
    }
  };
  
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setVideoFile(null);
    setReport(null);
  }

  const handleSubmit = () => {
    const isYoutube = inputType === 'youtube' && youtubeUrl;
    const isUpload = inputType === 'upload' && videoFile;

    if (!isYoutube && !isUpload) {
      toast({
        title: 'No Video Provided',
        description: 'Please upload a video file or provide a YouTube URL.',
        variant: 'destructive',
      });
      return;
    }

    if (!brandGuidelines) {
      toast({
        title: 'No Brand Guidelines',
        description: 'Please extract brand guidelines on the main page first.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        let videoDataUri: string;
        if (isUpload) {
          videoDataUri = await toDataURI(videoFile!);
        } else {
          // The flow can handle URLs directly
          videoDataUri = youtubeUrl;
        }


        const result = await handleCheckCompliance({
          videoDataUri,
          brandGuidelines: JSON.stringify(brandGuidelines),
        });

        setReport(result);
        setIsUploadSectionOpen(false); // Collapse upload section when report is generated
        toast({
          title: 'Compliance Check Complete',
          description: `Found ${result.length} potential issues.`,
        });
      } catch (error) {
        toast({
          title: 'Compliance Check Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    });
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Main
                </Link>
            </Button>
        </div>
        <section id="compliance-check">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Brand Compliance Check
            </h2>
            <p className="text-muted-foreground mt-2">
              Upload a new video to ensure it aligns with your brand guidelines.
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              {!brandGuidelines ? (
                <div className="text-center py-12">
                  <p className="text-lg font-semibold mb-4">No Brand Guidelines Found</p>
                  <p className="text-muted-foreground mb-6">You need to extract your brand DNA from the main page first.</p>
                  <Button asChild>
                    <Link href="/">Go to Main Page</Link>
                  </Button>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <Collapsible open={isUploadSectionOpen} onOpenChange={setIsUploadSectionOpen}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-between p-4 h-auto"
                      >
                        <div className="text-left">
                          <h3 className="font-semibold">Upload Video for Analysis</h3>
                          <p className="text-sm text-muted-foreground">
                            {report ? 'Click to upload a new video' : 'Upload a video or provide YouTube URL'}
                          </p>
                        </div>
                        {isUploadSectionOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="pt-4">
                        <Tabs value={inputType} onValueChange={setInputType} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upload"><UploadCloud className="mr-2" /> Upload</TabsTrigger>
                            <TabsTrigger value="youtube"><Youtube className="mr-2" /> YouTube</TabsTrigger>
                          </TabsList>
                          <TabsContent value="upload" className="mt-4">
                            <div className="flex flex-col items-center justify-center w-full">
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and
                                    drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    MP4, WEBM, or OGG
                                  </p>
                                </div>
                                <Input
                                  id="dropzone-file"
                                  type="file"
                                  className="hidden"
                                  accept="video/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                              {videoFile && (
                                <p className="mt-4 text-sm text-muted-foreground">
                                  Selected: {videoFile.name}
                                </p>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="youtube" className="mt-4">
                            <div className="flex flex-col items-center justify-center w-full h-64 p-4">
                              <Label htmlFor="youtube-url" className="w-full text-left mb-2">YouTube URL</Label>
                              <div className="relative w-full">
                                  <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="youtube-url"
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="pl-9"
                                    value={youtubeUrl}
                                    onChange={handleYoutubeUrlChange}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2 w-full text-left">
                                  Paste a link to a YouTube video.
                                </p>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <Button
                          size="lg"
                          className="w-full mt-6"
                          onClick={handleSubmit}
                          disabled={isPending || (!videoFile && !youtubeUrl)}
                        >
                          {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          {isPending ? 'Analyzing...' : 'Check Compliance'}
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Width Compliance Report */}
          {report && (
            <div className="mt-8">
              <ComplianceReportCard 
                report={report} 
              />
            </div>
          )}
        </section>
        <Separator className="my-12" />
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="destructive" className="mb-12">
            <Link href="/vidgen">
              <Film className="mr-2" /> Generate Video from Script
            </Link>
          </Button>
        </div>
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
