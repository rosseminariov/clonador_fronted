import { Audio } from '../models/audio.model';
export abstract class AudioRepoPort {
  abstract upload(file: File): Promise<Audio>;
}
