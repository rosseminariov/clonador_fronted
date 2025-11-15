import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Audio } from '../../domain/models/audio.model';
import { AudioRepoPort } from '../../domain/ports/audio-repo.port';
import { APP_CONFIG, AppConfig } from '../../core/config/app-config';

@Injectable({ providedIn: 'root' })
export class AudioRepoHttp implements AudioRepoPort {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private cfg: AppConfig
  ) {}

async upload(file: File): Promise<{ voice_id: string }> {
  const fd = new FormData();
  fd.append('file', file, file.name);
  return await firstValueFrom(
    this.http.post<{ voice_id: string }>(`${this.cfg.apiUrl}/train_voice`, fd)
  );
}

}
