import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/users/services/auth.service';  // Servicio de autenticación
import { Servicio } from 'src/app/pages/models/servicio.models';  // Modelo de Servicio
import { User } from '@angular/fire/auth';  // Tipo de Usuario de Firebase
import { addMonths, subMonths, format } from 'date-fns';  // Para la manipulación de fechas
import { CalendarEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';  // Para el calendario
import { Subject } from 'rxjs';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  selectedDate: Date | null = null;  // Fecha seleccionada
  selectedHorario: string | null = null;  // Horario seleccionado
  servicioSeleccionado: Servicio | null = null;  // Servicio seleccionado
  userId: string | null = null;  // ID del usuario autenticado
  viewDate: Date = new Date();  // Fecha actual del calendario
  eventos: CalendarEvent[] = [];  // Lista de eventos del calendario
  refresh: any = new Subject();  // Control para refrescar el calendario
  horarios: string[] = ['10:00 - 13:00', '13:00 - 16:00', '16:00 - 19:00'];  // Horarios disponibles

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService  // Servicio de autenticación
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    this.authService.getUser().subscribe((user: User | null) => {
      if (user) {
        this.userId = user.uid;  // Asignar el UID del usuario autenticado
      } else {
        // Redirigir al login si no hay un usuario autenticado
        alert('Debes iniciar sesión para realizar una reserva.');
        this.router.navigate(['/login']);
      }
    });

    // Cargar los detalles del servicio
    this.cargarServicioSeleccionado();
  }

  cargarServicioSeleccionado(): void {
    // Aquí puedes obtener y asignar el servicio seleccionado desde tu base de datos o lógica de negocio
    this.servicioSeleccionado = {
      id: 'F6RuoHFhXvtggI0pZEBj',
      tipoServicio: 'Promoción 3',
      valor: 50000,  // Precio del servicio
      descripcion: 'Servicio de promoción especial',
      imagen: '',  // Imagen del servicio, si es necesario
      horas: 3  // Duración en horas del servicio
    };
  }

  // Método para avanzar al siguiente mes en el calendario
  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  // Método para retroceder al mes anterior en el calendario
  prevMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  // Método para obtener la fecha formateada
  getFormattedDate(): string {
    return format(this.viewDate, 'MMMM yyyy');
  }

  // Método para seleccionar un día en el calendario
  onDayClicked(event: { day: CalendarMonthViewDay }): void {
    if (this.selectedDate && this.selectedDate.getTime() === event.day.date.getTime()) {
      this.selectedDate = null;
    } else {
      this.selectedDate = event.day.date;
    }
  }

  // Método para verificar si el día está seleccionado
  isDaySelected(day: CalendarMonthViewDay): boolean {
    return !!this.selectedDate && this.selectedDate.getTime() === day.date.getTime();
  }

  // Método para seleccionar un horario
  onHorarioSelected(horario: string): void {
    this.selectedHorario = horario;
  }

  // Método para proceder al pago
  procederAlPago(): void {
    if (this.selectedDate && this.selectedHorario && this.servicioSeleccionado && this.userId) {
      // Iniciar la transacción llamando a la API del backend
      const transaccionData = {
        buy_order: `orden_compra_${this.servicioSeleccionado.id}`,  // Generar la orden de compra
        session_id: `sesion_${this.userId}`,  // Sesión del usuario
        amount: this.servicioSeleccionado.valor,  // Precio del servicio
        return_url: 'http://127.0.0.1:8900/api/v1/transbank/transaction/commit'  // URL de retorno tras el pago
      };

      this.http.post<any>('http://127.0.0.1:8900/api/v1/transbank/transaction/create', transaccionData)
        .subscribe({
          next: (response: any) => {
            // Manejo de respuesta exitosa
            window.location.href = `${response.url}?token_ws=${response.token}`;
          },
          error: (error) => {
            // Manejo de error
            console.error('Error al iniciar la transacción:', error);
            alert('Hubo un problema al iniciar la transacción.');
          },
          complete: () => {
            // Lógica opcional para cuando el observable se completa
            console.log('Transacción completada');
          }
        });
    } else {
      alert('Por favor, selecciona una fecha, un horario y asegúrate de estar logueado antes de proceder al pago.');
    }
  }

}
