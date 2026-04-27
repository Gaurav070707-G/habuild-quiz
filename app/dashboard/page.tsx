'use client';

import { useState, useEffect } from 'react';

interface Winner {
  name: string;
  city: string;
  phone: string;
  score: number;
  prize: string;
  timestamp: string;
}

type TabType = 'overview' | 'top100' | 'citywise';

export default function Dashboard() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCity, setSelectedCity] = useState<string>('');

  useEffect(() => {
    // Load from localStorage only - instant and no dependencies
    const stored = localStorage.getItem('habitBuiltWinners');
    if (stored) {
      try {
        setWinners(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse localStorage data:', e);
      }
    }
  }, []);

  // Derived data calculations
  const totalParticipants = winners.length;
  const totalWinners = winners.filter((w) => w.score >= 8).length;

  const prizeStats = winners.reduce(
    (acc, w) => {
      acc[w.prize] = (acc[w.prize] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const top100 = [...winners]
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);

  const cities = [...new Set(winners.map((w) => w.city))].sort();

  const cityTop10 = selectedCity
    ? [...winners]
        .filter((w) => w.city === selectedCity)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            Habuild Yoga Quiz Dashboard 🧘
          </h1>
          <p className="text-gray-700">Track quiz participants and leaderboards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{totalParticipants}</div>
            <div className="text-gray-700 font-semibold">Total Participants</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600">{totalWinners}</div>
            <div className="text-gray-700 font-semibold">Winners (8+/10)</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600">
              {totalParticipants > 0 ? Math.round((totalWinners / totalParticipants) * 100) : 0}%
            </div>
            <div className="text-gray-700 font-semibold">Win Rate</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'overview'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('top100')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'top100'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏆 Top 100
            </button>
            <button
              onClick={() => setActiveTab('citywise')}
              className={`flex-1 px-6 py-4 font-semibold text-center transition ${
                activeTab === 'citywise'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌍 City Wise Top 10
            </button>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                {Object.keys(prizeStats).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Prize Distribution 🎁</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {Object.entries(prizeStats).map(([prize, count]) => (
                        <div key={prize} className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-gray-800">{count}</div>
                          <div className="text-sm text-gray-700">{prize}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Participants</h2>
                {winners.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No participants yet!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="p-3 font-semibold text-gray-700">Name</th>
                          <th className="p-3 font-semibold text-gray-700">Phone</th>
                          <th className="p-3 font-semibold text-gray-700">City</th>
                          <th className="p-3 font-semibold text-gray-700">Score</th>
                          <th className="p-3 font-semibold text-gray-700">Prize</th>
                          <th className="p-3 font-semibold text-gray-700">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...winners].reverse().slice(0, 20).map((winner, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3 text-gray-800">{winner.name}</td>
                            <td className="p-3 text-gray-800">{winner.phone}</td>
                            <td className="p-3 text-gray-800">{winner.city}</td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                  winner.score >= 8
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {winner.score}/10
                              </span>
                            </td>
                            <td className="p-3 text-gray-800">{winner.prize}</td>
                            <td className="p-3 text-xs text-gray-600">{new Date(winner.timestamp).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Top 100 Tab */}
            {activeTab === 'top100' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Top 100 Leaderboard</h2>
                {top100.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No participants yet!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-300">
                          <th className="p-3 font-semibold text-gray-700">Rank</th>
                          <th className="p-3 font-semibold text-gray-700">Name</th>
                          <th className="p-3 font-semibold text-gray-700">City</th>
                          <th className="p-3 font-semibold text-gray-700">Score</th>
                          <th className="p-3 font-semibold text-gray-700">Prize</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top100.map((winner, idx) => (
                          <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                            <td className="p-3 font-bold text-gray-800">#{idx + 1}</td>
                            <td className="p-3 text-gray-800">{winner.name}</td>
                            <td className="p-3 text-gray-800">{winner.city}</td>
                            <td className="p-3">
                              <span
                                className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                  winner.score >= 8
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {winner.score}/10
                              </span>
                            </td>
                            <td className="p-3 text-gray-800">{winner.prize}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* City Wise Tab */}
            {activeTab === 'citywise' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🌍 Top 10 by City</h2>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  >
                    <option value="">-- Choose a City --</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCity && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Top 10 in {selectedCity} 🏅</h3>
                    {cityTop10.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No participants from this city</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b-2 border-gray-300">
                              <th className="p-3 font-semibold text-gray-700">Rank</th>
                              <th className="p-3 font-semibold text-gray-700">Name</th>
                              <th className="p-3 font-semibold text-gray-700">Score</th>
                              <th className="p-3 font-semibold text-gray-700">Prize</th>
                              <th className="p-3 font-semibold text-gray-700">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cityTop10.map((winner, idx) => (
                              <tr key={idx} className="border-b border-gray-200 hover:bg-purple-50">
                                <td className="p-3 font-bold text-gray-800">#{idx + 1}</td>
                                <td className="p-3 text-gray-800">{winner.name}</td>
                                <td className="p-3">
                                  <span
                                    className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                      winner.score >= 8
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {winner.score}/10
                                  </span>
                                </td>
                                <td className="p-3 text-gray-800">{winner.prize}</td>
                                <td className="p-3 text-xs text-gray-600">{new Date(winner.timestamp).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>Data is stored locally in your browser</p>
          <a href="/" className="text-green-600 hover:text-green-700 font-semibold">
            ← Back to Quiz
          </a>
        </div>
      </div>
    </div>
  );
}
