import { Metadata } from 'next';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyLinkButton from './CopyLinkButton';

interface Player {
  name: string;
  entries: number;
}

interface Prize {
  name: string;
}

interface Winner {
  player: string;
  highestRoll: number;
  allRolls: number[];
  prize: string;
  rank: number;
}

interface Drawing {
  id: string;
  name: string;
  timestamp: string;
  players: Player[];
  prizes: Prize[];
  winners: Winner[];
}

async function getDrawing(id: string): Promise<Drawing | null> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'drawings', `${id}.json`);
    
    if (!existsSync(filePath)) {
      return null;
    }
    
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading drawing:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const drawing = await getDrawing(id);
  
  if (!drawing) {
    return {
      title: 'Drawing Not Found',
    };
  }

  // Get top 3 winners for description
  const topWinners = drawing.winners
    .filter((_, index) => index < Math.min(3, drawing.prizes.length))
    .map((w, idx) => {
      const suffix = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
      return `${suffix} ${w.player} (${w.highestRoll})`;
    })
    .join(' • ');

  const description = `Winners: ${topWinners}`;

  return {
    title: `${drawing.name} - UO Outlands Drawing`,
    description,
    openGraph: {
      title: drawing.name,
      description,
      type: 'website',
      siteName: 'UO Outlands Guild Drawings',
    },
    twitter: {
      card: 'summary_large_image',
      title: drawing.name,
      description,
    },
  };
}

function getOrdinalSuffix(num: number) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
}

export default async function DrawingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drawing = await getDrawing(id);

  if (!drawing) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            {drawing.name}
          </h1>
          <p className="text-gray-400 mb-4">
            {new Date(drawing.timestamp).toLocaleString()}
          </p>
          <div className="flex justify-center gap-4">
            <CopyLinkButton />
            <Link
              href="/drawings"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 text-sm"
            >
              All Drawings
            </Link>
          </div>
        </div>

        {/* Winners Summary */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Winners
          </h2>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="space-y-3">
              {drawing.winners.filter((_, index) => index < drawing.prizes.length).map((winner) => (
                <div
                  key={winner.rank}
                  className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg font-bold text-sm">
                      {getOrdinalSuffix(winner.rank)}
                    </div>
                    <div>
                      <div className="font-semibold">{winner.player}</div>
                      <div className="text-sm text-gray-400">Roll: {winner.highestRoll}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Prize</div>
                    <div className="font-semibold">{winner.prize}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Detailed Results
          </h2>
          
          <div className="space-y-4">
            {drawing.winners.map((winner) => (
              <div
                key={winner.rank}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg text-2xl font-bold">
                    {winner.rank}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-semibold mb-3">{winner.player}</div>
                    
                    <div className="mb-3">
                      <span className="text-gray-400 text-sm">Highest Roll: </span>
                      <span className="text-white font-bold text-lg">{winner.highestRoll}</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm mb-2">All Rolls ({winner.allRolls.length}):</div>
                      <div className="flex flex-wrap gap-2">
                        {winner.allRolls.sort((a, b) => b - a).map((roll, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-lg font-mono text-sm ${
                              roll === winner.highestRoll
                                ? 'bg-white text-black font-bold'
                                : 'bg-zinc-800 text-gray-300'
                            }`}
                          >
                            {roll}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800">
                      <span className="text-gray-400 text-sm">Prize: </span>
                      <span className="text-white font-semibold">{winner.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
