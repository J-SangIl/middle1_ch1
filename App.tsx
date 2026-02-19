
import React, { useState } from 'react';
import { GameMode } from './types';
import HiddenRectangle from './components/HiddenRectangle';
import PrimeLab from './components/PrimeLab';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.HOME);

  const renderContent = () => {
    switch (mode) {
      case GameMode.HIDDEN_RECTANGLE:
        return <HiddenRectangle onBack={() => setMode(GameMode.HOME)} />;
      case GameMode.PRIME_LAB:
        return <PrimeLab onBack={() => setMode(GameMode.HOME)} />;
      default:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-blue-100">
            <header className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
                중학 수학 1학년 <span className="text-blue-600">소인수분해</span>
              </h1>
              <p className="text-lg text-gray-600">재미있는 게임과 실험으로 소수와 합성수를 배워보아요!</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <button
                onClick={() => setMode(GameMode.HIDDEN_RECTANGLE)}
                className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-indigo-400 text-left"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧩</span>
                </div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">1-0 Hidden Rectangle</h2>
                <p className="text-gray-500 mb-4">약수와 배수의 관계를 이용해 숨겨진 직사각형 구역을 찾아보세요.</p>
                <span className="inline-flex items-center text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                  시작하기 <span className="ml-2">→</span>
                </span>
              </button>

              <button
                onClick={() => setMode(GameMode.PRIME_LAB)}
                className="group p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-400 text-left"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🧪</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-900 mb-2">1-1 Prime Lab</h2>
                <p className="text-gray-500 mb-4">소수를 융합하거나 합성수를 소인수분해하는 실험을 해보세요.</p>
                <span className="inline-flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  시작하기 <span className="ml-2">→</span>
                </span>
              </button>
            </div>
            
            <footer className="mt-16 text-gray-400 text-sm">
              &copy; JSI
            </footer>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default App;
