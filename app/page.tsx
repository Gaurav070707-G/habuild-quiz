'use client';

import { useState } from 'react';
import { supabase } from './lib/supabase';

const questionsEnglish = [
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

const questionsHindi = [
  {
    question: 'संस्कृत में "आसन" का अर्थ क्या है?',
    options: ['सांस लेने की तकनीक', 'योग मुद्रा या आसन', 'ध्यान की स्थिति', 'योग दर्शन'],
    correctIndex: 1,
  },
  {
    question: '"वैकल्पिक नासिका श्वसन" किस श्वसन तकनीक को कहा जाता है?',
    options: ['उज्जायी', 'नाड़ी शोधन', 'कपालभाति', 'भस्त्रिका'],
    correctIndex: 1,
  },
  {
    question: 'योग दर्शन में कितने मुख्य चक्र स्वीकृत हैं?',
    options: ['5', '7', '10', '12'],
    correctIndex: 1,
  },
  {
    question: 'नियमित रूप से योग का प्रमुख लाभ क्या है?',
    options: ['केवल शारीरिक शक्ति', 'शरीर, मन और आत्मा का संतुलन', 'केवल लचीलापन', 'केवल तनाव से राहत'],
    correctIndex: 1,
  },
  {
    question: 'किस योग आसन को "अधोमुखी श्वानासन" कहा जाता है?',
    options: ['भुजंगासन', 'अधोमुखी श्वानासन', 'तड़ासन', 'त्रिकोणासन'],
    correctIndex: 1,
  },
  {
    question: 'एक शुरुआती को आमतौर पर योग आसन कितने समय तक रोकना चाहिए?',
    options: ['3-5 सेकंड', '10-30 सेकंड', '2-3 मिनट', '5+ मिनट'],
    correctIndex: 1,
  },
  {
    question: '"प्राणायाम" का अर्थ क्या है?',
    options: ['योग दर्शन', 'ध्यान', 'श्वास नियंत्रण', 'योग गति'],
    correctIndex: 2,
  },
  {
    question: 'कौन सी प्राचीन योग पुस्तक योग दर्शन की नींव मानी जाती है?',
    options: ['भगवद गीता', 'योग सूत्र पतंजलि', 'उपनिषद', 'वेद'],
    correctIndex: 1,
  },
  {
    question: '"शवासन" (शव मुद्रा) का उद्देश्य क्या है?',
    options: ['वार्मिंग अप', 'शक्ति बनाना', 'गहरी छूट और एकीकरण', 'कूल डाउन स्ट्रेच'],
    correctIndex: 2,
  },
  {
    question: 'योग सूत्र में योग के कितने अंग वर्णित हैं?',
    options: ['4', '6', '8', '10'],
    correctIndex: 2,
  },
];

const prizes = [
  { label: 'Water Bottle 🍾', labelHi: 'पानी की बोतल 🍾', emoji: '🍾', color: '#4A90E2' },
  { label: 'Yoga App Access 📱', labelHi: 'योग ऐप एक्सेस 📱', emoji: '📱', color: '#7C3AED' },
  { label: 'Yoga Handbook 📖', labelHi: 'योग हैंडबुक 📖', emoji: '📖', color: '#059669' },
  { label: '1 Month Free Yoga 🧘', labelHi: '1 महीना मुफ़्त योग 🧘', emoji: '🧘', color: '#DC2626' },
];

const wellnessTips = [
  'Take a deep breath daily 🌬️',
  '5 minutes of yoga > no yoga 🧘',
  'Consistency matters more than intensity 📅',
  'Every body is beautiful on the yoga mat 💚',
  'The best yoga practice is the one you do 🙏',
];

const getWhatsAppMessage = (finalScore: number, name: string) => {
  let message = '';
  if (finalScore >= 8) {
    message = `🎉 I scored ${finalScore}/10 on the Habuild Yoga Quiz! I'm a true yogi! 🧘 Can you beat my score? Try it: https://habuild-quiz.vercel.app`;
  } else if (finalScore >= 5) {
    message = `🙏 I scored ${finalScore}/10 on the Habuild Yoga Quiz! Improving my yoga knowledge daily 🧘 Challenge yourself: https://habuild-quiz.vercel.app`;
  } else {
    message = `🧘 Just took the Habuild Yoga Quiz and scored ${finalScore}/10! Testing my yoga knowledge... 🌬️ Take the challenge: https://habuild-quiz.vercel.app`;
  }
  return encodeURIComponent(message);
};

type Screen = 'welcome' | 'leadCapture' | 'quiz' | 'fail' | 'win' | 'spin' | 'prize';
type Language = 'en' | 'hi';

// Shuffle options helper
const shuffleOptions = (options: string[], correctIndex: number) => {
  const answersWithIndex = options.map((text, idx) => ({ text, isCorrect: idx === correctIndex }));
  for (let i = answersWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answersWithIndex[i], answersWithIndex[j]] = [answersWithIndex[j], answersWithIndex[i]];
  }
  return {
    shuffledOptions: answersWithIndex.map(a => a.text),
    newCorrectIndex: answersWithIndex.findIndex(a => a.isCorrect),
  };
};

type ShuffledQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

// Rule: Spin wheel cannot stop on water bottle (index 0) - only 1, 2, 3

const COUNTRY_CODES = [
  { code: '+1', country: 'United States/Canada', countryHi: 'संयुक्त राज्य अमेरिका/कनाडा' },
  { code: '+44', country: 'United Kingdom', countryHi: 'यूनाइटेड किंगडम' },
  { code: '+91', country: 'India', countryHi: 'भारत' },
  { code: '+86', country: 'China', countryHi: 'चीन' },
  { code: '+81', country: 'Japan', countryHi: 'जापान' },
  { code: '+82', country: 'South Korea', countryHi: 'दक्षिण कोरिया' },
  { code: '+33', country: 'France', countryHi: 'फ्रांस' },
  { code: '+49', country: 'Germany', countryHi: 'जर्मनी' },
  { code: '+39', country: 'Italy', countryHi: 'इटली' },
  { code: '+34', country: 'Spain', countryHi: 'स्पेन' },
  { code: '+61', country: 'Australia', countryHi: 'ऑस्ट्रेलिया' },
  { code: '+64', country: 'New Zealand', countryHi: 'न्यूजीलैंड' },
  { code: '+27', country: 'South Africa', countryHi: 'दक्षिण अफ्रीका' },
  { code: '+55', country: 'Brazil', countryHi: 'ब्राज़ील' },
  { code: '+1', country: 'Mexico', countryHi: 'मेक्सिको' },
  { code: '+65', country: 'Singapore', countryHi: 'सिंगापुर' },
  { code: '+60', country: 'Malaysia', countryHi: 'मलेशिया' },
  { code: '+62', country: 'Indonesia', countryHi: 'इंडोनेशिया' },
  { code: '+66', country: 'Thailand', countryHi: 'थाईलैंड' },
  { code: '+84', country: 'Vietnam', countryHi: 'वियतनाम' },
];

const PHONE_LENGTH_BY_COUNTRY: { [key: string]: { min: number; max: number } } = {
  '+1': { min: 10, max: 10 },      // US/Canada/Mexico
  '+44': { min: 10, max: 11 },     // UK
  '+91': { min: 10, max: 10 },     // India
  '+86': { min: 11, max: 11 },     // China
  '+81': { min: 10, max: 10 },     // Japan
  '+82': { min: 10, max: 11 },     // South Korea
  '+33': { min: 9, max: 9 },       // France
  '+49': { min: 10, max: 11 },     // Germany
  '+39': { min: 10, max: 10 },     // Italy
  '+34': { min: 9, max: 9 },       // Spain
  '+61': { min: 9, max: 9 },       // Australia
  '+64': { min: 9, max: 10 },      // New Zealand
  '+27': { min: 9, max: 9 },       // South Africa
  '+55': { min: 11, max: 11 },     // Brazil
  '+65': { min: 8, max: 8 },       // Singapore
  '+60': { min: 9, max: 10 },      // Malaysia
  '+62': { min: 10, max: 12 },     // Indonesia
  '+66': { min: 9, max: 10 },      // Thailand
  '+84': { min: 9, max: 10 },      // Vietnam
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<Language>('en');
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
  const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);
  const [phoneError, setPhoneError] = useState('');

  const getQuestions = () => language === 'hi' ? questionsHindi : questionsEnglish;

  const t = (en: string, hi: string) => language === 'hi' ? hi : en;

  const handleAnswer = (selectedIndex: number) => {
    // Prevent double-submission during feedback
    if (showFeedback) return;

    setSelectedAnswerIndex(selectedIndex);
    setShowFeedback(true);

    if (selectedIndex === shuffledQuestions[currentQuestion].correctIndex) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswerIndex(null);
        setShowFeedback(false);
      } else {
        const finalScore = selectedIndex === shuffledQuestions[currentQuestion].correctIndex ? score + 1 : score;
        if (finalScore >= 8) {
          setScore(finalScore);
          setScreen('win');
        } else {
          saveWinner(finalScore, 'pending');
          setScreen('fail');
        }
      }
    }, 2000);
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
      country_code: countryCode,
      score: finalScore,
      prize: prize || 'pending',
      timestamp: new Date().toISOString(),
    };

    console.log('🔥 saveWinner called with requestId:', requestId);
    console.log('📝 Data:', { name, phone, score: finalScore, prize });

    // Save to Supabase
    try {
      console.log('📤 Saving to Supabase...');
      // First try with countryCode
      let { data, error } = await supabase.from('winners').insert([winner]);

      // If country_code column doesn't exist, save without it
      if (error?.code === 'PGRST204' || error?.message?.includes('country_code')) {
        console.warn('⚠️  country_code column not found, saving without it...');
        const { name, city, phone, score, prize, timestamp } = winner;
        ({ data, error } = await supabase.from('winners').insert([
          { name, city, phone, score, prize, timestamp }
        ]));
      }

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

  const validatePhone = (phoneNumber: string, code: string): boolean => {
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    const lengths = PHONE_LENGTH_BY_COUNTRY[code];
    if (!lengths) return phoneDigits.length >= 8; // fallback
    return phoneDigits.length >= lengths.min && phoneDigits.length <= lengths.max;
  };

  const getPhoneErrorMessage = (code: string): string => {
    const lengths = PHONE_LENGTH_BY_COUNTRY[code];
    if (!lengths) return 'Please enter a valid phone number';
    if (lengths.min === lengths.max) {
      return `Please enter ${lengths.min} digits for this country`;
    }
    return `Please enter ${lengths.min}-${lengths.max} digits for this country`;
  };

  const startQuiz = () => {
    if (!validatePhone(phone, countryCode)) {
      setPhoneError(getPhoneErrorMessage(countryCode));
      return;
    }

    if (name.trim() && phone.trim() && countryCode && city.trim()) {
      // Shuffle options for each question
      const questions = getQuestions();
      const shuffled = questions.map(q => {
        const { shuffledOptions, newCorrectIndex } = shuffleOptions(q.options, q.correctIndex);
        return {
          question: q.question,
          options: shuffledOptions,
          correctIndex: newCorrectIndex,
        };
      });
      setShuffledQuestions(shuffled);
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

            {/* Language Selection */}
            <div className="flex gap-4 justify-center mb-8">
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Prize Preview */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {prizes.map((prize, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl text-white font-semibold text-center"
                  style={{ backgroundColor: prize.color }}
                >
                  <div className="text-3xl mb-2">{prize.emoji}</div>
                  <div className="text-sm">{language === 'hi' ? prize.labelHi : prize.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setScreen('leadCapture')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
            >
              {t('Start Quiz 🚀', 'क्विज़ शुरू करें 🚀')}
            </button>
          </div>
        )}

        {/* Lead Capture Screen */}
        {screen === 'leadCapture' && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
              {t('Before We Begin...', 'शुरु करने से पहले...')}
            </h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Your Name', 'आपका नाम')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                  placeholder={t('Enter your name', 'अपना नाम दर्ज करें')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('City', 'शहर')}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                  placeholder={t('Enter your city', 'अपना शहर दर्ज करें')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Country Code', 'देश कोड')}
                </label>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-gray-800 bg-white"
                >
                  <option value="">{t('Select your country code...', 'अपना देश कोड चुनें...')}</option>
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code + item.country} value={item.code}>
                      {item.code} {language === 'hi' ? item.countryHi : item.country}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('Phone Number', 'फोन नंबर')}
                  {countryCode && PHONE_LENGTH_BY_COUNTRY[countryCode] && (
                    <span className="text-gray-600 font-normal">
                      {' '}({PHONE_LENGTH_BY_COUNTRY[countryCode].min}-{PHONE_LENGTH_BY_COUNTRY[countryCode].max} {t('digits', 'अंक')})
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-800 font-semibold whitespace-nowrap">
                    {countryCode || '📱'}
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      const numericOnly = e.target.value.replace(/[^\d]/g, '');
                      setPhone(numericOnly);
                      setPhoneError('');
                    }}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none text-gray-800 bg-white ${
                      phoneError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-600'
                    }`}
                    placeholder={t('Your phone number', 'आपका फोन नंबर')}
                  />
                </div>
                {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
                {phone && !phoneError && countryCode && (
                  <p className="text-sm text-gray-600 mt-2">
                    Digits entered: {phone.replace(/\D/g, '').length}
                    {PHONE_LENGTH_BY_COUNTRY[countryCode] && (
                      <span> / {PHONE_LENGTH_BY_COUNTRY[countryCode].min}-{PHONE_LENGTH_BY_COUNTRY[countryCode].max}</span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={startQuiz}
              disabled={!name.trim() || !phone.trim() || !countryCode || !city.trim()}
              className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('Let\'s Go! 🎯', 'चलिए शुरू करें! 🎯')}
            </button>
            <button
              onClick={() => setScreen('welcome')}
              className="w-full mt-3 px-4 py-2 text-gray-600 font-semibold hover:text-green-600"
            >
              {t('Back', 'पीछे')}
            </button>
          </div>
        )}

        {/* Quiz Screen */}
        {screen === 'quiz' && shuffledQuestions.length > 0 && (
          <div>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>Question {currentQuestion + 1}</span>
                <span>of {shuffledQuestions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-600">
                Score: {score}/{shuffledQuestions.length}
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
              {shuffledQuestions[currentQuestion].question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {shuffledQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg text-left font-semibold transition-all ${
                    selectedAnswerIndex === null
                      ? 'bg-white border-2 border-gray-300 text-gray-800'
                      : index === shuffledQuestions[currentQuestion].correctIndex
                      ? 'bg-green-500 border-2 border-green-500 text-white'
                      : index === selectedAnswerIndex
                      ? 'bg-red-500 border-2 border-red-500 text-white'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-lg">
                      {index === shuffledQuestions[currentQuestion].correctIndex && showFeedback ? '✓' : ''}
                      {index === selectedAnswerIndex && showFeedback && index !== shuffledQuestions[currentQuestion].correctIndex ? '✗' : ''}
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
              {t('Oops! Better Luck Next Time', 'ओह! अगली बार बेहतर किस्मत हो')}
            </h2>
            <p className="text-2xl font-semibold text-purple-600 mb-6">
              You scored {score > 0 ? score : 0}/{getQuestions().length}
            </p>
            <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-800 mb-2">{t('💡 Wellness Tip:', '💡 wellness टिप:')}</p>
              <p className="text-xl font-semibold text-gray-900">
                {language === 'hi'
                  ? ['रोज़ाना गहरी सांस लें 🌬️', '5 मिनट योग > कोई योग नहीं 🧘', 'सतर्कता तीव्रता से अधिक महत्वपूर्ण है 📅', 'योग चटाई पर हर शरीर सुंदर है 💚', 'सबसे अच्छा योग अभ्यास वह है जो आप करते हैं 🙏'][Math.floor(Math.random() * 5)]
                  : wellnessTips[Math.floor(Math.random() * wellnessTips.length)]
                }
              </p>
            </div>
            <div className="space-y-3">
              <a
                href={`https://wa.me/?text=${getWhatsAppMessage(score, name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                {t('Share on WhatsApp 💬', 'WhatsApp पर साझा करें 💬')}
              </a>
              <button
                onClick={resetQuiz}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                {t('Try Again 🔄', 'फिर कोशिश करें 🔄')}
              </button>
              <a
                href="https://habit.yoga/joinGaurav"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                {t('Join Habuild FREE anyway 🧘', 'फिर भी Habuild में FREE शामिल हों 🧘')}
              </a>
            </div>
          </div>
        )}

        {/* Win/Spin Screen - Combined */}
        {screen === 'win' && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-green-700 mb-2">
              {t('Congratulations! You\'re a True Yogi!', 'बधाई हो! आप एक सच्चे योगी हैं!')}
            </h2>
            <p className="text-xl text-purple-600 font-semibold mb-8">
              You scored {score}/{getQuestions().length} — Amazing! 🙌
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
              {isSpinning
                ? t('Spinning... 🎡', 'घूम रहा है... 🎡')
                : wonPrizeIndex !== null
                ? t('Already Spun! 🎁', 'पहले से घूम चुका है! 🎁')
                : t('Spin to Win! 🎁', 'जीतने के लिए घुमाएं! 🎁')}
            </button>

            {/* Result appears after spin */}
            {!isSpinning && wonPrizeIndex !== null && (
              <div className="mt-8 space-y-4">
                <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl animate-bounce">
                  <p className="text-2xl font-bold text-purple-600 mb-2">🏆 {t('You Won!', 'आप जीत गए!')}</p>
                  <p className="text-xl font-bold text-gray-800">{language === 'hi' ? prizes[wonPrizeIndex].labelHi : prizes[wonPrizeIndex].label}</p>
                </div>
                <button
                  onClick={() => setScreen('prize')}
                  className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
                >
                  {t('Claim Your Prize! 🎁', 'अपना पुरस्कार प्राप्त करें! 🎁')}
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
              {t('You Won!', 'आप जीत गए!')}
            </h2>
            <p className="text-2xl font-bold text-purple-600 mb-8">
              {language === 'hi' ? prizes[wonPrizeIndex].labelHi : prizes[wonPrizeIndex].label}
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8">
              <p className="text-gray-800 font-semibold mb-2">
                {t('🎁 Claim your prize by joining Habuild', '🎁 Habuild में शामिल होकर अपना पुरस्कार प्राप्त करें')}
              </p>
              <p className="text-gray-700">
                {t('Join our yoga community and unlock your exclusive reward!', 'हमारे योग समुदाय में शामिल हों और अपना एक्सक्लूसिव पुरस्कार अनलॉक करें!')}
              </p>
            </div>

            <a
              href="https://habit.yoga/joinGaurav"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-8 py-4 bg-gradient-to-r from-green-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all mb-3"
            >
              {t('Join Habuild Free Yoga 🧘', 'Habuild में फ्री योग में शामिल हों 🧘')}
            </a>

            <a
              href={`https://wa.me/?text=${getWhatsAppMessage(score, name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all mb-3"
            >
              {t('Share on WhatsApp 💬', 'WhatsApp पर साझा करें 💬')}
            </a>

            <button
              onClick={() => {
                const prizeLabel = language === 'hi' ? prizes[wonPrizeIndex].labelHi : prizes[wonPrizeIndex].label;
                navigator.clipboard.writeText(
                  language === 'hi'
                    ? `मैंने Habuild योग क्विज़ पर ${score}/10 स्कोर किया और ${prizeLabel}! 🎉 क्या आप मेरे स्कोर को हरा सकते हैं? मेरे साथ शामिल हों: https://habit.yoga/joinGaurav`
                    : `I just scored ${score}/10 on the Habuild Yoga Quiz and won ${prizeLabel}! 🎉 Can you beat my score? Join me: https://habit.yoga/joinGaurav`
                );
                alert(t('Share text copied! 📋', 'शेयर टेक्स्ट कॉपी किया गया! 📋'));
              }}
              className="w-full px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-all"
            >
              {t('Share & Challenge a Friend 👥', 'साझा करें और किसी मित्र को चुनौती दें 👥')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
