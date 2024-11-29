'use client';

import { useState, useTransition } from 'react';
import { analyze } from './actions/analyzer';
import { LucideGithub } from 'lucide-react'; // Add this import

export default function Sentimenter() {
  const [url, setUrl] = useState('');
  const [sentimentScore, setSentimentScore] = useState<number | undefined | null>(null);
  const [sentimentLabel, setSentimentLabel] = useState<string | undefined | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    setError(null);

    if (!url) {
      setError('Please enter a URL.');
      return;
    }

    startTransition(async () => {
      try {
        const data = await analyze(url);
        setSentimentScore(data?.sentiment.document.score);
        setSentimentLabel(data?.sentiment.document.label);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">Sentimenter</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Enter URL
            </label>
            <input
              id="url"
              type="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-600"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full py-2 px-4 rounded-md text-white ${
              isPending ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isPending ? 'Analyzing...' : 'Submit'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        {sentimentScore !== null && sentimentLabel !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md shadow-sm">
            <p className="text-sm text-gray-600">
              <strong>Sentiment Score:</strong> {sentimentScore}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Label:</strong> {sentimentLabel}
            </p>
          </div>
        )}
      </div>
      
      {/* Made By Adeeb block */}
      <a
        href="https://github.com/Itachi-Uchiha581"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <LucideGithub size={20} />
        <span className="text-sm font-medium">Made by Adeeb</span>
      </a>
    </div>
  );
}