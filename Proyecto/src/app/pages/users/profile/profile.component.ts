import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta según sea necesario
import { ProfileService } from './profile.service'; // Ajusta la ruta según sea necesario
import { User } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private profileService: ProfileService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      profileCompleted:[true]
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
            // Mostrar una alerta de éxito con SweetAlert2
            Swal.fire({
              title: 'Éxito',
              text: 'Perfil guardado con éxito.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            this.router.navigate(['/home']);
          })
          .catch(error => {
            // Mostrar una alerta de error con SweetAlert2
            Swal.fire({
              title: 'Error',
              text: 'Hubo un error al guardar el perfil. Inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error('Error al guardar el perfil:', error);
          });
      } else {
        // Mostrar una alerta de advertencia si el formulario es inválido o el usuario no está autenticado
        Swal.fire({
          title: 'Advertencia',
          text: 'Formulario inválido o usuario no autenticado.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        console.log('Formulario inválido o usuario no autenticado');

      }
    });
  }
}
