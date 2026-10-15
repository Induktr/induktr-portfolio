import React from "react";
import * as SiIcons from "react-icons/si";

export function renderToolIcon(
  iconName?: string, 
  className = "h-6 w-6"
): React.ReactNode {
  if (!iconName) {
    return <SiIcons.SiReact className={`${className} opacity-20`} />;
  }

  const IconComponent = (SiIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];

  if (!IconComponent) {
    return <SiIcons.SiReact className={`${className} opacity-20`} />;
  }

  return <IconComponent className={className} />;
}
