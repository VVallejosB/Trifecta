import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/pages/users/services/auth.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import Swal from 'sweetalert2';

const b = Swal.getHtmlContainer()?.querySelector('b');

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  user$:Observable<User | null>;
  menuVisible: boolean = false;
  private readonly authSvc = inject(AuthService);

  constructor(router: Router){
    this.user$ = this.authSvc.userState$;

  }
    async onSignOut(): Promise <void> {
      await this.authSvc.signOut();
      window.location.href='/home'
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
}

