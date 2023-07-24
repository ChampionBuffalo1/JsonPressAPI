namespace NodeJS {
  interface ProcessEnv {
    API_PORT?: number;
    NODE_ENV?: 'production' | 'development';
    JWT_SECRET: string;
    REDIS_URL: string;
    MONGO_URL: string;
  }
}
