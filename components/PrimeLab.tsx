
import React, { useState } from 'react';
import FusionMode from './FusionMode';
import DecompositionMode from './DecompositionMode';

interface PrimeLabProps {
  onBack: () => void;
}

const PrimeLab: React.FC<PrimeLabProps> = ({ onBack }) => {
  // Use a sub-state to switch between Fusion and Decomposition modes within the lab
  const [labMode, setLabMode] = useState<'SELECT' | 'FUSION' | 'DECOMPOSITION'>('SELECT');

  if (labMode === 'FUSION') {
    return <FusionMode onExit={() => setLabMode('SELECT')} onHome={onBack} />;
  }
  
  if (labMode === 'DECOMPOSITION') {
    return <DecompositionMode onExit={() => setLabMode('SELECT')} onHome={onBack} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl flex justify-between items-center mb-12">
        <button 
          onClick={onBack} 
          className="text-blue-600 font-bold bg-white px-5 py-2 rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
        >
          🏠 메인으로 돌아가기
        </button>
        <h2 className="text-3xl font-black text-blue-900">Prime Laboratory</h2>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Fusion Experiment Selection Card */}
        <button
          onClick={() => setLabMode('FUSION')}
          className="group p-10 bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-blue-400 text-left"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <span className="text-4xl">🚀</span>
          </div>
          <h3 className="text-2xl font-black text-blue-900 mb-2">소수 융합 실험</h3>
          <p className="text-gray-500 mb-6">여러 개의 소수를 선택하여 하나의 합성수로 만들어보는 실험입니다.</p>
          <span className="inline-flex items-center text-blue-600 font-bold">실험 시작하기 →</span>
        </button>

        {/* Decomposition Experiment Selection Card */}
        <button
          onClick={() => setLabMode('DECOMPOSITION')}
          className="group p-10 bg-white rounded-[40px] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-indigo-400 text-left"
        >
          <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <span className="text-4xl">🧪</span>
          </div>
          <h3 className="text-2xl font-black text-indigo-900 mb-2">소인수분해 실험</h3>
          <p className="text-gray-500 mb-6">합성수를 더 이상 쪼개지지 않는 소수들의 곱으로 분해하는 실험입니다.</p>
          <span className="inline-flex items-center text-indigo-600 font-bold">실험 시작하기 →</span>
        </button>
      </div>

      <footer className="mt-16 text-blue-300 text-sm font-medium">
        수학적 원리를 실험으로 체험해보세요!
      </footer>
    </div>
  );
};

export default PrimeLab;
