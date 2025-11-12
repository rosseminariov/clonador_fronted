import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import WaveSurfer from 'wavesurfer.js';

// Angular Material (UI)
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { UploadAudioUseCase } from '../../application/voice/upload-audio.usecase';
import { CloneVoiceUseCase } from '../../application/voice/clone-voice.usecase';
import { TTSPort } from '../../domain/ports/tts.port';

@Component({
  selector: 'app-voice-page',
  standalone: true,
  // 👇 IMPORTA aquí TODOS los módulos que usas en el HTML
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
  ],
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

  uploading = false;
  cloning = false;

  constructor(
    private uploadAudio: UploadAudioUseCase,
    private cloneVoice: CloneVoiceUseCase,
    private tts: TTSPort,
    private snack: MatSnackBar
  ) {}

  async ngOnInit() {
    this.wave = WaveSurfer.create({
      container: '#wave',
      height: 100,
      waveColor: '#93c5fd',
      progressColor: '#0ea5a4',
      cursorColor: '#0f172a'
    });
    this.voices = await this.tts.listVoices();
  }

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    this.blob = f;
    this.loadBlob(f);
  }

  private loadBlob(b: Blob) {
    if (this.blobUrl) URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = URL.createObjectURL(b);
    this.wave?.load(this.blobUrl);
  }

  async saveAudio() {
    if (!this.blob) return;
    try {
      this.uploading = true;
      const res = await this.uploadAudio.execute(this.blob as File);
      this.audioId = res.id;
      this.snack.open(`Audio guardado (ID ${res.id})`, 'OK', { duration: 2500 });
    } catch {
      this.snack.open('Error al guardar audio', 'Cerrar', { duration: 3000 });
    } finally {
      this.uploading = false;
    }
  }

  async cloneNow() {
    try {
      this.cloning = true;
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
      this.snack.open('Voz clonada ✅', 'Reproducir', { duration: 2500 });
    } catch {
      this.snack.open('Error en clonación', 'Cerrar', { duration: 3000 });
    } finally {
      this.cloning = false;
    }
  }
}
