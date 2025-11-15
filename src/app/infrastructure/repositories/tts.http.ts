// src/app/infrastructure/repositories/tts.http.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TTSPort } from '../../domain/ports/tts.port';
import { Voice } from '../../domain/models/voice.model';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

@Injectable({ providedIn: 'root' })
export class TTSHttp implements TTSPort {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private cfg: AppConfig
  ) {}

  // Nuestro backend NO tiene /voices por ahora.
  // Devolvemos un array vacío para no romper nada si se llama.
  async listVoices(): Promise<Voice[]> {
    return [];
  }

  /**
   * Clona la voz usando el endpoint POST /synthesize
   * del backend FastAPI.
   *
   * Ignoramos audio_id y file porque el backend actual
   * solo necesita: text, voice_id, lang, speed.
   */
  async clone(opts: {
    voice_id: string;
    text?: string;
    lang?: string;
    speed?: number;
    audio_id?: number;
    file?: Blob;
  }): Promise<Blob> {
    const body = {
      text: opts.text ?? 'Hola, soy un clon de tu voz usando IA.',
      voice_id: opts.voice_id,
      lang: opts.lang ?? 'es',
      speed: opts.speed ?? 1.0,
    };

    return await firstValueFrom(
      this.http.post(`${this.cfg.apiUrl}/synthesize`, body, {
        responseType: 'blob',
      })
    );
  }
}
