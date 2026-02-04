'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { track } from '@vercel/analytics';

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

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [playerEntries, setPlayerEntries] = useState('');
  const [prizeName, setPrizeName] = useState('');
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState('');
  const [drawingId, setDrawingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [drawingName, setDrawingName] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/drawings');
    router.refresh();
  };

  const loadSampleData = async () => {
    try {
      const response = await fetch('/sample-data.json');
      const data = await response.json();
      if (data.players) {
        setPlayers(data.players);
      }
      if (data.prizes) {
        setPrizes(data.prizes);
      }
      track('Sample Data Loaded', {
        playerCount: data.players?.length || 0,
        prizeCount: data.prizes?.length || 0,
      });
    } catch (error) {
      console.error('Error loading sample data:', error);
      alert('Could not load sample data. Make sure sample-data.json exists in the public folder.');
    }
  };

  const addPlayer = () => {
    if (playerName && playerEntries) {
      const entries = parseInt(playerEntries);
      if (entries > 0) {
        setPlayers([...players, { name: playerName, entries }]);
        setPlayerName('');
        setPlayerEntries('');
        setError('');
      } else {
        setError('Entries must be greater than 0');
      }
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const addPrize = () => {
    if (prizeName) {
      setPrizes([...prizes, { name: prizeName }]);
      setPrizeName('');
    }
  };

  const removePrize = (index: number) => {
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  const conductDrawing = async () => {
    if (!drawingName.trim()) {
      setError('Please enter a name for the drawing');
      return;
    }
    if (players.length === 0) {
      setError('Please add at least one player');
      return;
    }
    if (prizes.length === 0) {
      setError('Please add at least one prize');
      return;
    }
    if (players.length < prizes.length) {
      setError('Number of players must be greater than or equal to number of prizes');
      return;
    }

    setError('');
    setIsDrawing(true);
    setWinners([]);
    setDrawingId(null);

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 500));

    const playerRolls: { player: string; highestRoll: number; allRolls: number[] }[] = [];

    // For each player, roll for each entry and keep the highest
    players.forEach(player => {
      let highestRoll = 0;
      const rolls: number[] = [];
      for (let i = 0; i < player.entries; i++) {
        const roll = Math.floor(Math.random() * 1000) + 1;
        rolls.push(roll);
        if (roll > highestRoll) {
          highestRoll = roll;
        }
      }
      playerRolls.push({ player: player.name, highestRoll, allRolls: rolls });
    });

    // Sort by highest roll descending
    playerRolls.sort((a, b) => b.highestRoll - a.highestRoll);

    // Assign prizes to top rollers
    const results: Winner[] = playerRolls.map((roll, index) => ({
      player: roll.player,
      highestRoll: roll.highestRoll,
      allRolls: roll.allRolls,
      prize: index < prizes.length ? prizes[index].name : 'No prize',
      rank: index + 1,
    }));

    setWinners(results);
    setIsDrawing(false);

    // Save drawing results
    await saveDrawing(results);
  };

  const saveDrawing = async (results: Winner[]) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: drawingName || 'Unnamed Drawing',
          players,
          prizes,
          winners: results,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDrawingId(data.id);
        
        // Track drawing conducted event
        track('Drawing Conducted', {
          drawingName: drawingName || 'Unnamed Drawing',
          playerCount: players.length,
          prizeCount: prizes.length,
          totalEntries: players.reduce((sum, p) => sum + p.entries, 0),
        });
      }
    } catch (error) {
      console.error('Error saving drawing:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyDrawingLink = () => {
    if (drawingId) {
      const url = `${window.location.origin}/drawing/${drawingId}`;
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      
      // Track link copy event
      track('Drawing Link Copied', {
        drawingId,
        drawingName: drawingName || 'Unnamed Drawing',
      });
    }
  };

  const getOrdinalSuffix = (num: number) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Contest Drawing
          </h1>
          <p className="text-gray-400 text-lg mb-6">BB Outlands Monthly Prize System</p>
          
          {/* Drawing Name Input */}
          <div className="max-w-md mx-auto mb-4">
            <input
              type="text"
              placeholder="Drawing name (e.g., December 2024 Monthly Drawing)"
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-gray-500 text-center"
            />
          </div>
          
          {/* View All Drawings Link */}
          <Link
            href="/drawings"
            className="inline-block text-gray-400 hover:text-white underline text-sm"
          >
            View all past drawings
          </Link>
        </div>

        {/* Players Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Players</h2>
            <button
              onClick={loadSampleData}
              className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700"
            >
              Load Sample Data
            </button>
          </div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-950/50 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Player name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                className="flex-1 px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-gray-500"
              />
              <input
                type="number"
                placeholder="Entries"
                value={playerEntries}
                onChange={(e) => setPlayerEntries(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                min="1"
                className="w-full sm:w-32 px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-gray-500"
              />
              <button
                onClick={addPlayer}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  <span className="font-medium">
                    {player.name} <span className="text-gray-500">· {player.entries} {player.entries === 1 ? 'entry' : 'entries'}</span>
                  </span>
                  <button
                    onClick={() => removePlayer(index)}
                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prizes Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Prizes</h2>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Prize name"
                value={prizeName}
                onChange={(e) => setPrizeName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPrize()}
                className="flex-1 px-4 py-3 bg-black border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-gray-500"
              />
              <button
                onClick={addPrize}
                className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="space-y-2">
              {prizes.map((prize, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
                >
                  <span className="font-medium">
                    <span className="text-gray-500">#{index + 1}</span> {prize.name}
                  </span>
                  <button
                    onClick={() => removePrize(index)}
                    className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conduct Drawing Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={conductDrawing}
            disabled={players.length === 0 || prizes.length === 0 || isDrawing}
            className="px-8 py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-gray-200 disabled:bg-zinc-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
          >
            {isDrawing ? '🎲 Drawing...' : '🎲 Conduct Drawing'}
          </button>
        </div>

        {/* Results Section */}
        {winners.length > 0 && (
          <>
            {/* Share Link Section */}
            {drawingId && (
              <div className="mb-8 text-center">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 inline-block">
                  <p className="text-gray-400 text-sm mb-3">Share this drawing with your guild:</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      readOnly
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}/drawing/${drawingId}`}
                      className="flex-1 px-4 py-2 bg-black border border-zinc-800 rounded-lg text-sm font-mono text-gray-300"
                    />
                    <button
                      onClick={copyDrawingLink}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm whitespace-nowrap"
                    >
                      📋 Copy Link
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Winners Summary */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Winners
              </h2>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="space-y-3">
                  {winners.filter((_, index) => index < prizes.length).map((winner) => (
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
                {winners.map((winner) => (
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
          </>
        )}
      </div>
    </div>
  );
}
