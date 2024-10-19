export const RESOLUTION = {
  "480p": { width: 640, height: 360, scale: 0.5 },
  "720p": { width: 1280, height: 720, scale: 1 },
  "1080p": { width: 1920, height: 1080, scale: 1.5 },
  "1440p": { width: 2560, height: 1440, scale: 2 },
  "2160p": { width: 3840, height: 2160, scale: 3 },
} as const;
export type RESOLUTION = keyof typeof RESOLUTION;

export const BALL_SIZE = {
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
} as const
export type BALL_SIZE = (typeof BALL_SIZE)[keyof typeof BALL_SIZE]

export const PADDLE_SIZE = {
  SMALL: 60,
  MEDIUM: 100,
  LARGE: 140,
} as const
export type PADDLE_SIZE = (typeof PADDLE_SIZE)[keyof typeof PADDLE_SIZE]
