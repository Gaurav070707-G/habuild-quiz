'use client';

import { useState } from 'react';
import { supabase } from './lib/supabase';

const questions = [
  {
    question: 'What does "Asana" mean in Sanskrit?',
    options: ['Breathing technique', 'Yoga pose or posture', 'Meditation state', 'Yoga philosophy'],
    correctIndex: 1,
  },
  {
    question: 'Which breathing technique is known as "alternate nostril breathing"?',
    options: ['Ujjayi', 'Nadi Shodhana', 'Kapalabhati', 'Bhastrika'],
    correctIndex: 1,
  },
  {
    question: 'How many main chakras are recognized in yoga philosophy?',
    options: ['5', '7', '10', '12'],
    correctIndex: 1,
  },
  {
    question: 'What is the primary benefit of practicing yoga regularly?',
    options: ['Only physical strength', 'Balance of body, mind, and spirit', 'Just flexibility', 'Only stress relief'],
    correctIndex: 1,
  },
  {
    question: 'Which yoga pose is known as "Downward-Facing Dog"?',
    options: ['Bhujangasana', 'Adho Mukha Svanasana', 'Tadasana', 'Trikonasana'],
    correctIndex: 1,
  },
  {
    question: 'How long should a beginner typically hold a yoga pose?',
    options: ['3-5 seconds', '10-30 seconds', '2-3 minutes', '5+ minutes'],
    correctIndex: 1,
  },
  {
    question: 'What does "Pranayama" mean?',
    options: ['Yoga philosophy', 'Meditation', 'Breath control', 'Yoga movement'],
    correctIndex: 2,
  },
  {
    question: 'Which ancient yoga text is considered the foundation of yoga philosophy?',
    options: ['Bhagavad Gita', 'Yoga Sutras of Patanjali', 'Upanishads', 'Vedas'],
    correctIndex: 1,
  },
  {
    question: 'What is the purpose of "Savasana" (Corpse Pose)?',
    options: ['Warm-up', 'Build strength', 'Deep relaxation and integration', 'Cool-down stretch'],
    correctIndex: 2,
  },
  {
    question: 'How many limbs of yoga are described in the Yoga Sutras?',
    options: ['4', '6', '8', '10'],
    correctIndex: 2,
  },
];

const prizes = [
  { label: 'Water Bottle 🍾', emoji: '🍾', color: '#4A90E2' },
  { label: 'Yoga App Access 📱', emoji: '📱', color: '#7C3AED' },
  { label: 'Yoga Handbook 📖', emoji: '📖', color: '#059669' },
  { label: '1 Month Free Yoga 🧘', emoji: '🧘', color: '#DC2626' },
];

const wellnessTips = [
  'Take a deep breath daily 🌬️',
  '5 minutes of yoga > no yoga 🧘',
  'Consistency matters more than intensity 📅',
  'Every body is beautiful on the yoga mat 💚',
  'The best yoga practice is the one you do 🙏',
];

type Screen = 'welcome' | 'leadCapture' | 'quiz' | 'fail' | 'win' | 'spin' | 'prize';

// Rule: Spin wheel cannot stop on water bottle (index 0) - only 1, 2, 3

const COUNTRY_CODES = [
  { code: '+1', country: 'United States/Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+27', country: 'South Africa' },
  { code: '+55', country: 'Brazil' },
  { code: '+1', country: 'Mexico' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+62', country: 'Indonesia' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [wonPrizeIndex, setWonPrizeIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [savedRequestIds, setSavedRequestIds] = useState<Set<string>>(new Set());

  const handleAnswer = (selectedIndex: number) => {
    // Prevent double-submission during feedback
    if (showFeedback) return;

    setSelectedAnswerIndex(selectedIndex);
    setShowFeedback(true);

    if (selectedIndex === questions[currentQuestion].correctIndex) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswerIndex(null);
        setShowFeedback(false);
      } else {
        const finalScore = selectedIndex === questions[currentQuestion].correctIndex ? score + 1 : score;
        if (finalScore >= 8) {
          setScore(finalScore);
          setScreen('win');
        } else {
          saveWinner(finalScore, 'pending');
          setScreen('fail');
        }
      }
    }, 500);
  };

  const saveWinner = async (finalScore: number, prize: string | null) => {
    // Generate unique request ID
    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Check if this exact save was already attempted
    if (savedRequestIds.has(requestId)) {
      console.warn('⚠️ Duplicate save detected - request already processed:', requestId);
      return;
    }

    // Add to saved list to prevent duplicates
    setSavedRequestIds((prev) => new Set(prev).add(requestId));

    const winner = {
      name,
      city,
      phone,
      countryCode,
      score: finalScore,
      prize: prize || 'pending',
      timestamp: new Date().toISOString(),
    };

    console.log('🔥 saveWinner called with requestId:', requestId);
    console.log('📝 Data:', { name, phone, score: finalScore, prize });

    // Save to Supabase
    try {
      console.log('📤 Saving to Supabase...');
      const { data, error } = await supabase.from('winners').insert([winner]);

      if (error) {
        console.error('❌ Supabase error:', error.message, error.code);
      } else {
        console.log('✅ Supabase save successful');
      }
    } catch (error) {
      console.error('❌ Supabase exception:', error instanceof Error ? error.message : error);
    }

    // Also save to localStorage as backup
    try {
      const winners = JSON.parse(localStorage.getItem('habitBuiltWinners') || '[]');
      winners.push(winner);
      localStorage.setItem('habitBuiltWinners', JSON.stringify(winners));
      console.log('✅ localStorage backup successful, total entries:', winners.length);
    } catch (error) {
      console.error('❌ localStorage error:', error);
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const randomPrizeIndex = 1 + Math.floor(Math.random() * 3);
    setWonPrizeIndex(randomPrizeIndex);

    // Calculate rotation to land prize at pointer (top at 270°)
    // Prizes are positioned at: 45°, 135°, 225°, 315°
    // Pointer is fixed at top (270°)
    // To land each prize at pointer: rotate by (270° - prizeAngle)
    const prizeAngle = randomPrizeIndex * 90 + 45;
    const targetRotation = 270 - prizeAngle;

    // Add 5+ full rotations for spin effect (only full rotations, no partial offset)
    const fullRotations = 360 * (5 + Math.floor(Math.random() * 3));
    const finalRotation = fullRotations + targetRotation;

    setWheelRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      saveWinner(score, prizes[randomPrizeIndex].label);
    }, 4000);
  };

  const resetQuiz = () => {
    setScreen('welcome');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswerIndex(null);
    setShowFeedback(false);
    setName('');
    setCity('');
    setPhone('');
    setCountryCode('');
    setWonPrizeIndex(null);
    setWheelRotation(0);
  };

  const startQuiz = () => {
    if (name.trim() && phone.trim() && countryCode) {
      setScreen('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        {/* Welcome Screen */}
        {screen === 'welcome' && (
          <div className="text-center">
            <div className="text-7xl mb-6 animate-bounce">🧘</div>
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              🧘 Are You a True Yogi? 🎯
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Take our 10-question challenge and win exciting prizes!
            </p>

            {/* Prize Preview */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl text-white font-semibold text-center"
                  style={{ backgroundColor: prize.color }}
                >
                  <div className="text-3xl mb-2">{prize.emoji}</div>
                  <div className="text-sm">{prize.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen('leadCapture')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
            >
              Start Quiz 🚀
            </button>
          </div>
        )}

        {/* Lead Capture Screen */}
        {screen === 'leadCapture' && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Before We Begin...</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                  placeholder="Enter your city"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country Code
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                >
                  <option value="">Select your country code...</option>
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code + item.country} value={item.code}>
                      {item.code} {item.country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-semibold whitespace-nowrap">
                    {countryCode || '📱'}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={startQuiz}
              disabled={!name.trim() || !phone.trim() || !countryCode || !city.trim()}
              className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Let's Go! 🎯
            </button>
            <button
              onClick={() => setScreen('welcome')}
              className="w-full mt-3 px-4 py-2 text-gray-600 font-semibold hover:text-green-600"
            >
              Back
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {screen === 'quiz' && (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>Question {currentQuestion + 1}</span>
                <span>of {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-600">
                Score: {score}/{questions.length}
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {questions[currentQuestion].question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                    selectedAnswerIndex === null
                      ? 'bg-white border-2 border-gray-300 text-gray-800 hover:border-green-600 hover:bg-green-50'
                      : index === questions[currentQuestion].correctIndex
                      ? 'bg-green-500 border-2 border-green-500 text-white'
                      : index === selectedAnswerIndex
                      ? 'bg-red-500 border-2 border-red-500 text-white'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">
                      {index === questions[currentQuestion].correctIndex && showFeedback ? '✓' : ''}
                      {index === selectedAnswerIndex && showFeedback && index !== questions[currentQuestion].correctIndex ? '✗' : ''}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fail Screen */}
        {screen === 'fail' && (
          <div className="text-center">
            <div className="text-6xl mb-6">😅</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Oops! Better Luck Next Time
            </h2>
            <p className="text-2xl font-semibold text-purple-600 mb-6">
              You scored {score > 0 ? score : 0}/{questions.length}
            </p>
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-800 mb-2">💡 Wellness Tip:</p>
              <p className="text-xl font-semibold text-gray-900">
                {wellnessTips[Math.floor(Math.random() * wellnessTips.length)]}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={resetQuiz}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Try Again 🔄
              </button>
              <a
                href="https://habit.yoga/joinGaurav"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Join Habuild FREE anyway 🧘
              </a>
            </div>
          </div>
        )}

        {/* Win/Spin Screen - Combined */}
        {screen === 'win' && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              Congratulations! You're a True Yogi!
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-8">
              You scored {score}/{questions.length} — Amazing! 🙌
            </p>

            {/* Prize Wheel */}
            <div className="mb-8 flex justify-center pt-8">
              <div className="relative">
                {/* Static Pointer/Arrow at top - points down to wheel */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 z-20">
                  <div className="text-5xl drop-shadow-lg">👇</div>
                </div>

                {/* Wheel */}
                <div
                  className={`w-72 h-72 rounded-full flex items-center justify-center text-5xl ${
                    isSpinning ? '' : 'hover:shadow-2xl'
                  } transition-all`}
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionDuration: isSpinning ? '4s' : '0s',
                    transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
                    background:
                      'conic-gradient(from 0deg, #4A90E2 0deg 90deg, #7C3AED 90deg 180deg, #059669 180deg 270deg, #DC2626 270deg 360deg)',
                    boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {prizes.map((prize, idx) => {
                      const angle = (idx * 90 + 45) * (Math.PI / 180);
                      const radius = 70;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      return (
                        <div
                          key={idx}
                          style={{
                            position: 'absolute',
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className="text-5xl drop-shadow-lg"
                        >
                          {prize.emoji}
                        </div>
                      );
                    })}
                    {/* Center pointer */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl drop-shadow-lg">🎯</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={handleSpinWheel}
              disabled={isSpinning || wonPrizeIndex !== null}
              className={`px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-lg transition-all ${
                isSpinning || wonPrizeIndex !== null
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:shadow-lg hover:scale-105'
              }`}
            >
              {isSpinning ? 'Spinning... 🎡' : wonPrizeIndex !== null ? 'Already Spun! 🎁' : 'Spin to Win! 🎁'}
            </button>

            {/* Result appears after spin */}
            {!isSpinning && wonPrizeIndex !== null && (
              <div className="mt-8 space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl animate-bounce">
                  <p className="text-2xl font-bold text-purple-600 mb-2">🏆 You Won!</p>
                  <p className="text-xl font-bold text-gray-800">{prizes[wonPrizeIndex].label}</p>
                </div>
                <button
                  onClick={() => setScreen('prize')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
                >
                  Claim Your Prize! 🎁
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prize Screen */}
        {screen === 'prize' && wonPrizeIndex !== null && (
          <div className="text-center">
            <div className="text-6xl mb-6">{prizes[wonPrizeIndex].emoji}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              You Won!
            </h2>
            <p className="text-2xl font-bold text-purple-600 mb-8">
              {prizes[wonPrizeIndex].label}
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
              <p className="text-gray-800 font-semibold mb-2">
                🎁 Claim your prize by joining Habuild
              </p>
              <p className="text-gray-700">
                Join our yoga community and unlock your exclusive reward!
              </p>
            </div>

            <a
              href="https://habit.yoga/joinGaurav"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all mb-3"
            >
              Join Habuild Free Yoga 🧘
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `I just scored ${score}/10 on the Habuild Yoga Quiz and won ${prizes[wonPrizeIndex].label}! 🎉 Can you beat my score? Join me: https://habit.yoga/joinGaurav`
                );
                alert('Share text copied! 📋');
              }}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              Share & Challenge a Friend 👥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
