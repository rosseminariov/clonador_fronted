// src/app/application/voice/clone-voice.usecase.ts
import { Injectable } from '@angular/core';
import { TTSPort } from '../../domain/ports/tts.port';

@Injectable({ providedIn: 'root' })
export class CloneVoiceUseCase {
  constructor(private tts: TTSPort) {}

  execute(opts: { 
    voice_id: string; 
    text: string; 
    lang: string; 
    speed: number; 
  }) {
    return this.tts.clone(opts);
  }
}
