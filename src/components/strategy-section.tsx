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
       <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold font-headline tracking-tight">AI-Powered Content Strategy</CardTitle>
              <CardDescription className="mt-2">
                Get actionable insights to grow your channel and reinforce your brand.
              </CardDescription>
            </div>
            {!advice && (
               <Button onClick={getAdvice} disabled={isPending} className="ml-4 flex-shrink-0">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {isPending ? 'Generating...' : 'Get Strategy Advice'}
              </Button>
            )}
          </div>
        </CardHeader>
        {advice && (
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="text-accent" /> Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.contentProductionRecommendations}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="text-accent"/> Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.languageOptimization}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="text-accent" /> Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {advice.personaReinforcement}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
