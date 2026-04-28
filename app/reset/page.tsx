'use client';

import { useEffect, useState } from 'react';

export default function ResetPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear localStorage
    try {
      localStorage.removeItem('habitBuiltWinners');
      console.log('✅ localStorage cleared');
      setCleared(true);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {cleared ? (
          <>
            <div className="text-6xl mb-6">✨</div>
            <h1 className="text-3xl font-bold text-green-700 mb-4">
              All Clear!
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Quiz data has been reset. Redirecting you home...
            </p>
            <p className="text-sm text-gray-500">
              (If not redirected, <a href="/" className="text-green-600 hover:underline">click here</a>)
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6 animate-spin">🔄</div>
            <h1 className="text-3xl font-bold text-gray-700 mb-4">
              Resetting Quiz Data...
            </h1>
            <p className="text-xl text-gray-700">
              Please wait...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
