import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { CalendarEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';
import { addMonths, subMonths, format } from 'date-fns';
import { Subject } from 'rxjs';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservasComponent {
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  selectedDate: Date | null = null;
  selectedHorario: string | null = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  horarios: string[] = ['10:00 - 13:00', '13:00 - 16:00', '16:00 - 19:00'];
  locale = es;

  // Inyectar el HttpClient en el constructor
  constructor(private http: HttpClient) {}

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  prevMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  getFormattedDate(): string {
    return format(this.viewDate, 'MMMM yyyy', { locale: this.locale });
  }

  onDayClicked(event: { day: CalendarMonthViewDay }): void {
    if (this.selectedDate && this.selectedDate.getTime() === event.day.date.getTime()) {
      this.selectedDate = null;
    } else {
      this.selectedDate = event.day.date;
    }
  }

  isDaySelected(day: CalendarMonthViewDay): boolean {
    return !!this.selectedDate && this.selectedDate.getTime() === day.date.getTime();
  }

  onHorarioSelected(horario: string): void {
    this.selectedHorario = horario;
  }

  // Redirigir al pago con Transbank
  realizarPago(): void {
    if (this.selectedDate && this.selectedHorario) {
      // Realiza una petición POST al backend para iniciar la transacción
      this.http.post<any>('http://localhost:5000/iniciar-transaccion', {
        fecha: this.selectedDate,
        horario: this.selectedHorario
      }).subscribe((response: any) => {
        // Redirigir al usuario a la URL proporcionada por Transbank con el token
        window.location.href = `${response.url}?token_ws=${response.token}`;
      }, (error) => {
        console.error('Error al iniciar la transacción:', error);
        alert('Hubo un problema al iniciar la transacción.');
      });
    } else {
      alert('Por favor seleccione una fecha y un horario antes de proceder al pago.');
    }
  }
}
