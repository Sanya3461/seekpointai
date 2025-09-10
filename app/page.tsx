import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileSearch, Target, CheckCircle, Users, Filter, Download, Shield, Globe, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <span className="text-xl font-bold text-brand">SeekPoint AI</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how" className="text-gray-600 hover:text-brand transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-brand transition-colors">Pricing</a>
              <Link href="/ai-search">
                <Button className="bg-brand hover:bg-brand-700 text-white">Start a Search</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6">
            Find and rank candidates{' '}
            <span className="text-brand">with AI.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your brief, confirm the grading, and get a ranked shortlist with notes in hours — not weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/ai-search">
              <Button size="lg" className="bg-brand hover:bg-brand-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
                Start an AI Search
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-brand text-brand hover:bg-accent-light">
              <a href="#how">See how it works</a>
            </Button>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand" />
              <span>Results in 6–24 hours</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-brand" />
              <span>ATS-ready exports</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How SeekPoint AI works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined 3-step process makes it easy to get AI-powered candidate rankings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileSearch className="w-8 h-8 text-brand" />
                </div>
                <CardTitle className="text-xl">Submit Brief</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Paste JD, add must-have keywords, location, seniority, and files. Our AI understands your requirements.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-brand" />
                </div>
                <CardTitle className="text-xl">Confirm Grading</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Review 4 dimensions + weights = 100%. Adjust importance for role fit, technical skills, domain experience, and team fit.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-brand" />
                </div>
                <CardTitle className="text-xl">Get Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Get a ranked list + notes, export links. Ready for your ATS or hiring manager review.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/ai-search">
              <Button size="lg" className="bg-brand hover:bg-brand-700 text-white px-8 py-4 rounded-xl">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Built for recruiting teams Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for recruiting teams
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to source, grade, and export candidates efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">Web-wide sourcing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Search across LinkedIn, GitHub, company sites, and professional networks
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">AI grading on your criteria</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Custom weights for role fit, technical skills, domain, and team fit
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">De-duplication</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically merge profiles across platforms and remove duplicates
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Filter className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">Location & seniority filters</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Filter by geography, experience level, and employment preferences
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Download className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">Export to Sheets/CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  One-click export to Google Sheets, CSV, or direct ATS integration
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-brand mx-auto mb-4" />
                <CardTitle className="text-lg">Private data, signed URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Secure candidate data with expiring links and privacy controls
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Use cases
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Perfect for different types of hiring challenges
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-brand">Tech hires</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Engineers, Data Scientists, Product Managers
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Stack-specific matching</li>
                  <li>• GitHub activity analysis</li>
                  <li>• Open source contributions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-brand">Ops/Back office at scale</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Customer Success, Sales, Operations
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Industry experience focus</li>
                  <li>• Communication skills priority</li>
                  <li>• Process improvement background</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-brand">Executive screening</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base mb-4">
                  Directors, VPs, C-level positions
                </CardDescription>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Leadership track record</li>
                  <li>• Company growth experience</li>
                  <li>• Board and investor relations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with a free trial, then choose the plan that fits your hiring volume
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="rounded-xl shadow-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="text-3xl font-bold text-brand">Free</div>
                <CardDescription>Perfect for trying SeekPoint AI</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 1 search included</li>
                  <li>• Up to 50 candidates</li>
                  <li>• Basic export options</li>
                  <li>• Email support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-lg border-2 border-brand">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Professional</CardTitle>
                <div className="text-3xl font-bold text-brand">$299<span className="text-lg font-normal">/search</span></div>
                <CardDescription>For active recruiting teams</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Unlimited candidates per search</li>
                  <li>• Advanced filtering</li>
                  <li>• ATS integrations</li>
                  <li>• Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-brand">Custom</div>
                <CardDescription>For large hiring organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Volume discounts</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated success manager</li>
                  <li>• SLA guarantees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 px-4 bg-brand">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start your first AI search — free trial available
          </h2>
          <p className="text-brand-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of recruiters who are already using AI to find better candidates faster
          </p>
          <Link href="/ai-search">
            <Button size="lg" className="bg-white text-brand hover:bg-gray-100 px-8 py-4 rounded-xl text-lg">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-secondary text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-brand rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">SP</span>
            </div>
            <span className="text-lg font-semibold">SeekPoint AI</span>
          </div>
          <p className="text-gray-400 mb-6">
            AI-powered candidate sourcing & grading for recruiters
          </p>
          <div className="flex justify-center space-x-8 mb-6 text-sm">
            <Link href="/ai-search" className="text-gray-400 hover:text-white transition-colors">Start a Search</Link>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="mailto:hello@seekpoint.ai" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-sm text-gray-500">
            © 2024 SeekPoint AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}