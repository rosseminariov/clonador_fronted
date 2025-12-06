// src/app/presentation/voice-page/voice-page.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UploadAudioUseCase } from '../../application/voice/upload-audio.usecase';
import { CloneVoiceUseCase } from '../../application/voice/clone-voice.usecase';

interface HistoryItem {
  id: number;
  name: string;
  duration: string;
  format: string;
  url: string;
  editing: boolean;
}

@Component({
  selector: 'app-voice-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './voice-page.component.html',
  styleUrls: ['./voice-page.component.css'],
})
export class VoicePageComponent {
  // texto y parámetros de síntesis
  text = '';
  lang = 'es';
  speed = 1.0;

  // archivo subido
  blob?: File;
  selectedFileName = '';
  voiceId?: string;

  // estados
  uploading = false;
  cloning = false;
  isDragOver = false;

  // historial
  history: HistoryItem[] = [];
  private historyCounter = 1;
  searchTerm = '';

  // toast simple
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';
  toastVisible = false;
  private toastTimeout?: any;

  constructor(
    private uploadAudio: UploadAudioUseCase,
    private cloneVoice: CloneVoiceUseCase
  ) {}

  // ======== GETTERS ========

  get hasAudio(): boolean {
    return !!this.blob;
  }

  // ======== DRAG & DROP ========

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(ev: DragEvent) {
    ev.preventDefault();
    this.isDragOver = false;
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.isDragOver = false;

    const file = ev.dataTransfer?.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      this.showToast('Solo se permiten archivos de audio', 'error');
      return;
    }

    this.setFile(file);
  }

  // ======== INPUT FILE ========

  onFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      this.showToast('Solo se permiten archivos de audio', 'error');
      return;
    }

    this.setFile(file);
  }

  private setFile(file: File) {
    this.blob = file;
    this.selectedFileName = file.name;
    this.showToast('Audio cargado correctamente', 'success');
  }

  // ======== GUARDAR / ENTRENAR VOZ ========

  async saveAudio() {
    if (!this.blob) {
      this.showToast('Primero sube un archivo de audio', 'error');
      return;
    }

    try {
      this.uploading = true;
      const res = await this.uploadAudio.execute(this.blob);
      this.voiceId = res.voice_id;
      this.showToast('Voz entrenada correctamente ✅', 'success');
    } catch (e) {
      console.error(e);
      this.showToast('Error al entrenar la voz', 'error');
    } finally {
      this.uploading = false;
    }
  }

  // ======== CLONAR VOZ ========

  async cloneNow() {
    if (!this.voiceId) {
      this.showToast('Primero guarda el audio para entrenar la voz', 'error');
      return;
    }

    if (!this.text || !this.text.trim()) {
      this.showToast('Escribe un texto para sintetizar', 'error');
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

      // Reproductor en la parte superior (como preview rápido)
      const audio = new Audio(url);
      audio.controls = true;
      const output = document.getElementById('output');
      if (output) {
        output.replaceChildren(audio);
      }

      // calcular duración aproximada
      const duration = await this.computeDuration(out);

      // agregar al historial
      const defaultName = `Audio clonado ${this.historyCounter++}`;
      this.history.unshift({
        id: Date.now(),
        name: defaultName,
        duration,
        format: 'mp3', // ajusta si tu backend genera otro formato
        url,
        editing: false,
      });

      this.showToast('Voz clonada y guardada en el historial ✅', 'success');
    } catch (e) {
      console.error(e);
      this.showToast('Error al clonar la voz', 'error');
    } finally {
      this.cloning = false;
    }
  }

  private computeDuration(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.src = URL.createObjectURL(blob);
      audio.addEventListener('loadedmetadata', () => {
        const seconds = Math.floor(audio.duration || 0);
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        resolve(`${m}m ${s}s`);
      });
      audio.addEventListener('error', () => resolve('—'));
    });
  }

  // ======== HISTORIAL / BÚSQUEDA ========

  filteredHistory(): HistoryItem[] {
    if (!this.searchTerm.trim()) return this.history;
    const term = this.searchTerm.toLowerCase();
    return this.history.filter((h) => h.name.toLowerCase().includes(term));
  }

  enableEdit(item: HistoryItem) {
    item.editing = true;
  }

  finishEdit(item: HistoryItem) {
    item.editing = false;
    if (!item.name.trim()) {
      item.name = 'Audio sin nombre';
    }
  }

  // ======== TOAST SIMPLE ========

  showToast(
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  } 
    // 🌙 Alternar modo oscuro
  toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle('dark');

    // Guarda preferencia en localStorage
    if (html.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  }
}

