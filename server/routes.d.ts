import { Express } from 'express';

declare module './routes' {
  export function registerRoutes(app: Express): Promise<any>;
}