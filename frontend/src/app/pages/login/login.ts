import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';
  mensajeError: string = '';

  constructor(private router: Router) {}

  iniciarSesion(): void {

    if (
      this.email === 'admin@easystock.com' &&
      this.password === 'admin1234'
    ) {

      this.mensajeError = '';
      this.router.navigate(['/admin/dashboard']);

    } else if (
      this.email === 'user@easystock.com' &&
      this.password === 'user1234'
    ) {

      this.mensajeError = '';
      this.router.navigate(['/dashboard/user']);

    } else {

      this.mensajeError = 'Usuario no registrado o contraseña incorrecta.';

    }

  }

}