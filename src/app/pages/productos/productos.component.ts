import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.models';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from '@angular/fire/firestore'
import { AuthService } from '../users/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  constructor(private servicioService: AuthService,private fb: FormBuilder) {


  }

  ngOnInit(): void {
    this.servicioForm = this.fb.group({
      tipoServicio: ['', [Validators.required]],
      valor: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      horas:[0,[Validators.required]]
    });

    // Cargar los servicios desde Firestore
    this.servicioService.getServicios().subscribe((data: Servicio[]) => {
      this.servicios = data;
    });
  }
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
  eliminarServicio(id: string | undefined): void {
    if (id) {
      this.servicioService.deleteServicio(id).then(() => {
        console.log('Servicio eliminado');
        // Actualiza la lista de servicios si es necesario
      }).catch((error) => {
        console.error('Error al eliminar el servicio:', error);
      });
    } else {
      console.error('No se puede eliminar el servicio: ID indefinido');
    }
  }




  cargarServicioParaEditar(servicio: Servicio): void {
    this.servicioSeleccionado = servicio; // Guardar el servicio seleccionado

    // Rellenar el formulario con los datos del servicio seleccionado
    this.servicioForm.patchValue({
      tipoServicio: servicio.tipoServicio,
      valor: servicio.valor,
      descripcion: servicio.descripcion,
      imagen:servicio.imagen,
      horas:servicio.horas
    });
  }

  agregarServicio(): void {
    if (this.servicioForm.valid && this.imagenBase64) {
      // Crear el objeto del servicio con la imagen en base64
      const nuevoServicio: Servicio = {
        tipoServicio: this.servicioForm.get('tipoServicio')?.value,
        valor: this.servicioForm.get('valor')?.value,
        descripcion: this.servicioForm.get('descripcion')?.value,
        imagen: this.imagenBase64, // Usar la imagen en formato base64
        horas:this.servicioForm.get('horas')?.value
      };

      if (this.servicioSeleccionado) {
        // Si hay un servicio seleccionado, actualizar
        this.servicioService.updateServicio(this.servicioSeleccionado.id!, nuevoServicio).then(() => {
          console.log('Servicio actualizado exitosamente');
          this.servicioSeleccionado = null;
          this.servicioForm.reset(); // Limpiar el formulario
          this.imagenBase64 = null; // Limpiar la imagen
        });
      } else {
        // Si no hay un servicio seleccionado, agregar uno nuevo
        this.servicioService.addServicio(nuevoServicio).then(() => {
          console.log('Servicio agregado exitosamente');
          this.servicioForm.reset(); // Limpiar el formulario después de agregar
          this.imagenBase64 = null; // Limpiar la imagen
        });
      }
    }
  }
}
