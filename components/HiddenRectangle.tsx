
import React, { useState, useCallback, useMemo } from 'react';

interface HiddenRectangleProps {
  onBack: () => void;
}

const HiddenRectangle: React.FC<HiddenRectangleProps> = ({ onBack }) => {
  const [targetCount, setTargetCount] = useState<number>(6);
  const [isPlaying, setIsPlaying] = useState(false);
  const [winningCells, setWinningCells] = useState<Set<number>>(new Set());
  const [revealedCells, setRevealedCells] = useState<Record<number, boolean>>({});

  const validDimensions = useMemo(() => {
    const dims: [number, number][] = [];
    for (let w = 1; w <= 10; w++) {
      if (targetCount % w === 0) {
        const h = targetCount / w;
        if (h <= 10) {
          dims.push([w, h]);
        }
      }
    }
    return dims;
  }, [targetCount]);

  const generateRectangle = useCallback(() => {
    if (validDimensions.length === 0) return new Set<number>();

    const [w, h] = validDimensions[Math.floor(Math.random() * validDimensions.length)];
    const startX = Math.floor(Math.random() * (10 - w + 1));
    const startY = Math.floor(Math.random() * (10 - h + 1));

    const winning = new Set<number>();
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        winning.add((startY + dy) * 10 + (startX + dx) + 1);
      }
    }
    return winning;
  }, [validDimensions]);

  const handleStart = () => {
    if (validDimensions.length === 0) {
      alert(`${targetCount}개의 칸으로는 10x10 격자 안에 직사각형을 만들 수 없습니다!`);
      return;
    }
    const winning = generateRectangle();
    setWinningCells(winning);
    setRevealedCells({});
    setIsPlaying(true);
  };

  const toggleCell = (id: number) => {
    if (revealedCells[id]) return;
    const newRevealed = { ...revealedCells, [id]: true };
    setRevealedCells(newRevealed);
  };

  const foundCountValue = useMemo(() => 
    Object.keys(revealedCells).filter(id => winningCells.has(parseInt(id))).length,
  [revealedCells, winningCells]);

  const foundAll = foundCountValue === targetCount && targetCount > 0;

  if (!isPlaying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-indigo-50">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-indigo-100">
          <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">직사각형을 찾아라!</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                당첨 칸 개수 설정
              </label>
              <input
                type="number"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 0)}
                className="w-full p-4 border-2 border-indigo-100 rounded-2xl focus:border-indigo-500 outline-none text-xl text-center"
              />
              {validDimensions.length === 0 && targetCount > 0 && (
                <div className="mt-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-700 font-black text-center animate-bounce shadow-md">
                  ⚠️ 이 숫자는 직사각형 생성이 불가능합니다!
                  <br />
                  <span className="text-xs font-bold text-red-500">(10 이하의 약수 쌍이 필요합니다)</span>
                </div>
              )}
            </div>
            <button
              onClick={handleStart}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={validDimensions.length === 0}
            >
              게임 시작
            </button>
            <button
              onClick={onBack}
              className="w-full text-gray-500 font-medium py-2 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              메인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-indigo-600 font-bold p-2 hover:bg-white rounded-xl">🏠 메인</button>
          <div>
            <h2 className="text-2xl font-bold text-indigo-900">1-0 Hidden Rectangle</h2>
            <p className="text-indigo-600 font-medium">총 {targetCount}개의 당첨 칸을 찾으세요!</p>
          </div>
        </div>
        <button
          onClick={() => setIsPlaying(false)}
          className="px-6 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm"
        >
          설정으로 돌아가기
        </button>
      </div>

      {/* Success Message Button Above Grid */}
      <div className="h-20 w-full flex items-center justify-center mb-2">
        {foundAll && (
          <button
            onClick={() => setIsPlaying(false)}
            className="animate-in slide-in-from-top-4 fade-in duration-500 bg-green-600 text-white px-10 py-3 rounded-full font-black shadow-2xl ring-4 ring-green-100 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all flex flex-col items-center"
          >
            <span className="text-lg">🎉 모든 당첨 칸을 찾았습니다!</span>
            <span className="text-xs font-bold opacity-80">(클릭하여 다시 설정하기)</span>
          </button>
        )}
      </div>

      <div className={`grid grid-cols-10 gap-2 p-4 bg-white rounded-3xl shadow-xl border-4 ${foundAll ? 'border-green-400' : 'border-transparent'}`}>
        {Array.from({ length: 100 }, (_, i) => i + 1).map((id) => {
          const isRevealed = !!revealedCells[id];
          const isWinning = winningCells.has(id);
          
          return (
            <button
              key={id}
              onClick={() => toggleCell(id)}
              className={`
                w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all
                ${isRevealed 
                  ? (isWinning ? 'bg-green-100 text-green-700 scale-110 shadow-inner' : 'bg-red-100 text-red-700 opacity-100 border border-red-200') 
                  : 'bg-gray-100 text-gray-400 hover:bg-indigo-100 hover:text-indigo-400'}
              `}
            >
              {isRevealed ? (
                isWinning ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">●</div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">●</div>
                )
              ) : (
                id
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-10 bg-white px-10 py-4 rounded-2xl shadow-sm border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500"></div>
          <span className="font-bold text-gray-600">당첨</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-red-500"></div>
          <span className="font-bold text-gray-600">꽝</span>
        </div>
        <div className="font-black text-indigo-900 border-l-2 pl-10 text-xl">
          진행: {foundCountValue} / {targetCount}
        </div>
      </div>
    </div>
  );
};

export default HiddenRectangle;
