export type MetallicType =
  | 'chrome'
  | 'gold'
  | 'amethyst'
  | 'rose'
  | 'ruby'
  | 'sapphire'
  | 'turquoise'
  | 'emerald'
  | 'obsidian'
  | 'holographic'
  | 'pearl';

export type MotionIntensity = 'full' | 'controlled' | 'minimal';

export interface ColorPalette {
  base: string[];
  primary: string[];
  warm: string[];
  cool: string[];
}

export interface MotionConfig {
  gyroSensitivity: { x: number; y: number; z: number };
  rotationMultiplier: { x: number; y: number; z: number };
  rotationScale: number;
  lightDirectionScale: number;
}
