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

@Component({
  selector: 'app-voice-page',
  standalone: true,
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
  styleUrls: ['./voice-page.component.css'],
})
export class VoicePageComponent implements OnInit {
  wave?: WaveSurfer;

  // texto y parámetros de síntesis
  text = 'Hola, soy un clon de tu voz usando inteligencia artificial.';
  lang = 'es';
  speed = 1.0;

  // archivo subido y preview
  blob?: Blob;
  blobUrl?: string;

  // voice_id que devuelve el backend al entrenar
  voiceId?: string;

  // estados de carga
  uploading = false;
  cloning = false;

  constructor(
    private uploadAudio: UploadAudioUseCase,
    private cloneVoice: CloneVoiceUseCase,
    private snack: MatSnackBar
  ) {}

  async ngOnInit() {
    this.wave = WaveSurfer.create({
      container: '#wave',
      height: 100,
      waveColor: '#93c5fd',
      progressColor: '#0ea5a4',
      cursorColor: '#0f172a',
    });
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
    if (!this.blob) {
      this.snack.open('Primero selecciona un archivo de audio', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    try {
      this.uploading = true;
      const res = await this.uploadAudio.execute(this.blob as File);
      this.voiceId = res.voice_id;

      this.snack.open(
        `Voz entrenada correctamente (voice_id: ${this.voiceId})`,
        'OK',
        { duration: 3000 }
      );
    } catch (e) {
      console.error(e);
      this.snack.open('Error al entrenar la voz', 'Cerrar', { duration: 3000 });
    } finally {
      this.uploading = false;
    }
  }

  async cloneNow() {
    if (!this.voiceId) {
      this.snack.open('Primero entrena una voz con tu audio', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    if (!this.text || !this.text.trim()) {
      this.snack.open('Escribe un texto para sintetizar', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    try {
      this.cloning = true;
      const out = await this.cloneVoice.execute({
        voice_id: this.voiceId,
        text: this.text,
        lang: this.lang,
        speed: this.speed,
      });

      const url = URL.createObjectURL(out);
      const audio = new Audio(url);
      audio.controls = true;
      document.getElementById('output')!.replaceChildren(audio);

      this.snack.open('Voz clonada ✅', 'Reproducir', { duration: 2500 });
    } catch (e) {
      console.error(e);
      this.snack.open('Error en clonación', 'Cerrar', { duration: 3000 });
    } finally {
      this.cloning = false;
    }
  }
}
