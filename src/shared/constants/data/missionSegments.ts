import { 
  Castle, 
  Zap, 
  Wand2, 
  BrainCircuit, 
  Gem,
  type LucideIcon 
} from 'lucide-react';

export interface MissionSegmentMeta {
  id: string;
  tagIndex: number;
  phraseIndex: number;
  defaultTag: string;
  Icon: LucideIcon;
  color: string;
}

export const MISSION_SEGMENTS_CONFIG: readonly MissionSegmentMeta[] = [
  {
    id: 'empires',
    tagIndex: 0,
    phraseIndex: 0,
    defaultTag: 'Empires',
    Icon: Castle,
    color: 'bg-indigo-500 dark:bg-indigo-600',
  },
  {
    id: 'performance',
    tagIndex: 1,
    phraseIndex: 1,
    defaultTag: 'Performance',
    Icon: Zap,
    color: 'bg-amber-500 dark:bg-amber-600',
  },
  {
    id: 'elegance',
    tagIndex: 2,
    phraseIndex: 2,
    defaultTag: 'Elegance',
    Icon: Wand2,
    color: 'bg-emerald-500 dark:bg-emerald-600',
  },
  {
    id: 'innovation',
    tagIndex: 3,
    phraseIndex: 3,
    defaultTag: 'Innovation',
    Icon: BrainCircuit,
    color: 'bg-rose-500 dark:bg-rose-600',
  },
  {
    id: 'excellence',
    tagIndex: 4,
    phraseIndex: 4,
    defaultTag: 'Excellence',
    Icon: Gem,
    color: 'bg-sky-500 dark:bg-sky-600',
  },
] as const;
