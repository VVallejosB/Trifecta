import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, User } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Servicio, Reservas } from '../../models/servicio.models';  // Se asegura que el modelo Reservas incluye Servicio
import { collectionData, docData } from '@angular/fire/firestore';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

interface ErrorResponse {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly googleProvider = new GoogleAuthProvider();

  constructor(private firestore: Firestore) {}

  get userState$(): Observable<User | null> {
    return authState(this.auth);
  }

  getUser() {
    return authState(this.auth);
  }

  async signInGoogle(): Promise<void> {
    try {
      await signInWithPopup(this.auth, this.googleProvider);
      this.router.navigate(['/user/profile']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }

  async signInWithRedirect(): Promise<void> {
    try {
      await signInWithRedirect(this.auth, this.googleProvider);
    } catch (error) {
      console.error('Google login redirect error:', error);
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.sendEmailVerification(user);
      this.router.navigate(['/user/email-verification']);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.error('SignUp Error - Code:', code, 'Message:', message);
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      this.checkUserIsVerified(user);
    } catch (error: unknown) {
      const { code, message } = error as ErrorResponse;
      console.error('SignIn Error - Code:', code, 'Message:', message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      this.router.navigate(['/']);
    } catch (error: unknown) {
      console.error('SignOut Error:', error);
    }
  }

  async sendEmailVerification(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
    } catch (error: unknown) {
      console.error('Send Email Verification Error:', error);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: unknown) {
      console.error('Send Password Reset Email Error:', error);
    }
  }

  private checkUserIsVerified(user: User): void {
    const route = user.emailVerified ? '/user/profile' : '/user/email-verification';
    this.router.navigate([route]);
  }

  // Métodos para manejar servicios-productos

  getServicios(): Observable<Servicio[]> {
    const serviciosRef = collection(this.firestore, 'servicios');
    return collectionData(serviciosRef, { idField: 'id' }) as Observable<Servicio[]>;
  }

  async deleteServicio(id: string): Promise<void> {
    const servicioRef = doc(this.firestore, `servicios/${id}`);
    try {
      await deleteDoc(servicioRef);
      console.log('Servicio eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar el servicio: ', error);
    }
  }

  async addServicio(servicio: Omit<Servicio, 'id'>): Promise<void> {
    const servicioRef = collection(this.firestore, 'servicios');
    await addDoc(servicioRef, servicio);
  }

  async updateServicio(id: string, servicio: Omit<Servicio, 'id'>): Promise<void> {
    const servicioDocRef = doc(this.firestore, `servicios/${id}`);
    await updateDoc(servicioDocRef, { ...servicio });
  }

  // Métodos para manejar reservas

  async crearReserva(reserva: Omit<Reservas, 'id'>): Promise<void> {
    const reservaRef = collection(this.firestore, 'reservas');
    try {
      await addDoc(reservaRef, reserva);
      console.log('Reserva creada con éxito');
    } catch (error) {
      console.error('Error al crear la reserva: ', error);
    }
  }

  getReservas(): Observable<Reservas[]> {
    const reservasRef = collection(this.firestore, 'reservas');
    return collectionData(reservasRef, { idField: 'id' }) as Observable<Reservas[]>;
  }

  getReservasPorUsuario(userId: string): Observable<Reservas[]> {
    const reservasRef = collection(this.firestore, 'reservas');
    const q = query(reservasRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Reservas[]>;
  }
}

