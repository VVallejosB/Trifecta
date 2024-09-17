import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators'; // Asegúrate de importar catchError

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private db: Firestore = inject(Firestore);
  private dbPath = 'profiles'; // Ruta en Firestore

  constructor() { }

  // Obtener el perfil de usuario desde Firestore
  getProfile(id: string): Observable<any> {
    const profileRef = doc(this.db, `${this.dbPath}/${id}`); // Usar backticks para la interpolación correcta de strings
    return from(getDoc(profileRef)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.data() : null),
      catchError(error => {
        console.error('Error fetching profile:', error);
        return of(null); // Devuelve un valor predeterminado o lanza el error nuevamente
      })
    );
  }

  // Actualizar el perfil del usuario en Firestore
  updateProfile(id: string, profileData: any): Promise<void> {
    const profileRef = doc(this.db, `${this.dbPath}/${id}`); // Usar backticks para la interpolación correcta de strings
    return setDoc(profileRef, profileData, { merge: true }) // merge para evitar sobrescribir todo
      .catch(error => {
        console.error('Error updating profile:', error);
        throw error; // Relanzar el error para manejarlo en otro lugar
      });
  }
}
