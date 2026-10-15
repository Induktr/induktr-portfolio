import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { useMissionWheel } from '@/shared/hooks/useMissionWheel';
import { 
  calculateSegmentAngles, 
  calculateSegmentPath, 
  calculateIconCoordinates 
} from '@/shared/lib/math/wheelGeometry';

export const MissionWheel = () => {
  const {
    activeIndex,
    setActiveIndex,
    isRotating,
    toggleRotating,
    missionSegments,
    t,
  } = useMissionWheel();

  return (
    <div className="relative w-full max-w-lg mx-auto mt-12 mb-16 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          {t('mission-statement.title')}
        </h2>
        <p className="text-muted-foreground italic">"{t('mission-statement.author')}"</p>
      </div>
      
      <button 
        onClick={toggleRotating}
        className="absolute top-0 right-4 p-3 rounded-full hover:bg-muted transition-all active:scale-95 z-30"
        aria-label="Rotate wheel"
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
        
        {/* SVG Wheel segments */}
        <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-muted/10 shadow-inner">
          <motion.div 
            className="w-full h-full relative"
            animate={isRotating ? { rotate: 360 } : { rotate: 0 }}
            transition={isRotating ? { repeat: Infinity, duration: 15, ease: "linear" } : { duration: 1 }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {missionSegments.map((segment, index) => {
                const { anglePerSegment, startAngle, endAngle } = calculateSegmentAngles(index, missionSegments.length);
                const pathData = calculateSegmentPath(startAngle, endAngle);
                const iconCoords = calculateIconCoordinates(startAngle, anglePerSegment);
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
                      x={iconCoords.x}
                      y={iconCoords.y}
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
};
