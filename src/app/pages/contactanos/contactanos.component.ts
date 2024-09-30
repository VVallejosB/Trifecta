import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactFormData } from '../models/servicio.models';
import { AuthService } from '../users/services/auth.service';
import { Auth } from '@angular/fire/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.scss']
})
export class ContactanosComponent implements OnInit {
  contactForm!: FormGroup;
  imageBase64!: string;
  
  constructor(private fb: FormBuilder, private contactoService:AuthService, private auth:Auth) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      image: [null],
      fechaEnvio:[],
      usuario:[]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  getUserEmail(): string {
    const user = this.auth.currentUser;
    return user ? user.email! : 'Anonimo';
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      const formData: ContactFormData = {
        title: this.contactForm.value.title,
        message: this.contactForm.value.message,
        image: this.imageBase64,
        fechaEnvio: new Date(), // Fecha de envío actual
        usuario: this.getUserEmail() // Email del usuario autenticado o "Anonimo"
      };
  
      try {
        await this.contactoService.enviarFormularioContacto(formData);
        console.log('Formulario enviado correctamente a Firestore');
  
        // Mostrar alerta de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Enviado!',
          text: 'Tu formulario ha sido enviado con éxito.',
          confirmButtonText: 'OK'
        });
  
        // Resetea el formulario
        this.contactForm.reset();
        this.imageBase64 = ''; // Resetear también la imagen a su estado inicial
        
      } catch (error) {
        console.error('Error al enviar el formulario a Firestore:', error);
        
        // Mostrar alerta de error con SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el formulario. Inténtalo nuevamente.',
          confirmButtonText: 'OK'
        });
      }
    }
  }
  
  
}
