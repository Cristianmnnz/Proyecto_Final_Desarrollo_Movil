import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { AppRoutingModule  } from '../../appRegistro/src/app/app-routing.module'; // <-- tus rutas standalone
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular(),
    importProvidersFrom(AppRoutingModule),
    provideHttpClient(),

    // Estrategia de rutas recomendada por Ionic
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
});
