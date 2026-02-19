
import React, { useState, useMemo } from 'react';
import { FactorNode, PRIME_COLORS } from '../types';

interface DecompositionModeProps {
  onExit: () => void;
  onHome: () => void;
}

const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const getFactors = (num: number): number[] => {
  const factors = [];
  for (let i = 2; i < num; i++) {
    if (num % i === 0) factors.push(i);
  }
  return factors;
};

const DecompositionMode: React.FC<DecompositionModeProps> = ({ onExit, onHome }) => {
  const [inputValue, setInputValue] = useState<string>('48');
  const [rootNode, setRootNode] = useState<FactorNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const startDecomposition = () => {
    const val = parseInt(inputValue);
    if (isNaN(val) || val < 2) {
      alert("2 이상의 자연수를 입력하세요.");
      return;
    }
    setRootNode({
      id: 'root',
      value: val,
      children: null,
      isPrime: isPrime(val),
      color: isPrime(val) ? PRIME_COLORS[val] : undefined
    });
    setSelectedNodeId(null);
  };

  const updateTree = (node: FactorNode, targetId: string, f1: number, f2: number): FactorNode => {
    if (node.id === targetId) {
      return {
        ...node,
        children: [
          { 
            id: `${node.id}-L`, 
            value: f1, 
            children: null, 
            isPrime: isPrime(f1),
            color: isPrime(f1) ? (PRIME_COLORS[f1] || 'bg-green-100 border-green-300') : undefined
          },
          { 
            id: `${node.id}-R`, 
            value: f2, 
            children: null, 
            isPrime: isPrime(f2),
            color: isPrime(f2) ? (PRIME_COLORS[f2] || 'bg-green-100 border-green-300') : undefined
          }
        ]
      };
    }
    if (node.children) {
      return {
        ...node,
        children: [
          updateTree(node.children[0], targetId, f1, f2),
          updateTree(node.children[1], targetId, f1, f2)
        ]
      };
    }
    return node;
  };

  const splitNode = (id: string, factor: number) => {
    if (!rootNode) return;
    const findNode = (node: FactorNode): FactorNode | null => {
      if (node.id === id) return node;
      if (node.children) {
        return findNode(node.children[0]) || findNode(node.children[1]);
      }
      return null;
    };
    const node = findNode(rootNode);
    if (node && !node.isPrime) {
      const otherFactor = node.value / factor;
      setRootNode(updateTree(rootNode, id, factor, otherFactor));
      setSelectedNodeId(null);
    }
  };

  const allPrimes = useMemo(() => {
    if (!rootNode) return [];
    const collect = (node: FactorNode): number[] => {
      if (!node.children) {
        return node.isPrime ? [node.value] : [];
      }
      return [...collect(node.children[0]), ...collect(node.children[1])];
    };
    return collect(rootNode);
  }, [rootNode]);

  const isComplete = useMemo(() => {
    if (!rootNode) return false;
    const check = (node: FactorNode): boolean => {
      if (!node.children) return node.isPrime;
      return check(node.children[0]) && check(node.children[1]);
    };
    return check(rootNode);
  }, [rootNode]);

  const factorizationResultString = useMemo(() => {
    const sorted = [...allPrimes].sort((a, b) => a - b);
    return sorted.join(' × ');
  }, [allPrimes]);

  const renderTreeNode = (node: FactorNode) => {
    const hasChildren = node.children !== null;
    const isSelected = selectedNodeId === node.id;

    return (
      <div className={`flex flex-col items-center relative`} key={node.id}>
        <div className="relative flex flex-col items-center min-w-[80px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!node.isPrime && !hasChildren) {
                setSelectedNodeId(isSelected ? null : node.id);
              }
            }}
            className={`
              min-w-[56px] h-12 px-3 rounded-full flex items-center justify-center font-bold transition-all relative z-30
              ${node.isPrime ? (node.color || 'bg-green-100 border-green-400') : 'bg-transparent text-slate-800 border-2 border-transparent'}
              ${isSelected ? 'ring-4 ring-blue-300 scale-110 shadow-lg' : ''}
              ${!node.isPrime && !hasChildren ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'}
              text-lg
            `}
          >
            {node.value}
          </button>

          {isSelected && (
            <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 z-50 min-w-[240px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-5 border-2 border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
              <p className="text-xs font-black text-blue-600 mb-3 text-center">
                {node.value}를 어떤 수로 나눌까요?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {getFactors(node.value).map(f => (
                  <button
                    key={f}
                    onClick={(e) => { e.stopPropagation(); splitNode(node.id, f); }}
                    className="py-1.5 bg-blue-50 text-blue-700 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedNodeId(null)} className="w-full mt-3 text-[9px] text-gray-400 font-black hover:text-red-400 uppercase">닫기</button>
            </div>
          )}
        </div>

        {hasChildren && (
          <div className="flex justify-center mt-12 relative w-full animate-in fade-in duration-700">
            <div className="flex-1 flex justify-center px-4 md:px-8 min-w-[100px]">
              {renderTreeNode(node.children![0])}
            </div>
            <div className="flex-1 flex justify-center px-4 md:px-8 min-w-[100px]">
              {renderTreeNode(node.children![1])}
            </div>

            <div className="absolute top-[-48px] left-0 right-0 h-12 pointer-events-none overflow-visible">
              <svg className="w-full h-full overflow-visible">
                <style>
                  {`
                    @keyframes growLineDown {
                      from { stroke-dashoffset: 500; }
                      to { stroke-dashoffset: 0; }
                    }
                    .animate-line-down {
                      stroke-dasharray: 500;
                      stroke-dashoffset: 500;
                      animation: growLineDown 0.8s ease-out forwards;
                    }
                  `}
                </style>
                <line 
                  x1="50%" y1="0" x2="25%" y2="100%" 
                  stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" 
                  className="animate-line-down"
                />
                <line 
                  x1="50%" y1="0" x2="75%" y2="100%" 
                  stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" 
                  className="animate-line-down"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-between items-center mb-8 shrink-0">
        <div className="flex gap-4">
          <button onClick={onHome} className="text-slate-500 font-bold hover:bg-white px-3 py-1 rounded-lg transition-colors shadow-sm">🏠 메인</button>
          <button onClick={onExit} className="text-slate-500 font-bold hover:bg-white px-3 py-1 rounded-lg transition-colors shadow-sm">← 모드 선택</button>
        </div>
        <h2 className="text-2xl font-black text-slate-800">소인수분해 실험실</h2>
        <div className="w-32"></div>
      </div>

      {!rootNode ? (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center border border-slate-100 animate-in zoom-in duration-300">
          <div className="text-5xl mb-6">🔍</div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">분해할 숫자 입력</h3>
          <p className="text-slate-400 mb-8 font-medium italic">합성수를 소수의 곱으로 분해해보세요!</p>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-5 border-2 border-slate-100 rounded-3xl focus:border-green-400 outline-none text-3xl font-black text-center mb-8 shadow-inner"
          />
          <button
            onClick={startDecomposition}
            className="w-full bg-green-500 text-white font-black py-5 rounded-3xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
          >
            실험 시작
          </button>
        </div>
      ) : (
        <div className="w-full max-w-full flex flex-col items-center" onClick={() => setSelectedNodeId(null)}>
          <div className="w-full bg-white rounded-[60px] shadow-2xl border border-slate-100 p-8 md:p-16 min-h-[700px] flex flex-col items-center relative overflow-x-auto transition-all duration-700">
            
            {/* Completion result moved to TOP */}
            {isComplete && (
              <div className="mb-12 w-full max-w-2xl bg-green-50 rounded-[30px] p-6 border-4 border-green-200 text-center animate-in slide-in-from-top-12 fade-in duration-1000 shadow-xl relative z-40">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl animate-bounce">🎯</span>
                  <h4 className="text-xl font-black text-green-800 uppercase tracking-widest">소인수분해 완료!</h4>
                </div>
                <div className="h-[2px] w-1/4 bg-green-200 mx-auto my-3 rounded-full"></div>
                <p className="text-2xl md:text-3xl font-black text-green-900 drop-shadow-sm break-all leading-tight mb-4">
                  {rootNode.value} = {factorizationResultString}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setRootNode(null); }}
                  className="px-8 py-3 bg-green-500 text-white text-base rounded-2xl font-black hover:bg-green-600 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  다른 숫자 해보기
                </button>
              </div>
            )}

            <div className="flex justify-center min-w-max w-full">
              {renderTreeNode(rootNode)}
            </div>
          </div>

          <div className="mt-8 text-slate-500 text-xs font-bold tracking-wider opacity-60">
            * 숫자를 클릭하여 분해하세요. 소수가 되면 예쁜 색이 입혀집니다!
          </div>
        </div>
      )}
    </div>
  );
};

export default DecompositionMode;
