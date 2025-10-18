
'use client';

import { useState, useTransition } from 'react';
import {
  UploadCloud,
  Youtube,
  Loader2,
  Palette,
  Type,
  Clapperboard,
  Music,
  MessageCircle,
  FileText,
  LayoutTemplate,
  Monitor,
  RefreshCw,
  BarChart2,
  CheckCircle,
  Wand2,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { handleExtractBrandElements } from '@/app/actions';
import type { ExtractBrandElementsOutput } from '@/ai/flows/extract-brand-elements-from-videos';

interface BrandExtractionSectionProps {
  onExtractionComplete: (guidelines: ExtractBrandElementsOutput) => void;
}

const toDataURI = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function BrandExtractionSection({
  onExtractionComplete,
}: BrandExtractionSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [videoInputs, setVideoInputs] = useState<({url: string; file: File | null; type: 'url' | 'file'})[]>([
    {url: '', file: null, type: 'url'},
    {url: '', file: null, type: 'url'},
    {url: '', file: null, type: 'url'},
  ]);
  const [mostRepresentative, setMostRepresentative] = useState('0');
  const [extractedData, setExtractedData] =
    useState<ExtractBrandElementsOutput | null>(null);

  const handleSubmit = async () => {
    const filledUrls = videoInputs
      .map(input => input.type === 'url' ? input.url : input.file)
      .filter(input => !!input);
    
    if (filledUrls.length === 0) {
      toast({
        title: 'No Videos Provided',
        description: 'Please provide at least one YouTube URL or upload a video.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      try {
        const videoDataUris = await Promise.all(videoInputs.map(async (input) => {
          if (input.type === 'url' && input.url) {
            return input.url;
          }
          if (input.type === 'file' && input.file) {
            return await toDataURI(input.file);
          }
          return null;
        }));

        const finalUrls = videoDataUris.filter(Boolean) as string[];

        const result = await handleExtractBrandElements({
          videoUrls: finalUrls,
          mostRepresentativeVideoIndex: parseInt(mostRepresentative, 10),
        });
        setExtractedData(result);
        onExtractionComplete(result);
        toast({
          title: 'Extraction Complete',
          description: 'Your brand guidelines have been successfully generated.',
        });
      } catch (error) {
        toast({
          title: 'Extraction Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    });
  };

  const handleInputChange = (index: number, value: string | File | null, type: 'url' | 'file') => {
    const newInputs = [...videoInputs];
    if (type === 'url' && typeof value === 'string') {
      newInputs[index] = { url: value, file: null, type: 'url' };
    } else if (type === 'file' && value instanceof File) {
      newInputs[index] = { url: '', file: value, type: 'file' };
    } else if (type === 'file' && value === null) {
      newInputs[index].file = null;
    }
    setVideoInputs(newInputs);
  };
  
  const handleTabChange = (index: number, type: 'url' | 'file') => {
    const newInputs = [...videoInputs];
    newInputs[index].type = type;
    setVideoInputs(newInputs);
  }

  if (extractedData) {
    return (
      <section id="brand-summary">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-headline tracking-tight">Your Brand Blueprint</h2>
          <p className="text-muted-foreground mt-2">
            AI-generated brand identity based on your video content.
          </p>
        </div>
        <Tabs defaultValue="visuals" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visuals"><Palette className="mr-2" />Visuals</TabsTrigger>
            <TabsTrigger value="audio"><Music className="mr-2" />Audio</TabsTrigger>
            <TabsTrigger value="narrative"><MessageCircle className="mr-2" />Narrative</TabsTrigger>
            <TabsTrigger value="format"><FileText className="mr-2" />Format</TabsTrigger>
          </TabsList>
          <TabsContent value="visuals" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Logo Usage</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Placement:</strong> {extractedData.coreVisualElements.logoUsage.placementCoordinates}</p>
                  <p><strong>Animation Timing:</strong> {extractedData.coreVisualElements.logoUsage.animationTiming}</p>
                  <p><strong>Transparency:</strong> {extractedData.coreVisualElements.logoUsage.transparencyPatterns}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Color Palette</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {extractedData.coreVisualElements.colorPalette.hexValuesRankedByFrequency.map((color) => (
                      <div key={color} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />
                        <span className="font-mono text-sm">{color}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{extractedData.coreVisualElements.colorPalette.contextualPairingSuggestions.join(', ')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <p><strong>Detected Fonts:</strong> {extractedData.coreVisualElements.typography.detectedFonts.join(', ')}</p>
                  <p><strong>Hierarchy:</strong> {extractedData.coreVisualElements.typography.hierarchyOfUsage}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Design Treatments</CardTitle></CardHeader>
                <CardContent>
                   <ul className="list-disc list-inside text-muted-foreground">
                    {extractedData.coreVisualElements.designTreatments.map((treatment, i) => <li key={i}>{treatment}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="audio" className="mt-6">
             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Music &amp; Sound</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>BPM Range:</strong> {extractedData.audioAndNarrativeStyle.musicAndSound.bpmRange}</p>
                    <p><strong>Tonal Mood:</strong> {extractedData.audioAndNarrativeStyle.musicAndSound.tonalMood}</p>
                    <p><strong>Instrument Bias:</strong> {extractedData.audioAndNarrativeStyle.musicAndSound.instrumentBias}</p>
                  </CardContent>
                </Card>
             </div>
          </TabsContent>
          <TabsContent value="narrative" className="mt-6">
             <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Tone &amp; Language</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Sentiment:</strong> {extractedData.audioAndNarrativeStyle.toneAndLanguage.sentiment}</p>
                    <p><strong>Linguistic Tone:</strong> {extractedData.audioAndNarrativeStyle.toneAndLanguage.linguisticToneClassifier}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Story Structure</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Avg. Intro Time:</strong> {extractedData.audioAndNarrativeStyle.storyStructure.averageIntroTime}</p>
                    <p><strong>Avg. Outro Time:</strong> {extractedData.audioAndNarrativeStyle.storyStructure.averageOutroTime}</p>
                    <p><strong>Archetype:</strong> {extractedData.audioAndNarrativeStyle.storyStructure.structureArchetype}</p>
                  </CardContent>
                </Card>
             </div>
          </TabsContent>
          <TabsContent value="format" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader><CardTitle>Branding Templates</CardTitle></CardHeader>
                  <CardContent>
                    <p>{extractedData.formatAndTechnicalInstructions.brandingTemplates}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Video Formats</CardTitle></CardHeader>
                  <CardContent>
                    <p>{extractedData.formatAndTechnicalInstructions.videoFormats}</p>
                  </CardContent>
                </Card>
             </div>
          </TabsContent>
        </Tabs>
      </section>
    );
  }

  return (
    <section id="brand-extraction">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-headline tracking-tight">
          Discover Your Brand DNA
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Upload up to 3 videos or provide YouTube links. Our AI will analyze your
          content to extract your unique brand identity.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-6">
            <RadioGroup
              value={mostRepresentative}
              onValueChange={setMostRepresentative}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Video {i + 1}</CardTitle>
                      <RadioGroupItem value={i.toString()} id={`vid-${i}`} />
                    </CardHeader>
                    <CardContent>
                      <Tabs value={videoInputs[i].type} onValueChange={(value) => handleTabChange(i, value as 'url' | 'file')} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                           <TabsTrigger value="url"><Youtube className="mr-2 h-4 w-4" /> Link</TabsTrigger>
                          <TabsTrigger value="file"><UploadCloud className="mr-2 h-4 w-4" /> Upload</TabsTrigger>
                        </TabsList>
                        <TabsContent value="url" className="pt-4">
                          <Label htmlFor={`url-${i}`} className="sr-only">Video URL {i + 1}</Label>
                           <div className="relative">
                            <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id={`url-${i}`}
                              placeholder="https://youtube.com/watch?v=..."
                              className="pl-9"
                              value={videoInputs[i].url}
                              onChange={(e) => handleInputChange(i, e.target.value, 'url')}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Paste a YouTube link.</p>
                        </TabsContent>
                        <TabsContent value="file" className="pt-4">
                           <Label htmlFor={`file-${i}`} className="sr-only">Upload Video {i + 1}</Label>
                           <Input
                              id={`file-${i}`}
                              type="file"
                              accept="video/*"
                              className="text-sm"
                              onChange={(e) => handleInputChange(i, e.target.files?.[0] || null, 'file')}
                           />
                           {videoInputs[i].file && <p className="text-xs text-muted-foreground mt-2 truncate">Selected: {videoInputs[i].file?.name}</p>}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </RadioGroup>
             <p className="text-sm text-center text-muted-foreground">Select the video that is most representative of your brand.</p>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Analyzing...' : 'Extract Brand Identity'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
