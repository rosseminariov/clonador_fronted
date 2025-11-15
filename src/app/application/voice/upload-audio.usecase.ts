// src/app/application/voice/upload-audio.usecase.ts
import { Injectable } from '@angular/core';
import { AudioRepoPort } from '../../domain/ports/audio-repo.port';

@Injectable({ providedIn: 'root' })
export class UploadAudioUseCase {
  constructor(private repo: AudioRepoPort) {}

  execute(file: File): Promise<{ voice_id: string }> {
    return this.repo.upload(file);
  }
}
