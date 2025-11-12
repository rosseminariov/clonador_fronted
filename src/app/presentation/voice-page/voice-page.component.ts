import { Component, OnInit } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import { UploadAudioUseCase } from '../../application/voice/upload-audio.usecase';
import { CloneVoiceUseCase } from '../../application/voice/clone-voice.usecase';
import { TTSHttp } from '../../infrastructure/repositories/tts.http';

@Component({
  selector: 'app-voice-page',
  templateUrl: './voice-page.component.html',
  styleUrls: ['./voice-page.component.css']
})
export class VoicePageComponent implements OnInit {
  wave?: WaveSurfer;
  voices: any[] = [];
  selected = 'voice_1';
  text = '';
  blob?: Blob;
  blobUrl?: string;
  audioId?: number;

  constructor(
    private uploadAudio: UploadAudioUseCase,
    private cloneVoice: CloneVoiceUseCase,
    private tts: TTSHttp
  ) {}

  async ngOnInit() {
    this.wave = WaveSurfer.create({
      container: '#wave',
      height: 100,
      waveColor: '#a3bffa',
      progressColor: '#0ea5a4'
    });
    this.voices = await this.tts.listVoices();
  }

  async onFileChange(ev: any) {
    const f: File = ev.target.files[0];
    if (!f) return;
    this.blob = f;
    this.loadBlob(f);
  }

  loadBlob(blob: Blob) {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = URL.createObjectURL(blob);
    this.wave?.load(this.blobUrl);
  }

  async saveAudio() {
    if (!this.blob) return;
    const res = await this.uploadAudio.execute(this.blob as File);
    this.audioId = res.id;
  }

  async cloneNow() {
    const out = await this.cloneVoice.execute({
      voice_id: this.selected,
      text: this.text,
      audio_id: this.audioId,
      file: this.audioId ? undefined : this.blob
    });
    const url = URL.createObjectURL(out);
    const audio = new Audio(url);
    audio.controls = true;
    document.getElementById('output')!.replaceChildren(audio);
  }
}
