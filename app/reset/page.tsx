'use client';

import { useEffect, useState } from 'react';

export default function ResetPage() {
  const [status, setStatus] = useState('Clearing all data...');

  useEffect(() => {
    async function reset() {
      try {
        // 1. Clear localStorage
        localStorage.removeItem('habitBuiltWinners');
        localStorage.clear();
        console.log('✅ localStorage cleared');

        // 2. Call API to clear Supabase (if available)
        try {
          const response = await fetch('/api/clear-all', { method: 'POST' });
          const result = await response.json();
          console.log('✅ Supabase cleared:', result);
          setStatus('Cleared Supabase database...');
        } catch (e) {
          console.warn('⚠️ Could not call clear API, but localStorage is clear');
        }

        // 3. Hard refresh after a delay
        setStatus('Refreshing page...');
        setTimeout(() => {
          // Force hard refresh by adding timestamp to URL
          window.location.href = '/dashboard?t=' + Date.now() + '&clear=1';
        }, 1500);
      } catch (error) {
        console.error('❌ Error:', error);
        setStatus('Error occurred, but trying to reload...');
        setTimeout(() => {
          window.location.href = '/dashboard?t=' + Date.now();
        }, 2000);
      }
    }

    reset();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        <div className="text-6xl mb-6 animate-spin">🔄</div>
        <h1 className="text-3xl font-bold text-gray-700 mb-4">
          {status}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Removing all quiz submissions...
        </p>
        <p className="text-sm text-gray-500">
          If the page doesn't update automatically,{' '}
          <a href="/dashboard" className="text-green-600 hover:underline font-semibold">
            click here
          </a>
        </p>
      </div>
    </div>
  );
}
