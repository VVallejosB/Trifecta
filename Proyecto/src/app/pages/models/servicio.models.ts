export interface Servicio {
  id?: string;
  tipoServicio: string;
  valor: number;
  descripcion: string;
  imagen: string;  // Imagen del servicio
  horas: number;   // Duración en horas
}

export interface Reservas {
  id: string;
  userId: string;
  fecha: Date;
  servicio: Servicio;  // Ahora relacionado correctamente con la interfaz Servicio
}
export interface ContactFormData {
  title: string;
  message: string;
  image?: string; // La imagen es opcional
  fechaEnvio: Date; // Fecha de envío del formulario, obligatoria
  usuario: string;  // Usuario que envió el formulario, obligatorio
}



