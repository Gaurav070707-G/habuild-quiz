'use client';

import { useState, useMemo } from 'react';

interface Submission {
  name: string;
  city: string;
  phone: string;
  score: number;
  prize: string;
  timestamp: string;
}

export default function Dashboard() {
  const [selectedCity, setSelectedCity] = useState('');

  // Load data from localStorage on mount
  const [submissions] = useState<Submission[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('habitBuiltWinners');
    return stored ? JSON.parse(stored) : [];
  });

  // Memoized calculations
  const stats = useMemo(() => ({
    total: submissions.length,
    winners: submissions.filter(s => s.score >= 8).length,
    winRate: submissions.length ? Math.round((submissions.filter(s => s.score >= 8).length / submissions.length) * 100) : 0,
  }), [submissions]);

  const cities = useMemo(() =>
    [...new Set(submissions.map(s => s.city))].sort(),
    [submissions]
  );

  const topScores = useMemo(() =>
    [...submissions].sort((a, b) => b.score - a.score).slice(0, 20),
    [submissions]
  );

  const cityData = useMemo(() => {
    if (!selectedCity) return [];
    return [...submissions]
      .filter(s => s.city === selectedCity)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
  }, [selectedCity, submissions]);

  const prizeBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    submissions.forEach(s => {
      breakdown[s.prize] = (breakdown[s.prize] || 0) + 1;
    });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  }, [submissions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-indigo-900 mb-2">📊 Quiz Dashboard</h1>
          <p className="text-indigo-700 text-lg">Real-time participant tracking</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600 mt-2">Total Responses</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="text-4xl font-bold text-green-600">{stats.winners}</div>
            <div className="text-gray-600 mt-2">Winners (8+)</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="text-4xl font-bold text-purple-600">{stats.winRate}%</div>
            <div className="text-gray-600 mt-2">Win Rate</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="text-4xl font-bold text-orange-600">{cities.length}</div>
            <div className="text-gray-600 mt-2">Cities</div>
          </div>
        </div>

        {/* Prize Breakdown */}
        {prizeBreakdown.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎁 Prize Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {prizeBreakdown.map(([prize, count]) => (
                <div key={prize} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                  <div className="text-3xl font-bold text-indigo-600">{count}</div>
                  <div className="text-sm text-gray-700 mt-2 line-clamp-2">{prize}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Scorers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Top Scorers</h2>
            {topScores.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No responses yet</p>
            ) : (
              <div className="space-y-3">
                {topScores.map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{i + 1}. {sub.name}</div>
                      <div className="text-sm text-gray-600">{sub.city}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{sub.score}</div>
                      <div className="text-xs text-gray-600">/ 10</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* City Wise */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🌍 City Wise Top</h2>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-600 font-medium"
            >
              <option value="">Select a city...</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {selectedCity ? (
              <div className="space-y-3">
                {cityData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No data for this city</p>
                ) : (
                  cityData.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">#{i + 1} {sub.name}</div>
                        <div className="text-xs text-gray-600">{sub.phone}</div>
                      </div>
                      <div className="font-bold text-green-600">{sub.score}/10</div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-12">Choose a city to see top scores</p>
            )}
          </div>
        </div>

        {/* Recent Responses */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 Recent Responses (Last 10)</h2>
          {submissions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No responses yet. Quiz not taken.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-indigo-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Phone</th>
                    <th className="text-left p-3 font-semibold text-gray-700">City</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Score</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Prize</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {[...submissions].reverse().slice(0, 10).map((sub, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-indigo-50 transition">
                      <td className="p-3 text-gray-800">{sub.name}</td>
                      <td className="p-3 text-gray-800">{sub.phone}</td>
                      <td className="p-3 text-gray-800">{sub.city}</td>
                      <td className="p-3 text-center">
                        <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                          sub.score >= 8
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sub.score}/10
                        </span>
                      </td>
                      <td className="p-3 text-gray-800">{sub.prize}</td>
                      <td className="p-3 text-gray-600 text-xs">{new Date(sub.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-3">Data stored locally • Auto-updates when quiz is taken</p>
          <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">← Back to Quiz</a>
        </div>
      </div>
    </div>
  );
}
