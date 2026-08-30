import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {

  private route = inject(ActivatedRoute);

  modo: 'registro' | 'recuperar' = 'registro';

  nombre: string = '';
  apellido: string = '';
  usuario: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';
  ciudad: string = '';
  provincia: string = '';
  terminos: boolean = false;

  mensaje: string = '';
  error: string = '';

  constructor() {

    const modoRuta = this.route.snapshot.data['modo'];

    if (modoRuta === 'recuperar') {
      this.modo = 'recuperar';
    }

  }

  enviar(): void {

    this.mensaje = '';
    this.error = '';

    if (this.modo === 'recuperar') {

      if (!this.email.trim()) {
        this.error = 'Ingresá tu correo electrónico.';
        return;
      }

      this.mensaje =
        'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.';

      return;
    }

    if (
      !this.nombre.trim() ||
      !this.apellido.trim() ||
      !this.usuario.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmarPassword
    ) {
      this.error = 'Completá todos los campos obligatorios.';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.terminos) {
      this.error = 'Debés aceptar los términos y condiciones.';
      return;
    }

    this.mensaje = 'Usuario registrado correctamente.';

  }

}