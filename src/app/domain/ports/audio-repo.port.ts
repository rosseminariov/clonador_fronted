import { Audio } from '../models/audio.model';
export abstract class AudioRepoPort {
  abstract upload(file: File): Promise<{ voice_id: string }>;
}

