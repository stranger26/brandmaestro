'use client';

import { useState, useTransition } from 'react';
import { Loader2, Sparkles, Lightbulb, TrendingUp, UserCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handleGetStrategy } from '@/app/actions';
import type { ContentStrategyAdviceOutput } from '@/ai/flows/get-content-strategy-advice';

export function StrategySection() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [advice, setAdvice] = useState<ContentStrategyAdviceOutput | null>(
    null
  );

  const getAdvice = () => {
    startTransition(async () => {
      try {
        // Mock data as per PRD
        const mockInput = {
          uploadSchedule: 'Mon 9am, Wed 5pm, Fri 12pm',
          engagementData: 'Video 1: 10k views, 500 likes. Video 2: 15k views, 800 likes.',
          linguisticTone: 'Informal and humorous',
        };
        const result = await handleGetStrategy(mockInput);
        setAdvice(result);
        toast({
          title: 'Strategy Advice Generated',
          description: 'Here are your AI-powered content recommendations.',
        });
      } catch (error) {
        toast({
          title: 'Failed to Get Advice',
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <section id="content-strategy">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold font-headline tracking-tight">
          AI-Powered Content Strategy
        </h2>
        <p className="text-muted-foreground mt-2">
          Get actionable insights to grow your channel and reinforce your brand.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          {!advice ? (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <p className="mb-4 text-muted-foreground">
                Click the button to generate personalized content strategy advice based on your brand profile.
              </p>
              <Button size="lg" onClick={getAdvice} disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isPending ? 'Generating...' : 'Get Strategy Advice'}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Lightbulb className="text-accent" /> Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.contentProductionRecommendations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="text-accent"/> Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.languageOptimization}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserCheck className="text-accent" /> Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.personaReinforcement}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
