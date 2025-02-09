'use client';
import { useState, useTransition } from 'react';
import { analyze } from './actions/analyzer';
import { LucideGithub } from 'lucide-react';
import Image from 'next/image';

export default function Sentimenter() {
  const [url, setUrl] = useState('');
  const [sentimentScore, setSentimentScore] = useState<number | undefined | null>(null);
  const [sentimentLabel, setSentimentLabel] = useState<string | undefined | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    setError(null);
    setSentimentScore(null);
    setSentimentLabel(null);
    if (!url) {
      setError('Please enter a URL.');
      return;
    }
    startTransition(async () => {
      try {
        const data = await analyze(url);
        if (data?.sentiment?.document) {
          setSentimentScore(data.sentiment.document.score);
          setSentimentLabel(data.sentiment.document.label);
        } else {
          setError('Could not analyze the webpage.');
        }
      } catch (err) {
        console.error('Analysis failed:', err);
        setError('Could not analyze the webpage.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-start pt-12 px-4">
      {/* Logo Section */}
      <div className="mb-12">
        <Image
          src="/gemstone-ventures-logo.png"
          alt="Gemstone Ventures Logo"
          width={150}
          height={150}
          className="h-auto w-auto"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 border border-blue-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Sentiment Analysis</h1>
          <p className="text-blue-600">Made by Gemstone Ventures</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-semibold text-blue-700 mb-2">
              Website URL for Analysis
            </label>
            <input
              id="url"
              type="url"
              className="w-full px-4 py-3 rounded-lg border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 ${
              isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
            }`}
          >
            {isPending ? 'Analyzing...' : 'Analyze Sentiment'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {sentimentScore !== null && sentimentLabel !== null && (
          <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Analysis Results</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-blue-700 font-medium">Sentiment Score</p>
                <p className="text-2xl font-bold text-blue-900">{sentimentScore.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Sentiment Label</p>
                <p className="text-2xl font-bold text-blue-900 capitalize">{sentimentLabel}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Developer Attribution */}
      <a
        href="https://github.com/Itachi-Uchiha581"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 left-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <LucideGithub size={20} />
        <span className="text-sm font-medium">Developed by Adeeb</span>
      </a>
    </div>
  );
}