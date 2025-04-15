// Type declarations for modules without built-in types
declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  export type Icon = React.FC<IconProps>;
  
  export const Activity: Icon;
  export const AlertCircle: Icon;
  export const BarChart3: Icon;
  export const BookOpen: Icon;
  export const Clock: Icon;
  export const Cpu: Icon;
  export const CpuIcon: Icon;
  export const Database: Icon;
  export const File: Icon;
  export const GitBranch: Icon;
  export const HardDrive: Icon;
  export const InfoIcon: Icon;
  export const LayoutGrid: Icon;
  export const LineChart: Icon;
  export const Menu: Icon;
  export const Moon: Icon;
  export const Network: Icon;
  export const Pause: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const RotateCw: Icon;
  export const ScrollText: Icon;
  export const Server: Icon;
  export const SkipForward: Icon;
  export const Sun: Icon;
  export const Trash2: Icon;
  export const Users: Icon;
  export const X: Icon;
  export const Zap: Icon;
} 