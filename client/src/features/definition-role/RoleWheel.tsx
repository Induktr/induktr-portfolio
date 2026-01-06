import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/shared/ui/hover-card';
import { 
  Code, 
  Rocket, 
  Coins, 
  Video, 
  RotateCw 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Определяем типы для ролей
interface Role {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export function RoleWheel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const { t } = useTranslation();

  // Массив ролей
  const roles: Role[] = [
    {
      id: 'tech-specialist',
      title: t('roleWheel.roles.techSpecialist.title'),
      icon: <Code className="h-6 w-6" />,
      description: t('roleWheel.roles.techSpecialist.description'),
      color: 'bg-blue-500 dark:bg-blue-600'
    },
    {
      id: 'mvp-creator',
      title: t('roleWheel.roles.mvpCreator.title'),
      icon: <Rocket className="h-6 w-6" />,
      description: t('roleWheel.roles.mvpCreator.description'),
      color: 'bg-red-500 dark:bg-red-600'
    },
    {
      id: 'crypto-investor',
      title: t('roleWheel.roles.cryptoInvestor.title'),
      icon: <Coins className="h-6 w-6" />,
      description: t('roleWheel.roles.cryptoInvestor.description'),
      color: 'bg-green-500 dark:bg-green-600'
    },
    {
      id: 'content-creator',
      title: t('roleWheel.roles.contentCreator.title'),
      icon: <Video className="h-6 w-6" />,
      description: t('roleWheel.roles.contentCreator.description'),
      color: 'bg-purple-500 dark:bg-purple-600'
    }
  ];
  
  // Запускаем автоматическое вращение колеса
  const startRotation = () => {
    if (isRotating) return;
    
    setIsRotating(true);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setActiveIndex(currentIndex);
      currentIndex = (currentIndex + 1) % roles.length;
    }, 2000);
    
    // Очищаем интервал при размонтировании
    return () => clearInterval(interval);
  };
  
  return (
    <div className="relative w-full max-w-md mx-auto mt-8 mb-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">{t('roleWheel.title')}</h2>
        <p className="text-muted-foreground">{t('roleWheel.subtitle')}</p>
      </div>
      
      {/* Кнопка для запуска вращения */}
      <button 
        onClick={startRotation}
        className="absolute top-0 right-0 p-2 rounded-full hover:bg-muted transition-colors"
        disabled={isRotating}
      >
        <RotateCw className="h-5 w-5" />
      </button>
      
      <div className="relative w-64 h-64 mx-auto">
        {/* Центральный круг */}
        <div className="absolute inset-1/4 bg-background border-2 border-border rounded-full z-10 flex items-center justify-center">
          <span className="font-bold text-lg">@Induktr</span>
        </div>
        
        {/* Сегменты колеса */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {roles.map((role, index) => {
            const angle = (index * 90) % 360;
            const isActive = activeIndex === index;
            
            return (
              <HoverCard key={role.id} openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.div 
                    className={`absolute w-1/2 h-1/2 ${role.color} cursor-pointer transition-all duration-300 flex items-center justify-center`}
                    style={{
                      transformOrigin: '100% 100%',
                      transform: `rotate(${angle}deg) translate(-50%, -50%)`,
                      left: '50%',
                      top: '50%',
                    }}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      zIndex: isActive ? 5 : 1,
                    }}
                    onHoverStart={() => setActiveIndex(index)}
                    onHoverEnd={() => setActiveIndex(null)}
                  >
                    <div className="flex flex-col items-center justify-center p-2">
                      {role.icon}
                      <span className="text-white font-semibold mt-1 text-xs sm:text-sm">{role.title}</span>
                    </div>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent side="right" className="w-80 p-4">
                  <div className="flex justify-between space-x-4">
                    <div className={`w-12 h-12 rounded-full ${role.color} flex items-center justify-center`}>
                      {role.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{role.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
      
      {/* Текущая активная роль (для мобильных устройств, где нет ховера) */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center space-x-2 mb-2">
              <div className={`w-8 h-8 rounded-full ${roles[activeIndex].color} flex items-center justify-center`}>
                {roles[activeIndex].icon}
              </div>
              <h3 className="font-bold">{roles[activeIndex].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {roles[activeIndex].description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 