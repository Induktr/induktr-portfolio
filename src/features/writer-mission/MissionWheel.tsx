import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Castle, 
  Zap, 
  Wand2, 
  BrainCircuit, 
  Gem,
  RotateCw 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MissionSegment } from '@/shared/types/mission';

export const MissionWheel = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const { t } = useTranslation();

  const missionSegments: MissionSegment[] = [
    {
      id: 'empires',
      tag: t('mission-statement.tags.0', 'Empires'),
      phrase: t('mission-statement.phrases.0'),
      icon: <Castle className="h-6 w-6" />,
      color: 'bg-indigo-500 dark:bg-indigo-600'
    },
    {
      id: 'performance',
      tag: t('mission-statement.tags.1', 'Performance'),
      phrase: t('mission-statement.phrases.1'),
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-amber-500 dark:bg-amber-600'
    },
    {
      id: 'elegance',
      tag: t('mission-statement.tags.2', 'Elegance'),
      phrase: t('mission-statement.phrases.2'),
      icon: <Wand2 className="h-6 w-6" />,
      color: 'bg-emerald-500 dark:bg-emerald-600'
    },
    {
      id: 'innovation',
      tag: t('mission-statement.tags.3', 'Innovation'),
      phrase: t('mission-statement.phrases.3'),
      icon: <BrainCircuit className="h-6 w-6" />,
      color: 'bg-rose-500 dark:bg-rose-600'
    },
    {
      id: 'excellence',
      tag: t('mission-statement.tags.4', 'Excellence'),
      phrase: t('mission-statement.phrases.4'),
      icon: <Gem className="h-6 w-6" />,
      color: 'bg-sky-500 dark:bg-sky-600'
    }
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto mt-12 mb-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          {t('mission-statement.title')}
        </h2>
        <p className="text-muted-foreground italic">"{t('mission-statement.author')}"</p>
      </div>
      
      <button 
        onClick={() => setIsRotating(!isRotating)}
        className="absolute top-0 right-4 p-3 rounded-full hover:bg-muted transition-all active:scale-95 z-30"
      >
        <RotateCw className={`h-6 w-6 transition-transform duration-1000 ${isRotating ? 'rotate-180' : ''}`} />
      </button>
      
      <div className="relative w-80 h-80 mx-auto">
        {/* Central Core */}
        <div className="absolute inset-[32%] bg-background/95 backdrop-blur-xl border-4 border-primary/20 rounded-full z-20 flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary),0.2)]">
          <div className="text-center p-2">
            <span className="block text-[10px] uppercase tracking-widest text-primary font-bold opacity-70">Focus</span>
            <span className="block font-black text-xs uppercase tracking-tighter">Mission</span>
          </div>
        </div>
        
        {/* SVG Wheel segments for 5 pieces */}
        <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-muted/10 shadow-inner">
          <motion.div 
            className="w-full h-full relative"
            animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
            transition={isRotating ? { repeat: Infinity, duration: 15, ease: "linear" } : { duration: 1 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {missionSegments.map((segment, index) => {
                const total = missionSegments.length;
                const anglePerSegment = 360 / total;
                const startAngle = index * anglePerSegment;
                const endAngle = (index + 1) * anglePerSegment;
                
                // Convert angles to radians
                const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
                
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                const isActive = activeIndex === index;
                
                return (
                  <g 
                    key={segment.id} 
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <motion.path 
                      d={pathData}
                      className={segment.color.replace('bg-', 'fill-')}
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: isActive ? 1.05 : 1,
                        filter: isActive ? 'brightness(1.2) saturate(1.2)' : 'brightness(1) saturate(1)'
                      }}
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth="0.5"
                    />
                    
                    {/* Icon placement */}
                    <foreignObject 
                      x={50 + 30 * Math.cos((Math.PI * (startAngle + anglePerSegment / 2)) / 180) - 12}
                      y={50 + 30 * Math.sin((Math.PI * (startAngle + anglePerSegment / 2)) / 180) - 12}
                      width="24"
                      height="24"
                      className="pointer-events-none"
                    >
                      <div className="w-full h-full flex items-center justify-center text-white rotate-90 scale-75">
                         {segment.icon}
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>

        {/* Hover Text Overlays via HoverCard (needs trigger outside SVG g for best reliability, or custom logic) */}
        {missionSegments.map((segment, index) => {
           const anglePerSegment = 360 / missionSegments.length;
           const midAngle = index * anglePerSegment + anglePerSegment / 2;
           // We'll use invisible triggers or just the description area below
           return null;
        })}
      </div>

      {/* Description Area */}
      <AnimatePresence mode="wait">
        {activeIndex !== null ? (
          <motion.div 
            key={missionSegments[activeIndex].id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-8 p-6 bg-card/40 backdrop-blur-md rounded-2xl border border-primary/10 shadow-xl text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${missionSegments[activeIndex].color} text-white`}>
                {missionSegments[activeIndex].icon}
              </div>
              <h3 className="text-xl font-bold text-primary tracking-tight uppercase">
                {missionSegments[activeIndex].tag}
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground italic">
              "{missionSegments[activeIndex].phrase}"
            </p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-6 text-center text-muted-foreground animate-pulse"
          >
            <p>{t('mission-statement.phrases.0', 'Explore the facets of my digital mission...')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
