import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { 
  MousePointer2, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Globe,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { ProjectUsageProps } from '@/shared/types/project';

export const ProjectUsage = ({ steps }: ProjectUsageProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = steps.length;
  const nextStep = () => setCurrentStep((prev) => (prev + 1) % totalSteps);
  const prevStep = () => setCurrentStep((prev) => (prev - 1 + totalSteps) % totalSteps);

  const currentAction = steps[currentStep]?.actionType || 'interaction';

  return (
    <div className="space-y-8">
      {/* Visual Simulation Display */}
      <div className="relative h-[300px] w-full bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center backdrop-blur-sm shadow-2xl">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full flex items-center justify-center p-8"
          >
            {/* Visual Presets based on actionType */}
            {currentAction === 'navigation' && (
              <div className="w-full max-w-md space-y-4">
                <div className="h-10 w-full rounded-xl bg-white/5 border border-white/10 flex items-center px-4 gap-3">
                  <Globe className="w-4 h-4 text-primary animate-pulse" />
                  <div className="h-2 w-32 rounded-full bg-white/20" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {[1, 2, 3].map(i => (
                     <div key={i} className="h-24 rounded-xl bg-white/5 border border-white/10 p-3 flex flex-col gap-2">
                        <div className="h-2 w-full bg-white/10 rounded-full" />
                        <div className="mt-auto h-4 w-12 bg-primary/20 rounded-lg self-end" />
                     </div>
                   ))}
                </div>
              </div>
            )}

            {currentAction === 'interaction' && (
              <div className="relative w-full max-w-sm h-48 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-white/10 p-6 shadow-xl">
                 <div className="space-y-3">
                   <div className="h-4 w-3/4 bg-white/20 rounded-full" />
                   <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                   <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="h-12 rounded-xl bg-white/10 animate-pulse border border-white/10" />
                      <div className="h-12 rounded-xl bg-white/10 border border-white/10" />
                   </div>
                 </div>
                 {/* Cursor Animation */}
                 <motion.div 
                    animate={{ 
                      x: [40, 0, 80, 40], 
                      y: [40, -20, 30, 40],
                      scale: [1, 0.9, 1.1, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute z-20"
                 >
                    <MousePointer2 className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] fill-primary" />
                 </motion.div>
              </div>
            )}

            {currentAction === 'form' && (
              <div className="w-full max-w-xs space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                 <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="h-2 w-12 bg-white/10 rounded-full" />
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
                           <motion.div 
                             initial={{ x: -100 }}
                             animate={{ x: 0 }}
                             transition={{ delay: 0.5, duration: 1 }}
                             className="absolute inset-y-0 left-3 flex items-center"
                           >
                             <div className="h-2 w-24 bg-primary/40 rounded-full" />
                           </motion.div>
                        </div>
                      </div>
                    ))}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-12 w-full bg-primary rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20"
                    >
                      SUBMIT
                    </motion.div>
                 </div>
              </div>
            )}

            {currentAction === 'search' && (
              <div className="w-full max-w-sm relative">
                 <div className="h-14 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center px-6 gap-4 shadow-2xl">
                    <Search className="w-5 h-5 text-primary" />
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: "60%" }}
                       transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                       className="h-3 bg-white/20 rounded-full"
                    />
                 </div>
                 <div className="mt-4 space-y-2">
                    {[1, 2].map(i => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 * i }}
                        className="h-12 w-full bg-white/5 border border-white/5 rounded-xl px-4 flex items-center justify-between"
                      >
                         <div className="h-2 w-24 bg-white/10 rounded-full" />
                         <ChevronRight className="w-4 h-4 text-white/30" />
                      </motion.div>
                    ))}
                 </div>
              </div>
            )}

            {currentAction === 'result' && (
              <div className="text-center space-y-6">
                 <motion.div 
                   initial={{ scale: 0, rotate: -45 }}
                   animate={{ scale: 1, rotate: 0 }}
                   className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                 >
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                 </motion.div>
                 <div className="space-y-2">
                    <div className="h-4 w-48 bg-white/20 rounded-full mx-auto" />
                    <div className="h-2 w-32 bg-white/10 rounded-full mx-auto" />
                 </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 flex gap-2 no-print">
           <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold">
              Simulation Mode
           </div>
        </div>
      </div>

      {/* Step Description Card */}
      <Card className="p-8 bg-primary/5 border-primary/20 relative overflow-hidden group">
         {/* Animated Background Gradient */}
         <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-primary/20" />
         
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-xl font-black shadow-lg shadow-primary/30">
                     {currentStep + 1}
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold tracking-tight">{steps[currentStep].title}</h3>
                     <p className="text-xs text-primary uppercase font-bold tracking-wider mt-1 opacity-70">
                        {currentAction} Action
                     </p>
                  </div>
               </div>

               <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevStep}
                    className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                  >
                     <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={nextStep}
                    className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                  >
                     <ChevronRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
               {steps[currentStep].description}
            </p>

            {/* Step Indicators */}
            <div className="flex gap-2 mt-8">
               {steps.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                       i === currentStep ? 'w-12 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'w-2 bg-white/10 hover:bg-white/30'
                    }`}
                  />
               ))}
            </div>
         </div>
      </Card>
    </div>
  );
}
