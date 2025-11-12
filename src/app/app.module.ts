import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

// Config
import { APP_CONFIG, DEFAULT_APP_CONFIG } from './core/config/app-config';

// Puertos (interfaces)
import { AudioRepoPort } from './domain/ports/audio-repo.port';
import { TTSPort } from './domain/ports/tts.port';

// Implementaciones (HTTP)
import { AudioRepoHttp } from './infrastructure/repositories/audio-repo.http';
import { TTSHttp } from './infrastructure/repositories/tts.http';

// Importa el módulo de la página
import { VoiceModule } from './presentation/voice.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    VoiceModule         // 👈 recuerda cerrar con coma el elemento anterior
  ],
  providers: [
    { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG },
    { provide: AudioRepoPort, useClass: AudioRepoHttp },
    { provide: TTSPort, useClass: TTSHttp }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
