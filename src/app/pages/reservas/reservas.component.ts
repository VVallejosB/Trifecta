import { Component, ChangeDetectionStrategy } from '@angular/core';
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

  // Definir locale para formato en español
  locale = es;

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }

  prevMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  getFormattedDate(): string {
    return format(this.viewDate, 'MMMM yyyy', { locale: this.locale });
  }

  // Método cuando se selecciona un día
  onDayClicked(event: { day: CalendarMonthViewDay }): void {
    if (this.selectedDate && this.selectedDate.getTime() === event.day.date.getTime()) {
      this.selectedDate = null;
    } else {
      this.selectedDate = event.day.date;
    }
  }

  // Método para agregar una clase CSS al día seleccionado
  // Método para agregar una clase CSS al día seleccionado
  isDaySelected(day: CalendarMonthViewDay): boolean {
    return !!this.selectedDate && this.selectedDate.getTime() === day.date.getTime();
  }


  onHorarioSelected(horario: string): void {
    this.selectedHorario = horario;
  }

  realizarPago(): void {
    if (this.selectedDate && this.selectedHorario) {
      console.log(`Reserva para el ${this.selectedDate} en el horario ${this.selectedHorario}`);
    }
  }
}
