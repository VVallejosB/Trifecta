import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.models';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { AuthService } from '../users/services/auth.service';  // Asegúrate de que la ruta es correcta
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Importar Router para la redirección

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  servicios: Servicio[] = [];
  servicioForm!: FormGroup;
  servicioSeleccionado!: Servicio | null;
  imagenBase64!: string | null;

  constructor(
    private servicioService: AuthService,
    private fb: FormBuilder,
    private router: Router  // Inyectar Router para la redirección
  ) {}

  ngOnInit(): void {
    this.servicioForm = this.fb.group({
      tipoServicio: ['', [Validators.required]],
      valor: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      horas: [0, [Validators.required]]
    });

    // Cargar los servicios desde Firestore
    this.servicioService.getServicios().subscribe((data: Servicio[]) => {
      this.servicios = data;
    });
  }

  // Manejar la selección de archivos (imagen)
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenBase64 = reader.result as string; // Almacenar la imagen como base64
      };
      reader.readAsDataURL(file); // Convertir la imagen a base64
    }
  }

  // Eliminar un servicio
  eliminarServicio(id: string | undefined): void {
    if (id) {
      this.servicioService.deleteServicio(id).then(() => {
        console.log('Servicio eliminado');
      }).catch((error) => {
        console.error('Error al eliminar el servicio:', error);
      });
    } else {
      console.error('No se puede eliminar el servicio: ID indefinido');
    }
  }

  // Cargar servicio para editar
  cargarServicioParaEditar(servicio: Servicio): void {
    this.servicioSeleccionado = servicio; // Guardar el servicio seleccionado

    // Rellenar el formulario con los datos del servicio seleccionado
    this.servicioForm.patchValue({
      tipoServicio: servicio.tipoServicio,
      valor: servicio.valor,
      descripcion: servicio.descripcion,
      imagen: servicio.imagen,
      horas: servicio.horas
    });
  }

  // Agregar o actualizar un servicio
  agregarServicio(): void {
    if (this.servicioForm.valid && this.imagenBase64) {
      const nuevoServicio: Servicio = {
        tipoServicio: this.servicioForm.get('tipoServicio')?.value,
        valor: this.servicioForm.get('valor')?.value,
        descripcion: this.servicioForm.get('descripcion')?.value,
        imagen: this.imagenBase64, // Usar la imagen en formato base64
        horas: this.servicioForm.get('horas')?.value
      };

      if (this.servicioSeleccionado) {
        this.servicioService.updateServicio(this.servicioSeleccionado.id!, nuevoServicio).then(() => {
          console.log('Servicio actualizado exitosamente');
          this.servicioSeleccionado = null;
          this.servicioForm.reset();
          this.imagenBase64 = null;
        });
      } else {
        this.servicioService.addServicio(nuevoServicio).then(() => {
          console.log('Servicio agregado exitosamente');
          this.servicioForm.reset();
          this.imagenBase64 = null;
        });
      }
    }
  }

  // Redirigir al calendario con el servicio seleccionado
  verCalendario(servicio: Servicio): void {
    // Redirige a la ruta de reservas con el id del servicio
    this.router.navigate(['/reservas', servicio.id]);  // Pasa el ID del servicio como parámetro de la ruta
  }
}


