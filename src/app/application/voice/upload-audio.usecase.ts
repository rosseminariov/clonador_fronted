import { Injectable } from "@angular/core";
import { AudioRepoPort } from "../../domain/ports/audio-repo.port";
import { Audio } from "../../domain/models/audio.model";

@Injectable({ providedIn: 'root' })
export class UploadAudioUseCase {
    constructor(private repo: AudioRepoPort) {}

    async execute(file: File): Promise<Audio> {
        return this.repo.upload(file);
    }
}