
import React from 'react';
import FusionMode from './FusionMode';

interface PrimeLabProps {
  onBack: () => void;
}

const PrimeLab: React.FC<PrimeLabProps> = ({ onBack }) => {
  // 분해 모드 기능을 제거하고 바로 융합 모드를 렌더링합니다.
  return (
    <div className="min-h-screen bg-blue-50">
      <FusionMode onExit={onBack} onHome={onBack} />
    </div>
  );
};

export default PrimeLab;
