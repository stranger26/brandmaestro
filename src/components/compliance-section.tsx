'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  Youtube,
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
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ComplianceSectionProps {
  brandGuidelines: ExtractBrandElementsOutput;
}

const toDataURI = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function ComplianceSection({ brandGuidelines }: ComplianceSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [inputType, setInputType] = useState('upload');
  const [report, setReport] =
    useState<CheckVideoForBrandComplianceOutput | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setYoutubeUrl('');
      setVideoSrc(URL.createObjectURL(file));
      setReport(null);
    }
  };
  
  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeUrl(e.target.value);
    setVideoFile(null);
    setVideoSrc(null); // Simple URL handling, no embed for now
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
        
        if (isYoutube) {
          // Since we can't play youtube videos directly, we just show the URL
          setVideoSrc(youtubeUrl);
        }

        setReport(result);
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setProgress(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [videoSrc]);

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  const a11yIssues = report?.filter(issue => issue.issue.toLowerCase().includes('color') || issue.issue.toLowerCase().includes('contrast'));

  return (
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
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
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

            <div className="space-y-4">
              <div className="aspect-video bg-secondary rounded-lg overflow-hidden relative">
                {videoSrc && !youtubeUrl.includes('youtube.com')? (
                  <video ref={videoRef} src={videoSrc} controls className="w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {videoSrc && youtubeUrl.includes('youtube.com') ? 
                      <a href={videoSrc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{videoSrc}</a>
                      : <p>Upload a video to preview</p>
                    }
                  </div>
                )}
              </div>

              {report && (
                 <div className="space-y-4">
                 <div className="relative p-2">
                    <Slider
                      value={[progress]}
                      max={duration}
                      step={1}
                      onValueChange={handleSeek}
                      disabled={!duration}
                    />
                    {report.map(issue => (
                      <Popover key={issue.timestamp}>
                        <PopoverTrigger asChild>
                           <button
                            className="absolute -top-1 w-2 h-2 rounded-full bg-destructive transform -translate-x-1/2"
                            style={{ left: duration ? `${(issue.timestamp / duration) * 100}%`: '0%' }}
                            aria-label={`Issue at ${issue.timestamp}s`}
                           />
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="font-semibold text-sm">{issue.issue}</p>
                          <p className="text-xs text-muted-foreground">Timestamp: {issue.timestamp.toFixed(1)}s</p>
                        </PopoverContent>
                      </Popover>
                    ))}
                 </div>

                 <Card>
                    <CardHeader>
                      <CardTitle>Compliance Report</CardTitle>
                      <CardDescription>Found {report.length} issues.</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-60 overflow-y-auto">
                        {report.length > 0 ? (
                            <ul className="space-y-4">
                            {report.map((issue, i) => (
                                <li key={i} className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0"/>
                                <div>
                                    <p className="font-medium text-sm">
                                    {issue.issue} <span className="text-muted-foreground">({issue.timestamp.toFixed(1)}s)</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">{issue.suggestedFix}</p>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="mt-1 h-auto px-2 py-1 text-primary hover:text-primary">
                                          <Eye className="mr-2 h-4 w-4" /> Preview Fix
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl">
                                        <DialogHeader><DialogTitle>Fix Preview</DialogTitle></DialogHeader>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div><h3 className="font-semibold text-center mb-2">Before</h3><video src={videoSrc ?? ""} controls className="w-full rounded-md"/></div>
                                          <div><h3 className="font-semibold text-center mb-2">After (Mock)</h3><video src={videoSrc ?? ""} controls className="w-full rounded-md" style={{filter: 'saturate(1.2) contrast(1.1)'}}/></div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                </div>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6">
                              <CheckCircle className="w-12 h-12 text-green-500 mb-2"/>
                              <p className="font-semibold">All Clear!</p>
                              <p className="text-sm text-muted-foreground">No brand compliance issues found.</p>
                            </div>
                        )}
                    </CardContent>
                 </Card>
               </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
