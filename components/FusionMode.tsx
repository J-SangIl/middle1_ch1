
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
          <button onClick={onHome} className="text-blue-600 font-bold hover:bg-white px-3 py-1 rounded-lg transition-colors">🏠 홈</button>
        </div>
        <h2 className="text-2xl font-bold text-blue-900">1-1 소수 융합 실험실</h2>
        <button onClick={handleReset} className="text-gray-400 font-bold hover:text-red-500">초기화</button>
      </div>

      <div className="relative w-full max-w-3xl min-h-[400px] bg-white rounded-3xl shadow-inner p-8 flex flex-col items-center justify-center border-4 border-dashed border-blue-100 mb-8 overflow-hidden">
        {!result && selectedPrimes.length === 0 && (
          <div className="text-gray-300 text-center">
            <p className="text-lg font-medium italic">아래 소수 카드를 클릭하여 실험관에 넣으세요!</p>
          </div>
        )}

        {!result && (
          <div className="flex flex-wrap justify-center gap-4 transition-all duration-500">
            {selectedPrimes.map((p, idx) => (
              <div
                key={`${p}-${idx}`}
                className={`
                  w-16 h-24 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg animate-bounce
                  ${PRIME_COLORS[p] || 'bg-gray-100 border-gray-300'}
                  ${isAnimating ? 'translate-y-[-200px] scale-0 rotate-180 opacity-0' : 'scale-100'}
                `}
                style={{ transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)', transitionDelay: `${idx * 40}ms` }}
              >
                <div className="text-xs font-bold opacity-50 mb-2">PRIME</div>
                <span className="text-3xl font-black">{p}</span>
              </div>
            ))}
          </div>
        )}

        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-blue-400/30 rounded-full animate-ping"></div>
            <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full animate-pulse absolute shadow-[0_0_80px_rgba(37,99,235,0.8)]"></div>
          </div>
        )}

        {result !== null && (
          <div className="flex flex-col items-center text-center animate-in zoom-in duration-500">
            <span className="text-blue-400 font-black mb-2 uppercase tracking-widest text-sm">Fusion Result</span>
            <h3 className="text-8xl font-black text-blue-900 mb-6 drop-shadow-2xl">{result.toLocaleString()}</h3>
            <div className="flex flex-wrap justify-center gap-3 items-center text-blue-600 text-xl font-bold bg-blue-50 px-10 py-4 rounded-3xl border border-blue-100 shadow-sm">
              {selectedPrimes.sort((a,b)=>a-b).join(' × ')} = {result}
            </div>
            <button
              onClick={handleReset}
              className="mt-12 px-12 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
            >
              다시 실험하기
            </button>
          </div>
        )}
      </div>

      {!result && (
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white">
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {PRIMES_UP_TO_50.slice(0, 8).map(p => (
              <button
                key={p}
                onClick={() => addPrime(p)}
                className={`
                  w-16 h-16 rounded-2xl border-2 font-black text-2xl shadow-md hover:scale-110 active:scale-95 transition-all
                  ${PRIME_COLORS[p] || 'bg-gray-50 border-gray-200'}
                `}
              >
                {p}
              </button>
            ))}
          </div>
          
          <button
            disabled={selectedPrimes.length < 1 || isAnimating}
            onClick={handleFuse}
            className={`
              w-full py-6 rounded-[28px] font-black text-2xl shadow-2xl transition-all
              ${selectedPrimes.length < 1 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {selectedPrimes.length < 1 ? '소수 카드를 선택하세요' : '융 합 하 기 🚀'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FusionMode;
