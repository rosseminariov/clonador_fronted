// src/app/core/config/app-config.ts
import { InjectionToken } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

// Token de configuración para DI
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

// URL base de tu backend FastAPI
export const DEFAULT_APP_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:8000',
};
