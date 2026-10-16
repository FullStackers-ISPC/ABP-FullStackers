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

    const modoRuta =
      this.route.snapshot.data['modo'];

    if (modoRuta === 'recuperar') {
      this.modo = 'recuperar';
    }

    this.registroForm = this.fb.group({

      nombre: [
        '',
        [
          Validators.required
        ]
      ],

      apellido: [
        '',
        [
          Validators.required
        ]
      ],

      usuario: [
        '',
        [
          Validators.required
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      confirmarPassword: [
        '',
        [
          Validators.required
        ]
      ],

      ciudad: [
        ''
      ],

      provincia: [
        ''
      ],

      terminos: [
        false,
        [
          Validators.requiredTrue
        ]
      ]

    });

    this.recuperarForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]

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

      this.error =
        'Revisá los campos del formulario.';

      return;
    }

    const datos =
      this.registroForm.getRawValue();

    if (
      datos.password !==
      datos.confirmarPassword
    ) {

      this.error =
        'Las contraseñas no coinciden.';

      return;
    }

    const emailNormalizado =
      datos.email
        .trim()
        .toLowerCase();

    this.cargando = true;

    this.authService
      .buscarPorEmail(emailNormalizado)
      .subscribe({

        next: (usuarios) => {

          console.log(
            'Resultado de buscarPorEmail:',
            usuarios
          );

          if (usuarios.length > 0) {

            this.cargando = false;

            this.error =
              'El email ya está registrado.';

            this.cdr.detectChanges();

            return;
          }

          const nuevoUsuario: Usuario = {

            nombre:
              datos.nombre.trim(),

            apellido:
              datos.apellido.trim(),

            usuario:
              datos.usuario.trim(),

            email:
              emailNormalizado,

            password:
              datos.password,

            ciudad:
              datos.ciudad?.trim(),

            provincia:
              datos.provincia,

            rol:
              'user'

          };

          this.authService
            .registrar(nuevoUsuario)
            .subscribe({

              next: (usuarioCreado) => {

                console.log(
                  'Usuario creado:',
                  usuarioCreado
                );

                this.cargando = false;

                this.mensaje =
                  'Usuario registrado correctamente.';

                this.registroForm.reset();

                this.cdr.detectChanges();

                setTimeout(() => {

                  this.router.navigate([
                    '/login'
                  ]);

                }, 1200);

              },

              error: (error) => {

                console.error(
                  'Error al registrar usuario:',
                  error
                );

                this.cargando = false;

                this.error =
                  'No se pudo registrar el usuario.';

                this.cdr.detectChanges();

              }

            });

        },

        error: (error) => {

          console.error(
            'Error al verificar email:',
            error
          );

          this.cargando = false;

          this.error =
            'No se pudo verificar el email.';

          this.cdr.detectChanges();

        }

      });

  }


  recuperarPassword(): void {

    this.error = '';
    this.mensaje = '';

    if (this.recuperarForm.invalid) {

      this.recuperarForm.markAllAsTouched();

      this.error =
        'Ingresá un correo electrónico válido.';

      return;
    }

    const email =
      this.recuperarForm
        .getRawValue()
        .email
        .trim()
        .toLowerCase();

    this.cargando = true;

    this.authService
      .buscarPorEmail(email)
      .subscribe({

        next: (usuarios) => {

          this.cargando = false;

          if (usuarios.length === 0) {

            this.error =
              'No existe una cuenta registrada con ese correo.';

            this.cdr.detectChanges();

            return;
          }

          this.mensaje =
            'Cuenta encontrada. En una implementación real se enviaría un correo para restablecer la contraseña.';

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Error al buscar usuario:',
            error
          );

          this.cargando = false;

          this.error =
            'No se pudo conectar con el servidor.';

          this.cdr.detectChanges();

        }

      });

  }

}