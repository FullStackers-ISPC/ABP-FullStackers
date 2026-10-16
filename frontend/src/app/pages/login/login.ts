import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        Validators.required
      ]
    });

  }

  iniciarSesion(): void {

    this.mensajeError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } =
      this.loginForm.getRawValue();

    this.cargando = true;

    this.authService
      .login(email, password)
      .subscribe({

        next: (usuarios) => {

          this.cargando = false;

          if (usuarios.length === 0) {
            this.mensajeError =
              'Usuario no registrado o contraseña incorrecta.';
            return;
          }

          const usuario = usuarios[0];

          if (usuario.rol === 'admin') {

            this.router.navigate([
              '/admin/dashboard'
            ]);

          } else if (usuario.rol === 'user') {

            this.router.navigate([
              '/dashboard/user'
            ]);

          } else {

            this.mensajeError =
              'El usuario no tiene un rol válido.';

          }

        },

        error: (error) => {

          this.cargando = false;

          console.error(
            'Error al iniciar sesión:',
            error
          );

          this.mensajeError =
            'No se pudo conectar con el servidor.';

        }

      });

  }

}