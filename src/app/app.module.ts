import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

// Importar Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../environments/environment';  // Importar el environment

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';  // Corregido para importar getAuth y provideAuth correctamente
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FormsModule } from '@angular/forms'; // Si también vas a usar formularios reactivos
import { ReactiveFormsModule } from '@angular/forms';

// Importaciones necesarias para angular-calendar
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ReservasComponent } from './pages/reservas/reservas.component';


@NgModule({
  declarations: [AppComponent, ReservasComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),  // Inicialización de Firebase
    provideAuth(() => {
      const auth = getAuth();  // Configuración de autenticación
      // connectAuthEmulator(auth,'http://localhost:9099',{disableWarnings: true}); // Si quieres usar emulador de Firebase Auth
      return auth;
    }),
    provideFirestore(() => {
      const firestore = getFirestore();
      // connectFirestoreEmulator(firestore, 'localhost', 9098); // Si quieres usar emulador de Firestore
      return firestore;
    }),
    // Integración del calendario angular
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}

