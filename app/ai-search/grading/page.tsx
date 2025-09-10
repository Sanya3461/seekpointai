"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Stepper } from '@/components/ui/stepper';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Dimension {
  name: string;
  reason: string;
}

interface GradingData {
  dimensions: Dimension[];
  weights: Record<string, number>;
}

export default function GradingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradingData, setGradingData] = useState<GradingData | null>(null);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchId = searchParams.get('searchId');

  useEffect(() => {
    if (!searchId) {
      setError('Search ID is required');
      setIsLoading(false);
      return;
    }

    // In a real app, you'd fetch the search data here
    // For now, we'll use the suggestion function
    import('@/lib/suggest').then(({ suggestDimensions }) => {
      const suggestion = suggestDimensions('', ''); // In real app, pass job description and title
      setGradingData(suggestion);
      setDimensions(suggestion.dimensions);
      setWeights(suggestion.weights);
      setIsLoading(false);
    });
  }, [searchId]);

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isValidWeight = Math.abs(totalWeight - 100) < 0.1;

  const updateDimension = (index: number, field: keyof Dimension, value: string) => {
    const newDimensions = [...dimensions];
    newDimensions[index] = { ...newDimensions[index], [field]: value };
    setDimensions(newDimensions);
  };

  const updateWeight = (dimensionName: string, value: number) => {
    setWeights(prev => ({ ...prev, [dimensionName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidWeight) {
      setError('Weights must sum to exactly 100%');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/searches/${searchId}/confirm-grading`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dimensions,
          weights,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to confirm grading');
      }

      const result = await response.json();
      router.push(result.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-xl font-bold text-brand">SeekPoint AI</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Stepper 
          currentStep={2} 
          totalSteps={3} 
          labels={["Submit Brief", "Confirm Grading", "Get Results"]}
        />

        <div className="max-w-4xl mx-auto">
          <Card className="rounded-xl shadow-lg mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-brand">Confirm grading for this role</CardTitle>
              <CardDescription className="text-base">
                Review and adjust the importance weights for different grading dimensions. 
                Weights must sum to exactly 100%.
              </CardDescription>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {dimensions.map((dimension, index) => (
                <Card key={index} className="rounded-xl shadow-md">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dimension.name}</CardTitle>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold text-brand">
                          {weights[dimension.name] || 0}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={dimension.reason}
                      onChange={(e) => updateDimension(index, 'reason', e.target.value)}
                      placeholder="Why is this dimension important for the analysis?"
                      className="rounded-xl"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Importance Weight</span>
                        <span>0% - 100%</span>
                      </div>
                      <Slider
                        value={[weights[dimension.name] || 0]}
                        onValueChange={([value]) => updateWeight(dimension.name, value)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className={`rounded-xl border-2 ${
              isValidWeight ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <CardContent className="py-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className={`w-5 h-5 ${
                    isValidWeight ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      isValidWeight ? 'text-green-800' : 'text-red-800'
                    }`}>
                      Total Weight: {totalWeight.toFixed(1)}%
                    </p>
                    <p className={`text-sm ${
                      isValidWeight ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isValidWeight 
                        ? 'Perfect! Weights sum to 100%' 
                        : `Please adjust weights to sum to 100% (currently ${totalWeight.toFixed(1)}%)`
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !isValidWeight}
              className="w-full bg-brand hover:bg-brand-700 text-white py-6 rounded-xl text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Starting AI Search...
                </>
              ) : (
                'Start AI Search'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
