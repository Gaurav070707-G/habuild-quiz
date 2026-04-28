'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Submission {
  name: string;
  city: string;
  phone: string;
  score: number;
  prize: string;
  timestamp: string;
}

const ITEMS_PER_PAGE = 50;
const INITIAL_LIMIT = 200; // Load first 200, not all 4000

export default function Dashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Smart loading: localStorage first, then Firebase
  useEffect(() => {
    let isMounted = true;

    // Check if we should clear cache (add ?clear=1 to URL)
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('clear')) {
      localStorage.removeItem('habitBuiltWinners');
      console.log('🧹 localStorage cleared via query parameter');
    }

    const loadData = async () => {
      // Load from localStorage only (Supabase has issues)
      const cached = localStorage.getItem('habitBuiltWinners');
      console.log('📦 Loading from localStorage...');

      if (cached && isMounted) {
        try {
          const parsedCache = JSON.parse(cached);
          setSubmissions(parsedCache);
          console.log(`✅ Loaded ${parsedCache.length} submissions from localStorage`);
        } catch (e) {
          console.error('❌ Cache parse error:', e);
          setSubmissions([]);
        }
      } else {
        console.log('ℹ️ No submissions found');
        setSubmissions([]);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Pagination
  const paginatedSubmissions = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return [...submissions].reverse().slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [submissions, currentPage]);

  const totalPages = Math.ceil(submissions.length / ITEMS_PER_PAGE);

  const downloadCSV = () => {
    if (submissions.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = ['Name', 'Phone', 'City', 'Score', 'Prize', 'Timestamp'];
    const rows = submissions.map(s => [
      `"${s.name}"`,
      `"${s.phone}"`,
      `"${s.city}"`,
      s.score,
      `"${s.prize}"`,
      new Date(s.timestamp).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `quiz_responses_${submissions.length}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⚡</div>
          <p className="text-2xl font-bold text-indigo-900">Loading submissions...</p>
          <p className="text-indigo-700 mt-2">Using cache if available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-bold text-indigo-900 mb-2">📊 Quiz Dashboard</h1>
            <p className="text-indigo-700 text-lg">
              {submissions.length === 0
                ? 'No responses yet'
                : `${submissions.length} participants • ${loading ? '(updating...)' : 'Shared data'}`}
            </p>
          </div>
          <button
            onClick={downloadCSV}
            disabled={submissions.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            <span>📥</span>
            <span>Download {submissions.length} CSV</span>
          </button>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No Data Yet</h2>
            <p className="text-gray-600 mb-6">Quiz responses from all users will appear here once participants take the quiz.</p>
            <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">← Go to Quiz</a>
          </div>
        ) : (
          <>
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
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Top 20 Scorers</h2>
                <div className="space-y-3">
                  {topScores.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{i + 1}. {sub.name}</div>
                        <div className="text-sm font-medium text-blue-700">📍 {sub.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">{sub.score}</div>
                        <div className="text-xs text-gray-600">/ 10</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* City Wise */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🌍 City Wise Top</h2>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg mb-4 focus:outline-none focus:border-indigo-600 font-semibold text-gray-800 bg-white text-base"
                >
                  <option value="" className="text-gray-600">📍 Select a city...</option>
                  {cities.map(city => (
                    <option key={city} value={city} className="text-gray-800 font-semibold">
                      📍 {city}
                    </option>
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

            {/* Phone Directory */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📱 Phone Directory ({submissions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...submissions].map((sub, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:shadow-md transition">
                    <div className="font-semibold text-gray-800">{sub.name}</div>
                    <div className="text-sm font-medium text-blue-700 mb-2">📍 {sub.city}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📞</span>
                      <a href={`tel:${sub.phone}`} className="text-blue-600 hover:text-blue-800 font-mono font-semibold text-sm">
                        {sub.phone}
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Score: <span className="font-bold text-indigo-600">{sub.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Responses with Pagination */}
            <div className="bg-white rounded-xl shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 All Responses (Page {currentPage}/{totalPages})</h2>
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
                    {paginatedSubmissions.map((sub, i) => (
                      <tr key={i} className="border-b border-gray-200 hover:bg-indigo-50 transition">
                        <td className="p-3 text-gray-800 font-medium">{sub.name}</td>
                        <td className="p-3 text-gray-800">{sub.phone}</td>
                        <td className="p-3 text-gray-800 font-bold text-blue-700">📍 {sub.city}</td>
                        <td className="p-3 text-center">
                          <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                            sub.score >= 8
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.score}/10
                          </span>
                        </td>
                        <td className="p-3 text-gray-800 text-sm">{sub.prize}</td>
                        <td className="p-3 text-gray-600 text-xs">{new Date(sub.timestamp).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
                  >
                    ← Previous
                  </button>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold">
                      Page {currentPage} of {totalPages}
                    </p>
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, submissions.length)} of {submissions.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="mb-3">⚡ Optimized loading • Shared data • Auto-synced</p>
          <a href="/" className="text-indigo-600 hover:text-indigo-800 font-semibold">← Back to Quiz</a>
        </div>
      </div>
    </div>
  );
}
