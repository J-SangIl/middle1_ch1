import React, { useState, useMemo } from 'react';
import { FactorNode, PRIME_COLORS } from '../types';

interface DecompositionModeProps {
  onExit: () => void;
  onHome: () => void;
}

// 소수 판별 함수
const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

// 약수 목록 가져오기 (자기 자신과 1 제외)
const getFactors = (num: number): number[] => {
  const factors = [];
  for (let i = 2; i < num; i++) {
    if (num % i === 0) factors.push(i);
  }
  return factors;
};

const DecompositionMode: React.FC<DecompositionModeProps> = ({ onExit, onHome }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [rootNode, setRootNode] = useState<FactorNode | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // 실험 시작
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

  // 트리 업데이트 (특정 노드를 두 인수로 분해)
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
            color: isPrime(f1) ? (PRIME_COLORS[f1] || 'bg-green-100 border-green-300 text-green-800') : undefined
          },
          { 
            id: `${node.id}-R`, 
            value: f2, 
            children: null, 
            isPrime: isPrime(f2),
            color: isPrime(f2) ? (PRIME_COLORS[f2] || 'bg-green-100 border-green-300 text-green-800') : undefined
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

  // 노드 분해 실행
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

  // 소인수 결과 수집
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

  // 모든 분해 완료 여부 확인
  const isComplete = useMemo(() => {
    if (!rootNode) return false;
    const check = (node: FactorNode): boolean => {
      if (!node.children) return node.isPrime;
      return check(node.children[0]) && check(node.children[1]);
    };
    return check(rootNode);
  }, [rootNode]);

  // 소인수분해 식 생성 (거듭제곱 없이 모든 소인수 나열)
  const factorizationResultElements = useMemo(() => {
    if (allPrimes.length === 0) return null;
    // 소인수를 오름차순으로 정렬
    const sortedPrimes = [...allPrimes].sort((a, b) => a - b);
    
    return sortedPrimes.map((p, idx) => (
      <React.Fragment key={`${p}-${idx}`}>
        {idx > 0 && <span className="mx-2 text-slate-300 font-light">×</span>}
        <span className="inline-flex items-baseline">
          <span className="text-3xl md:text-4xl font-black text-slate-800">{p}</span>
        </span>
      </React.Fragment>
    ));
  }, [allPrimes]);

  // 트리 노드 렌더링 (재귀)
  const renderTreeNode = (node: FactorNode) => {
    const hasChildren = node.children !== null;
    const isSelected = selectedNodeId === node.id;

    return (
      <div className="flex flex-col items-center relative" key={node.id}>
        <div className="relative flex flex-col items-center min-w-[60px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!node.isPrime && !hasChildren) {
                setSelectedNodeId(isSelected ? null : node.id);
              }
            }}
            className={`
              min-w-[50px] h-10 px-2 rounded-full flex items-center justify-center font-bold transition-all relative z-30
              ${node.isPrime ? (node.color || 'bg-green-100 border-green-400 shadow-sm') : 'bg-transparent text-slate-800 border-2 border-transparent'}
              ${isSelected ? 'ring-4 ring-blue-300 scale-110 shadow-lg' : ''}
              ${!node.isPrime && !hasChildren ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'}
              text-lg
            `}
          >
            {node.value}
          </button>

          {isSelected && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 min-w-[200px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] p-4 border border-blue-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-[10px] font-black text-blue-600 mb-2 text-center uppercase tracking-tighter">
                {node.value}를 어떤 수로 나눌까요?
              </p>
              <div className="grid grid-cols-4 gap-1">
                {getFactors(node.value).map(f => (
                  <button
                    key={f}
                    onClick={(e) => { e.stopPropagation(); splitNode(node.id, f); }}
                    className="py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedNodeId(null)} className="w-full mt-2 text-[8px] text-gray-400 font-bold hover:text-red-400 uppercase">닫기</button>
            </div>
          )}
        </div>

        {hasChildren && (
          <div className="flex justify-center mt-12 relative w-full animate-in fade-in duration-700 delay-300">
            <div className="flex-1 flex justify-center px-4 md:px-8 min-w-[80px]">
              {renderTreeNode(node.children![0])}
            </div>
            <div className="flex-1 flex justify-center px-4 md:px-8 min-w-[80px]">
              {renderTreeNode(node.children![1])}
            </div>

            <div className="absolute top-[-48px] left-0 right-0 h-12 pointer-events-none overflow-visible">
              <svg className="w-full h-full overflow-visible" style={{ position: 'absolute' }}>
                <line 
                  x1="50%" y1="0" x2="25%" y2="100%" 
                  stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" 
                  className="animate-line-draw-smooth"
                />
                <line 
                  x1="50%" y1="0" x2="75%" y2="100%" 
                  stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" 
                  className="animate-line-draw-smooth"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center overflow-x-hidden">
      <style>
        {`
          @keyframes lineDrawSmooth {
            0% { stroke-dasharray: 0, 200; stroke-dashoffset: 0; }
            100% { stroke-dasharray: 200, 200; stroke-dashoffset: 0; }
          }
          @keyframes bounceShort {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          @keyframes celebratory-zoom {
            0% { transform: scale(0.9); opacity: 0; }
            70% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-line-draw-smooth {
            stroke-dasharray: 0, 200;
            animation: lineDrawSmooth 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .animate-bounce-short {
            animation: bounceShort 2s ease-in-out infinite;
          }
          .animate-celebratory {
            animation: celebratory-zoom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .delay-300 {
            animation-delay: 0.3s;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      {/* 상단 네비게이션 */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 shrink-0 relative z-10">
        <div className="flex gap-2">
          <button onClick={onHome} className="text-slate-500 text-sm font-bold hover:bg-white px-2 py-1 rounded-lg transition-colors shadow-sm bg-white/50 backdrop-blur-sm">🏠 메인</button>
          <button onClick={onExit} className="text-slate-500 text-sm font-bold hover:bg-white px-2 py-1 rounded-lg transition-colors shadow-sm bg-white/50 backdrop-blur-sm">← 모드 선택</button>
        </div>
        <h2 className="text-xl font-black text-slate-800">소인수분해 실험실</h2>
        <div className="w-24"></div>
      </div>

      {!rootNode ? (
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
          <div className="bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 w-full animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">실험할 자연수 입력</h3>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startDecomposition()}
              className="w-full p-4 border-2 border-slate-100 rounded-2xl focus:border-blue-400 outline-none text-2xl text-center mb-6 font-bold shadow-inner"
              placeholder="예: 48"
            />
            <button
              onClick={startDecomposition}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              분해 시작하기
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 w-full max-w-6xl bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-500 relative">
          
          {/* 소인수분해 완료 강조창 */}
          {isComplete ? (
            <div className="p-8 bg-gradient-to-b from-green-50 to-white border-b border-green-100 text-center relative overflow-hidden animate-celebratory">
              {/* 장식용 아이콘 */}
              <div className="absolute top-4 left-8 text-4xl opacity-20 rotate-12">🧪</div>
              <div className="absolute bottom-4 right-8 text-4xl opacity-20 -rotate-12">✨</div>
              
              <div className="inline-block mb-3 px-4 py-1 bg-green-500 text-white text-[11px] font-black rounded-full shadow-lg shadow-green-100 tracking-[0.2em] uppercase animate-bounce-short">
                Mission Complete!
              </div>
              
              <h4 className="text-2xl font-black text-green-800 mb-6">소인수분해 성공!</h4>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex flex-col items-center">
                   <span className="text-sm font-bold text-slate-400 mb-1">Original</span>
                   <span className="text-3xl font-black text-slate-800">{rootNode.value}</span>
                </div>
                <div className="text-4xl text-slate-200 font-light mx-4">=</div>
                <div className="flex items-center bg-white px-10 py-5 rounded-[30px] shadow-xl shadow-green-900/5 border-2 border-green-400/30 overflow-x-auto max-w-full">
                  {factorizationResultElements}
                </div>
              </div>
              
              <button 
                onClick={() => setRootNode(null)}
                className="px-10 py-3 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg hover:scale-105 active:scale-95 text-lg"
              >
                새로운 숫자 실험하기
              </button>
            </div>
          ) : (
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">실험 대상</span>
                <span className="text-2xl font-black text-slate-800">{rootNode.value}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 italic">합성수를 클릭해 나누어 보세요!</span>
                <button 
                  onClick={() => setRootNode(null)}
                  className="px-4 py-2 text-slate-400 hover:text-slate-600 font-bold transition-colors text-sm bg-white rounded-xl shadow-sm border border-slate-100"
                >
                  초기화
                </button>
              </div>
            </div>
          )}
          
          {/* 트리 본체 */}
          <div className="flex-1 relative overflow-auto p-12 flex justify-center items-start min-h-[500px] scrollbar-hide">
            <div className={`min-w-max transition-all duration-700 ${isComplete ? 'scale-90 opacity-60 grayscale-[0.3]' : ''}`}>
              {renderTreeNode(rootNode)}
            </div>
          </div>

          {/* 하단 안내 문구 */}
          {!isComplete && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 font-bold">
                숫자를 클릭하면 나눌 수 있는 인수가 나타납니다. 모든 끝 노드가 <span className="text-blue-500">소수</span>가 되면 실험이 완료됩니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DecompositionMode;