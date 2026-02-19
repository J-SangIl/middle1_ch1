
import React, { useState } from 'react';
import { PrimeLabMode } from '../types';
import FusionMode from './FusionMode';
import DecompositionMode from './DecompositionMode';

interface PrimeLabProps {
  onBack: () => void;
}

const PrimeLab: React.FC<PrimeLabProps> = ({ onBack }) => {
  const [labMode, setLabMode] = useState<PrimeLabMode | null>(null);

  if (!labMode) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">실험실에 오신 것을 환영합니다!</h1>
            <p className="text-blue-600 text-lg font-medium">융합과 분해 중 어떤 실험을 하시겠습니까?</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button
              onClick={() => setLabMode(PrimeLabMode.FUSION)}
              className="group p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-8 border-blue-500 active:border-b-2 active:translate-y-1"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔮</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">융합</h2>
              <p className="text-gray-500 italic">"소수들을 모아 큰 수를 만들어요"</p>
            </button>

            <button
              onClick={() => setLabMode(PrimeLabMode.DECOMPOSITION)}
              className="group p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-8 border-green-500 active:border-b-2 active:translate-y-1"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">✂️</div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">분해</h2>
              <p className="text-gray-500 italic">"큰 수를 소인수분해해 보아요"</p>
            </button>
          </div>

          <button
            onClick={onBack}
            className="mt-12 w-full text-blue-600 font-bold hover:underline py-4 bg-white/50 rounded-2xl"
          >
            ← 메인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {labMode === PrimeLabMode.FUSION ? (
        <FusionMode onExit={() => setLabMode(null)} onHome={onBack} />
      ) : (
        <DecompositionMode onExit={() => setLabMode(null)} onHome={onBack} />
      )}
    </div>
  );
};

export default PrimeLab;
