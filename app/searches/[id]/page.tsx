import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { Brain, Clock, CheckCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

interface SearchStatusPageProps {
  params: {
    id: string;
  };
}

export default async function SearchStatusPage({ params }: SearchStatusPageProps) {
  const search = await db.query.searches.findFirst({
    where: eq(db.searches.id, params.id),
    with: {
      attachments: true,
      events: true,
    },
  });

  if (!search) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getCurrentStep = () => {
    switch (search.status) {
      case 'ready': return 3;
      case 'processing': return 3;
      case 'grading_confirmed': return 3;
      default: return 2;
    }
  };

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
          currentStep={getCurrentStep()} 
          totalSteps={3} 
          labels={["Submit Brief", "Confirm Grading", "Get Results"]}
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Status Card */}
          <Card className="rounded-xl shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-brand">{search.name}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Submitted on {new Date(search.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(search.status)} px-4 py-2`}>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(search.status)}
                    <span className="capitalize">{search.status.replace('_', ' ')}</span>
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-gray-600">{search.contactName}</p>
                  <p className="text-gray-600">{search.contactEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
                  <p className="text-gray-600">
                    {search.attachments.length} file(s) uploaded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Details */}
          {search.status === 'processing' && (
            <Card className="rounded-xl shadow-md">
              <CardContent className="py-6">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Search in Progress</h4>
                    <p className="text-gray-600">
                      Our AI is sourcing and grading candidates for your role. 
                      This typically takes 6-24 hours. We'll email you when it's ready.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {search.status === 'ready' && search.resultUrl && (
            <Card className="rounded-xl shadow-md">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Search Complete</h4>
                      <p className="text-gray-600">Your AI candidate search results are ready to view.</p>
                    </div>
                  </div>
                  <Button asChild className="bg-brand hover:bg-brand-700 text-white rounded-xl">
                    <a href={search.resultUrl} target="_blank" rel="noopener noreferrer">
                      View Results
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {search.status === 'failed' && (
            <Card className="rounded-xl shadow-md border-red-200">
              <CardContent className="py-6">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h4 className="font-semibold text-red-900">Search Failed</h4>
                    <p className="text-red-700">
                      There was an issue processing your search. Our team has been notified and will contact you shortly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Dimensions */}
          {search.dimensions && (
            <Card className="rounded-xl shadow-md">
              <CardHeader>
                <CardTitle>Grading Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                {search.criteria && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium mb-2">Search Criteria</h5>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {(search.criteria as any).job_title && (
                        <div>
                          <span className="text-gray-600">Title:</span> {(search.criteria as any).job_title}
                        </div>
                      )}
                      {(search.criteria as any).seniority && (
                        <div>
                          <span className="text-gray-600">Seniority:</span> {(search.criteria as any).seniority}
                        </div>
                      )}
                      {(search.criteria as any).location_preference && (
                        <div>
                          <span className="text-gray-600">Location:</span> {(search.criteria as any).location_preference}
                        </div>
                      )}
                      {(search.criteria as any).must_have_keywords && (
                        <div>
                          <span className="text-gray-600">Must-have:</span> {(search.criteria as any).must_have_keywords}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid gap-4">
                  {(search.dimensions as any[]).map((dimension: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{dimension.name}</h5>
                        <Badge variant="outline">
                          {search.weights && (search.weights as any)[dimension.name]}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{dimension.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
