import { Routes } from '@angular/router';
import { VoicePageComponent } from './presentation/voice-page/voice-page.component';

export const routes: Routes = [
  { path: '', component: VoicePageComponent },
  { path: 'clonador', component: VoicePageComponent },
  { path: '**', redirectTo: '' }
];
