import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc } from '@angular/fire/firestore';
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

  getProfile(id: string): Observable<any> {
    const profileRef = doc(this.db, `${this.dbPath}/${id}`);
    return from(getDoc(profileRef)).pipe(
      map(snapshot => snapshot.exists() ? snapshot.data() : null),
      catchError(error => {
        console.error('Error fetching profile:', error);
        return of(null); // Return a fallback value or rethrow the error
      })
    );
  }

  updateProfile(id: string, profileData: any): Promise<void> {
    const profileRef = doc(this.db, `${this.dbPath}/${id}`);
    return setDoc(profileRef, profileData)
      .catch(error => {
        console.error('Error updating profile:', error);
        throw error; // Rethrow the error to be handled elsewhere
      });
  }
}
