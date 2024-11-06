import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient } from '@angular/common/http';
import {metaReducers} from './store+/meta.reducer';
import {reducers} from './store+';
import {MainPageEffects} from './main-page/store/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers, { metaReducers }),
    provideEffects(),
    provideEffects(
      MainPageEffects
    ),
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
      connectInZone: true,
    }),
  ],
};
