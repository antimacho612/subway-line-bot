declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_CHANNEL_ACCESS_TOKEN?: string;
      LINE_CHANNEL_SECRET?: string;
      PORT?: string;
      VERCEL?: string;
    }
  }
}

export {};
