export interface AppConfig {
    apiUrl: string;
}
export const APP_CONFIG = Symbol('APP_CONFIG');
export const DEFAULT_APP_CONFIG: AppConfig = {
    apiUrl: 'http://localhost:8000/api'
};