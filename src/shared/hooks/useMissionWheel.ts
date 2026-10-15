import { useState, useMemo } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MissionSegment } from '@/shared/types/mission';
import { MISSION_SEGMENTS_CONFIG } from '@/shared/constants/data/missionSegments';

export function useMissionWheel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const { t } = useTranslation();

  const toggleRotating = () => setIsRotating((prev) => !prev);

  const missionSegments: MissionSegment[] = useMemo(() => {
    return MISSION_SEGMENTS_CONFIG.map((item) => {
      const IconComponent = item.Icon;
      return {
        id: item.id,
        tag: t(`mission-statement.tags.${item.tagIndex}`, item.defaultTag),
        phrase: t(`mission-statement.phrases.${item.phraseIndex}`),
        icon: React.createElement(IconComponent, { className: "h-6 w-6" }),
        color: item.color,
      };
    });
  }, [t]);

  return {
    activeIndex,
    setActiveIndex,
    isRotating,
    toggleRotating,
    missionSegments,
    t,
  };
}
