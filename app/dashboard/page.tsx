'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, query, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [top100Page, setTop100Page] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const loadData = async () => {
      // Load cached data immediately
      const cached = localStorage.getItem('habitBuiltWinners');
      if (cached) {
        try {
          setWinners(JSON.parse(cached));
          setLoading(false);
        } catch (e) {
          console.error('Failed to parse cached data:', e);
        }
      }

      // Fetch fresh data from Firebase with 3-second timeout
      try {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            if (!cached) {
              setError('Firebase is taking too long. Please try again later.');
              setLoading(false);
            }
          }
        }, 3000);

        const q = query(collection(db, 'winners'));
        const snapshot = await new Promise<QuerySnapshot>((resolve, reject) => {
          const unsubscribe = onSnapshot(
            q,
            (snap) => {
              unsubscribe();
              resolve(snap);
            },
            reject
          );
        });

        if (!isMounted) return;

        const winnersData: Winner[] = [];
        snapshot.forEach((doc: any) => {
          winnersData.push(doc.data() as Winner);
        });

        if (timeoutId) clearTimeout(timeoutId);
        setWinners(winnersData);
        setLoading(false);
        setError('');

        // Cache to localStorage
        localStorage.setItem('habitBuiltWinners', JSON.stringify(winnersData));
      } catch (error) {
        if (!isMounted) return;

        if (timeoutId) clearTimeout(timeoutId);
        console.error('Firebase error:', error);

        const cached = localStorage.getItem('habitBuiltWinners');
        if (cached) {
          setError('Using cached data - offline mode');
          setLoading(false);
        } else {
          setError('Failed to load data. Please refresh the page.');
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const totalParticipants = useMemo(() => winners.length, [winners]);
  const totalWinners = useMemo(() => winners.filter((w) => w.score >= 8).length, [winners]);

  const prizeStats = useMemo(() => {
    return winners.reduce(
      (acc, w) => {
        acc[w.prize] = (acc[w.prize] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [winners]);

  const top100Full = useMemo(() => {
    return [...winners]
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }, [winners]);

  const itemsPerPage = 25;
  const top100 = useMemo(() => {
    return top100Full.slice(top100Page * itemsPerPage, (top100Page + 1) * itemsPerPage);
  }, [top100Full, top100Page]);

  const top100Pages = Math.ceil(top100Full.length / itemsPerPage);

  const cities = useMemo(() => {
    return [...new Set(winners.map((w) => w.city))].sort();
  }, [winners]);

  const cityTop10 = useMemo(() => {
    return selectedCity
      ? [...winners]
          .filter((w) => w.city === selectedCity)
          .sort((a, b) => b.score - a.score)
          .slice(0, 10)
      : [];
  }, [selectedCity, winners]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-purple-600 mx-auto mb-4"></div>
          <div className="text-2xl text-gray-700">Loading Dashboard...</div>
          <div className="text-sm text-gray-600 mt-2">(This may take up to 5 seconds)</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            Habuild Yoga Quiz Dashboard 🧘
          </h1>
          <p className="text-gray-700">Track quiz participants and leaderboards</p>
          {error && (
            <div className="mt-4 p-4 bg-amber-100 border border-amber-400 rounded-lg">
              <p className="text-amber-800 text-sm">{error}</p>
            </div>
          )}
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
                {top100Full.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No participants yet!</p>
                ) : (
                  <>
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
                              <td className="p-3 font-bold text-gray-800">#{top100Page * itemsPerPage + idx + 1}</td>
                              <td className="p-3 text-gray-800">{winner.name}</td>
                              <td className="p-3 text-gray-800">{winner.city}</td>
                              <td className="p-3">
                                <span
                                  className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                    winner.score >= 13
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {winner.score}/15
                                </span>
                              </td>
                              <td className="p-3 text-gray-800">{winner.prize}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {top100Pages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setTop100Page((p) => Math.max(0, p - 1))}
                          disabled={top100Page === 0}
                          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-300"
                        >
                          ← Previous
                        </button>
                        <span className="text-gray-700 font-semibold">
                          Page {top100Page + 1} of {top100Pages}
                        </span>
                        <button
                          onClick={() => setTop100Page((p) => Math.min(top100Pages - 1, p + 1))}
                          disabled={top100Page === top100Pages - 1}
                          className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 disabled:opacity-50 hover:bg-gray-300"
                        >
                          Next →
                        </button>
                      </div>
                    )}
                  </>
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
                                      winner.score >= 13
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {winner.score}/15
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
