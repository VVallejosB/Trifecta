import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según sea necesario
import { ProfileService } from './profile.service'; // Ajusta la ruta según sea necesario
import { User } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user$: Observable<User | null> = of(null); // Inicializa con un valor predeterminado
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  ngOnInit(): void {
    this.user$ = this.authService.userState$; // Obtén el observable del estado del usuario

    this.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.profileService.getProfile(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe(profile => {
      if (profile) {
        this.profileForm.patchValue(profile);
      }
    });
  }

  onSubmit(): void {
    this.user$.subscribe(user => {
      if (user && this.profileForm.valid) {
        this.profileService.updateProfile(user.uid, this.profileForm.value)
          .then(() => {
            this.successMessage = 'Perfil guardado con éxito.';
          })
          .catch(error => {
            console.error('Error al guardar el perfil:', error);
          });
      } else {
        console.log('Formulario inválido o usuario no autenticado');
      }
    });
  }
}
