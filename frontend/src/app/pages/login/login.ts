import { ChangeDetectorRef, Component } from '@angular/core';
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
  standalone: true,
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
    private authService: AuthService,
    private cdr: ChangeDetectorRef
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

    const { email, password } = this.loginForm.getRawValue();

    this.cargando = true;

    this.authService
      .login(email, password)
      .subscribe({
        next: (usuario) => {
          this.cargando = false;

          if (usuario.rol === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (usuario.rol === 'usuario') {
            this.router.navigate(['/dashboard/user']);
          } else {
            this.router.navigate(['/']);
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          this.cargando = false;
          console.error('Error al iniciar sesión:', error);

          if (error.status === 401) {
            this.mensajeError = 'Correo electrónico o contraseña incorrectos.';
          } else if (error.status === 0) {
            this.mensajeError = 'No se pudo conectar con el servidor.';
          } else {
            this.mensajeError = 'Ocurrió un error al iniciar sesión.';
          }

          this.cdr.detectChanges();
        }
      });
  }

}