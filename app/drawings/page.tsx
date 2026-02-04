'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DrawingSummary {
  id: string;
  name: string;
  timestamp: string;
  playerCount: number;
  prizeCount: number;
}

export default function DrawingsPage() {
  const [drawings, setDrawings] = useState<DrawingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDrawings() {
      try {
        const response = await fetch('/api/drawings/list');
        if (!response.ok) {
          throw new Error('Failed to load drawings');
        }
        const data = await response.json();
        setDrawings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drawings');
      } finally {
        setLoading(false);
      }
    }

    loadDrawings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading drawings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <Link href="/" className="text-gray-400 hover:text-white underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            All Drawings
          </h1>
          <p className="text-gray-400 text-lg">View past guild drawing results</p>
        </div>

        {/* Drawings List */}
        {drawings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No drawings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {drawings.map((drawing) => (
              <Link
                key={drawing.id}
                href={`/drawing/${drawing.id}`}
                className="block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-semibold mb-2 truncate">
                      {drawing.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span>📅 {new Date(drawing.timestamp).toLocaleDateString()}</span>
                      <span>🕐 {new Date(drawing.timestamp).toLocaleTimeString()}</span>
                      <span>👥 {drawing.playerCount} players</span>
                      <span>🎁 {drawing.prizeCount} prizes</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-gray-400 hover:text-white transition-colors">
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
