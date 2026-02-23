import { ReactNode } from "react";

export interface MissionSegment {
  id: string;
  tag: string;
  phrase: string;
  icon: ReactNode;
  color: string;
}
