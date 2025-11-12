import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Config global
import { APP_CONFIG, DEFAULT_APP_CONFIG } from './core/config/app-config';

// Puertos
import { AudioRepoPort } from './domain/ports/audio-repo.port';
import { TTSPort } from './domain/ports/tts.port';

// Implementaciones HTTP
import { AudioRepoHttp } from './infrastructure/repositories/audio-repo.http';
import { TTSHttp } from './infrastructure/repositories/tts.http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      FormsModule,
      MatButtonModule, MatIconModule,
      MatFormFieldModule, MatInputModule, MatSelectModule,
      MatSnackBarModule, MatProgressBarModule, MatProgressSpinnerModule,
      MatSlideToggleModule
    ),
    { provide: APP_CONFIG, useValue: DEFAULT_APP_CONFIG },
    { provide: AudioRepoPort, useClass: AudioRepoHttp },
    { provide: TTSPort, useClass: TTSHttp }
  ]
};
