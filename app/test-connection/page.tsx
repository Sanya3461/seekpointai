'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResult {
  timestamp: string;
  tests: {
    supabaseConnection: boolean;
    drizzleConnection: boolean;
    supabaseAuth: boolean;
    supabaseTables: string[];
    drizzleTables: string[];
  };
  errors: string[];
}

export default function ConnectionTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        timestamp: new Date().toISOString(),
        tests: {
          supabaseConnection: false,
          drizzleConnection: false,
          supabaseAuth: false,
          supabaseTables: [],
          drizzleTables: []
        },
        errors: [`Fetch error: ${error}`]
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge variant="default" className="bg-green-500">Sikeres</Badge>
    ) : (
      <Badge variant="destructive">Sikertelen</Badge>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔍 Supabase Kapcsolat Tesztelő
          </CardTitle>
          <CardDescription>
            Teszteld a Supabase és adatbázis kapcsolatokat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Button 
              onClick={runTest} 
              disabled={loading}
              className="min-w-[200px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tesztelés...
                </>
              ) : (
                'Kapcsolat Tesztelése'
              )}
            </Button>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                Teszt időpontja: {new Date(result.timestamp).toLocaleString('hu-HU')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.tests.supabaseConnection)}
                      Supabase Kapcsolat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStatusBadge(result.tests.supabaseConnection)}
                    {result.tests.supabaseTables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Táblák:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.tests.supabaseTables.map((table, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.tests.drizzleConnection)}
                      Drizzle Kapcsolat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStatusBadge(result.tests.drizzleConnection)}
                    {result.tests.drizzleTables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Táblák:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.tests.drizzleTables.map((table, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {table}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(result.tests.supabaseAuth)}
                      Supabase Auth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getStatusBadge(result.tests.supabaseAuth)}
                  </CardContent>
                </Card>
              </div>

              {result.errors.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Hibák
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {result.errors.map((error, i) => (
                        <li key={i} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
