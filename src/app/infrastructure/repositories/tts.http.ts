// src/app/infrastructure/repositories/tts.http.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TTSPort } from '../../domain/ports/tts.port';
import { Voice } from '../../domain/models/voice.model';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

@Injectable({ providedIn: 'root' })
export class TTSHttp implements TTSPort {
  constructor(private http: HttpClient, @Inject(APP_CONFIG) private cfg: AppConfig) {}

  async listVoices(): Promise<Voice[]> {
    return await firstValueFrom(this.http.get<Voice[]>(`${this.cfg.apiUrl}/voices`));
  }

  async clone(opts: { voice_id: string; text?: string; audio_id?: number; file?: Blob }): Promise<Blob> {
    const fd = new FormData();
    fd.append('voice_id', opts.voice_id);
    fd.append('text', opts.text ?? '');
    if (opts.audio_id != null) fd.append('audio_id', String(opts.audio_id));
    if (opts.file) fd.append('file', opts.file, 'audio.webm');

    return await firstValueFrom(
      this.http.post(`${this.cfg.apiUrl}/clone`, fd, { responseType: 'blob' })
    );
  }
}
