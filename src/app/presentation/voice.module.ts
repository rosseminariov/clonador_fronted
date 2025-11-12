// src/app/presentation/voice-page/voice.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VoicePageComponent } from './voice-page/voice-page.component';
  declarations: [VoicePageComponent],
  imports: [CommonModule, FormsModule],
  exports: [VoicePageComponent]   // 👈 exporta el componente
})
export class VoiceModule {}
