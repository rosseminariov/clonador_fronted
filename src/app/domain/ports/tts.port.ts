import { Voice } from '../models/voice.model';

export abstract class TTSPort {
  abstract listVoices(): Promise<Voice[]>;

  abstract clone(opts: {
    voice_id: string;
    text?: string;
    lang?: string;
    speed?: number;
    audio_id?: number;
    file?: Blob;
  }): Promise<Blob>;
}
