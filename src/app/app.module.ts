import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

// Importar Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator } from '@angular/fire/firestore';

import { environment } from '../environments/environment';  // Importar el environment

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAuth } from '@angular/fire/auth';
import { getAuth,connectAuthEmulator } from 'firebase/auth';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ProductosComponent } from './pages/productos/productos.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NavbarComponent,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() =>{
      const auth = getAuth();
      //connectAuthEmulator(auth,'http://localhost:9099',{disableWarnings: true});
      return auth;
    } ),
    provideFirestore(() =>{
      const firestore = getFirestore();
      //connectFirestoreEmulator(firestore,'http://localhost', 9098)
      return firestore
    }),
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}

