import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {

  private route = inject(ActivatedRoute);

  modo: 'registro' | 'recuperar' = 'registro';

  registroForm: FormGroup;
  recuperarForm: FormGroup;

  mensaje: string = '';
  error: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    const modoRuta = this.route.snapshot.data['modo'];
    if (modoRuta === 'recuperar') {
      this.modo = 'recuperar';
    }

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmarPassword: ['', [Validators.required]],
      ciudad: [''],
      provincia: [''],
      terminos: [false, [Validators.requiredTrue]]
    });

    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviar(): void {
    this.mensaje = '';
    this.error = '';

    if (this.modo === 'recuperar') {
      this.recuperarPassword();
      return;
    }

    this.registrarUsuario();
  }

  registrarUsuario(): void {
    this.error = '';
    this.mensaje = '';

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.error = 'Revisá los campos del formulario.';
      return;
    }

    const datos = this.registroForm.getRawValue();

    if (datos.password !== datos.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre: datos.nombre.trim(),
      apellido: datos.apellido.trim(),
      email: datos.email.trim().toLowerCase(),
      password: datos.password,
      ciudad: datos.ciudad ? datos.ciudad.trim() : '',
      provincia: datos.provincia ? datos.provincia.trim() : '',
      id_rol: 2 // 2 corresponde al rol usuario
    };

    this.cargando = true;

    
    this.authService.registrar(nuevoUsuario).subscribe({
      next: (usuarioCreado) => {
        this.cargando = false;
        this.mensaje = 'Usuario registrado correctamente.';
        this.registroForm.reset();
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al registrar usuario:', err);

        if (err.status === 400) {
          this.error = 'El email ya se encuentra registrado o los datos son inválidos.';
        } else if (err.status === 0) {
          this.error = 'No se pudo conectar con el servidor.';
        } else {
          this.error = 'Ocurrió un error al registrar la cuenta.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  recuperarPassword(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      this.error = 'Ingresá un correo electrónico válido.';
      return;
    }

    this.mensaje = 'Esta función estará disponible próximamente.';
    this.cdr.detectChanges();
  }

}