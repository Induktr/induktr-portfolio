import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { VideoPlayer } from '@/shared/ui/VideoPlayer';
import { cn } from '@/shared/lib/utils';
import { ProjectSliderProps } from '@/shared/types/project';

import { slideVariants } from '@/shared/constants/animations/slide';

export function ProjectSlider({ items, className }: ProjectSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div className={cn("relative overflow-hidden rounded-xl bg-muted/20 group", className)}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {currentItem.type === 'video' ? (
            <VideoPlayer 
              src={currentItem.url} 
              className="w-full h-full"
              autoPlay={items.length === 1} // Only autoplay if it's the only item
            />
          ) : (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${currentItem.url})` }}
            />
          )}

          {/* Title Overlay */}
          {currentItem.title && (
            <div className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-white text-xs border border-white/10">
                {currentItem.title}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => paginate(1)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-primary w-6" 
                    : "bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}

      {/* Type Indicator */}
      <div className="absolute top-4 left-4 z-30 no-print">
        <div className="flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 text-[10px] text-white/80">
          {currentItem.type === 'video' ? <PlayCircle className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
          <span>{currentIndex + 1} / {items.length}</span>
        </div>
      </div>
    </div>
  );
}
