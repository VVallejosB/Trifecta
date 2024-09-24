import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { onlyLoggedInGuard } from './shared/guards/only-logged-in.guard';
import { ReservasComponent } from './pages/reservas/reservas.component';  // Importar el componente de reservas

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'user/sign-up',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/users/sign-up/sign-up.module').then(
        (m) => m.SignUpModule
      ),
  },
  {
    path: 'user/sign-in',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./pages/users/sign-in/sign-in.module').then(
        (m) => m.SignInModule
      ),
  },
  {
    path: 'user/profile',
    canActivate: [onlyLoggedInGuard],
    loadChildren: () =>
      import('./pages/users/profile/profile.module').then(
        (m) => m.ProfileModule
      ),
  },
  {
    path: 'user/email-verification',
    loadChildren: () =>
      import('./pages/users/email-verification/email-verification.module').then(
        (m) => m.EmailVerificationModule
      ),
  },
  {
    path: 'user/forgot-password',
    loadChildren: () =>
      import('./pages/users/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('./pages/productos/productos.module').then((m) => m.ProductosModule),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },

  {
    path: 'reservas/:id',  // Modificar la ruta para aceptar el id del servicio
    component: ReservasComponent,
  },
  {
    path: '**',  // Manejar rutas no encontradas (404)
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
