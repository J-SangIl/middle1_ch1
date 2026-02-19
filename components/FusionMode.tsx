
import React, { useState } from 'react';
import { PRIME_COLORS, PRIMES_UP_TO_50 } from '../types';

interface FusionModeProps {
  onExit: () => void;
  onHome: () => void;
}

const FusionMode: React.FC<FusionModeProps> = ({ onExit, onHome }) => {
  const [selectedPrimes, setSelectedPrimes] = useState<number[]>([]);
  const [result, setResult] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const addPrime = (p: number) => {
    if (result !== null) {
      setResult(null);
      setSelectedPrimes([p]);
    } else {
      setSelectedPrimes(prev => [...prev, p]);
    }
  };

  const handleFuse = () => {
    if (selectedPrimes.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      const product = selectedPrimes.reduce((acc, val) => acc * val, 1);
      setResult(product);
      setIsAnimating(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedPrimes([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <button onClick={onHome} className="text-blue-600 font-bold hover:bg-white px-3 py-1 rounded-lg transition-colors">🏠 메인</button>
          <button onClick={onExit} className="text-blue-600 font-bold hover:bg-white px-3 py-1 rounded-lg transition-colors">← 모드 선택</button>
        </div>
        <h2 className="text-2xl font-bold text-blue-900 underline decoration-blue-300 decoration-4">소수 융합기</h2>
        <button onClick={handleReset} className="text-gray-400 font-bold hover:text-red-500">초기화</button>
      </div>

      <div className="relative w-full max-w-3xl min-h-[400px] bg-white rounded-3xl shadow-inner p-8 flex flex-col items-center justify-center border-4 border-dashed border-blue-100 mb-8 overflow-hidden">
        {!result && selectedPrimes.length === 0 && (
          <div className="text-gray-300 text-center animate-pulse">
            <p className="text-lg font-medium italic">아래에서 소수 카드를 클릭하여 융합기에 넣으세요!</p>
          </div>
        )}

        {!result && (
          <div className="flex flex-wrap justify-center gap-4 transition-all duration-500">
            {selectedPrimes.map((p, idx) => (
              <div
                key={`${p}-${idx}`}
                className={`
                  w-16 h-20 rounded-xl border-2 flex items-center justify-center shadow-md animate-bounce
                  ${PRIME_COLORS[p] || 'bg-gray-100 border-gray-300'}
                  ${isAnimating ? 'translate-y-[-100px] scale-0 rotate-180 opacity-0' : 'scale-100'}
                `}
                style={{ transition: 'all 0.5s ease-in', transitionDelay: `${idx * 50}ms` }}
              >
                <span className="text-3xl font-black">{p}</span>
              </div>
            ))}
          </div>
        )}

        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 bg-blue-400/20 rounded-full animate-ping"></div>
            <div className="w-24 h-24 bg-blue-600 rounded-full animate-pulse absolute shadow-[0_0_50px_rgba(37,99,235,0.6)]"></div>
          </div>
        )}

        {result !== null && (
          <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
            <span className="text-gray-400 font-bold mb-2 uppercase tracking-widest text-sm">융합된 자연수</span>
            <h3 className="text-8xl font-black text-blue-600 mb-6 drop-shadow-lg">{result.toLocaleString()}</h3>
            <div className="flex flex-wrap justify-center gap-3 items-center text-blue-400 text-xl font-medium bg-blue-50 px-8 py-3 rounded-full border border-blue-100">
              {selectedPrimes.join(' × ')} = {result}
            </div>
            <button
              onClick={handleReset}
              className="mt-10 px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              새로운 실험하기
            </button>
          </div>
        )}
      </div>

      {!result && (
        <div className="w-full max-w-4xl bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-white overflow-auto max-h-[40vh]">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {PRIMES_UP_TO_50.map(p => (
              <button
                key={p}
                onClick={() => addPrime(p)}
                className={`
                  w-14 h-14 rounded-2xl border-2 font-black text-xl shadow-sm hover:scale-110 active:scale-90 transition-all
                  ${PRIME_COLORS[p] || 'bg-gray-50 border-gray-200'}
                `}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button
            disabled={selectedPrimes.length < 2 || isAnimating}
            onClick={handleFuse}
            className={`
              w-full py-6 rounded-3xl font-black text-2xl shadow-xl transition-all
              ${selectedPrimes.length < 2 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98]'}
            `}
          >
            {selectedPrimes.length < 2 ? '소수를 2개 이상 선택하세요' : '융 합 하 기 🧪'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FusionMode;
