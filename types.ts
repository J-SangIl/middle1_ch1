
export enum GameMode {
  HOME = 'HOME',
  HIDDEN_RECTANGLE = 'HIDDEN_RECTANGLE',
  PRIME_LAB = 'PRIME_LAB'
}

// Interface for prime factorization tree nodes
export interface FactorNode {
  id: string;
  value: number;
  children: FactorNode[] | null;
  isPrime: boolean;
  color?: string;
}

export const PRIMES_UP_TO_50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

export const PRIME_COLORS: Record<number, string> = {
  2: 'bg-green-200 border-green-400 text-green-800',
  3: 'bg-blue-200 border-blue-400 text-blue-800',
  5: 'bg-yellow-200 border-yellow-400 text-yellow-800',
  7: 'bg-purple-200 border-purple-400 text-purple-800',
  11: 'bg-pink-200 border-pink-400 text-pink-800',
  13: 'bg-indigo-200 border-indigo-400 text-indigo-800',
  17: 'bg-orange-200 border-orange-400 text-orange-800',
  19: 'bg-teal-200 border-teal-400 text-teal-800',
  23: 'bg-cyan-200 border-cyan-400 text-cyan-800',
  29: 'bg-rose-200 border-rose-400 text-rose-800',
  31: 'bg-emerald-200 border-emerald-400 text-emerald-800',
  37: 'bg-violet-200 border-violet-400 text-violet-800',
  41: 'bg-amber-200 border-amber-400 text-amber-800',
  43: 'bg-lime-200 border-lime-400 text-lime-800',
  47: 'bg-fuchsia-200 border-fuchsia-400 text-fuchsia-800',
};
