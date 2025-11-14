import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';          // 👈 necesario para *ngIf

// importa tu página principal
import { VoicePageComponent } from './presentation/voice-page/voice-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 👇 aquí declaramos los módulos/comps que el template usa
  imports: [
    CommonModule,       // ✅ para *ngIf, *ngFor, etc.
    VoicePageComponent  // ✅ tu página principal
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Clonador de Voz';
  showSplash = true;

  ngOnInit(): void {
    // Splash sencillo: visible ~3 segundos
    setTimeout(() => {
      this.showSplash = false;
    }, 3000);
  }
}
