import { useState, useEffect } from 'react';
import axios from 'axios';

interface HealthResponse {
  success: boolean;
  message: string;
}

export default function HomePage(): JSX.Element {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async (): Promise<void> => {
      try {
        const response = await axios.get<HealthResponse>(
          'http://localhost:5000/api/health'
        );
        setHealthStatus(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to API'
        );
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            DocuMind AI
          </h1>
          <p className="text-slate-600 mb-8">
            AI-powered Document Intelligence Platform
          </p>

          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-2">
                API Health
              </h2>
              {loading && (
                <div className="text-slate-600">Checking API status...</div>
              )}
              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              {healthStatus && (
                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <div className="text-green-800 font-medium">
                    {healthStatus.message}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                <strong>Phase 1:</strong> Project Foundation & Architecture
              </p>
              <p className="text-xs text-slate-500 mt-2">
                This is a foundation-only release. Full features coming in later
                phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
