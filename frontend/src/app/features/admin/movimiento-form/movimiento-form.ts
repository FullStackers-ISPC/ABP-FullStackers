
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { ProductosService } from '../../../core/services/productos.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { AuthService } from '../../../core/services/auth.service';

import { Producto } from '../../../core/models/producto.model';

import {
  MovimientoPayload,
  TipoMovimiento
} from '../../../core/models/movimiento.model';


@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movimiento-form.html',
  styleUrl: './movimiento-form.css'
})
export class MovimientoFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private movimientosService = inject(MovimientosService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // Lista de productos obtenidos desde Django
  productos: Producto[] = [];

  // Estados del formulario
  mostrarErrorStock = false;
  mostrarExito = false;
  intentoFallido = false;
  mensajeError = '';
  guardando = false;

  // Formulario reactivo
  movimientoForm = this.fb.group({
    tipo: ['', Validators.required],
    producto: ['', Validators.required],
    categoria: [{ value: '', disabled: true }],
    cantidad: [1, Validators.required],
    observacion: ['']
  });


  ngOnInit(): void {

    // Cargar productos desde Django
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.filter(p => p.nombre);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.mensajeError = 'No se pudieron cargar los productos.';
        this.cdr.detectChanges();
      }
    });

    // Completar automáticamente la categoría
    this.movimientoForm.get('producto')?.valueChanges.subscribe(
      (productoId) => {

        const producto = this.productos.find(
          p => p.id === Number(productoId)
        );

        this.movimientoForm.patchValue({
          categoria: producto?.categoria ?? ''
        });
      }
    );
  }


  // Comprobar si un campo es inválido
  isInvalidField(field: string): boolean {
    const control = this.movimientoForm.get(field);

    return !!(
      control &&
      control.invalid &&
      (control.touched || this.intentoFallido)
    );
  }


  // Registrar un movimiento
  onSubmit(): void {

    // Evitar envíos duplicados
    if (this.guardando) {
      return;
    }

    // Reiniciar mensajes
    this.mostrarErrorStock = false;
    this.mostrarExito = false;
    this.intentoFallido = false;
    this.mensajeError = '';

    // Validar formulario
    if (this.movimientoForm.invalid) {
      this.intentoFallido = true;
      this.movimientoForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    // Obtener el usuario que inició sesión
    const usuarioActual = this.authService.getUsuarioActual();

    if (!usuarioActual) {
      this.mensajeError =
        'Debés iniciar sesión para registrar movimientos.';
      this.cdr.detectChanges();
      return;
    }

    // Obtener valores del formulario
    const formVal = this.movimientoForm.getRawValue();

    // Buscar el producto seleccionado por ID
    const producto = this.productos.find(
      p => p.id === Number(formVal.producto)
    );

    if (!producto) {
      this.mensajeError = 'El producto seleccionado no existe.';
      this.cdr.detectChanges();
      return;
    }

    // Validar tipo de movimiento
    const tipo = formVal.tipo as TipoMovimiento;

    if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
      this.mensajeError = 'Seleccioná un tipo de movimiento válido.';
      this.cdr.detectChanges();
      return;
    }

    // Obtener cantidad
    const cantidad = Number(formVal.cantidad);

    // La cantidad debe ser un número entero
    if (
      formVal.cantidad === null ||
      !Number.isInteger(cantidad)
    ) {
      this.mensajeError = 'Ingresá una cantidad entera válida.';
      this.cdr.detectChanges();
      return;
    }

    // Validaciones según el tipo de movimiento
    if (tipo === 'ajuste') {

      // El ajuste permite valores positivos o negativos
      if (cantidad === 0) {
        this.mensajeError = 'El ajuste no puede ser cero.';
        this.cdr.detectChanges();
        return;
      }

    } else {

      // Entradas y salidas requieren valores positivos
      if (cantidad <= 0) {
        this.mensajeError =
          'La cantidad debe ser mayor a cero.';
        this.cdr.detectChanges();
        return;
      }
    }

    // Comprobar stock en salidas
    if (
      tipo === 'salida' &&
      cantidad > producto.stock
    ) {
      this.mostrarErrorStock = true;
      this.cdr.detectChanges();
      return;
    }

    // Comprobar que un ajuste no genere stock negativo
    if (
      tipo === 'ajuste' &&
      producto.stock + cantidad < 0
    ) {
      this.mostrarErrorStock = true;
      this.cdr.detectChanges();
      return;
    }

    // Preparar datos para Django
    const nuevoMovimiento: MovimientoPayload = {
      tipo: tipo,
      cantidad: cantidad,
      producto: producto.id,
      usuario: usuarioActual.id_usuario
    };

    this.guardando = true;

    // Enviar movimiento al backend
    this.movimientosService.crearMovimiento(nuevoMovimiento).subscribe({

      next: () => {

        this.guardando = false;
        this.mostrarExito = true;

        // Limpiar formulario
        this.movimientoForm.reset({
          tipo: '',
          producto: '',
          categoria: '',
          cantidad: 1,
          observacion: ''
        });

        this.cdr.detectChanges();

        // Volver al historial
        setTimeout(() => {
          this.router.navigate(['/admin/movimientos']);
        }, 1500);
      },

      error: (err) => {

        this.guardando = false;

        console.error('Error al registrar movimiento:', err);

        if (err.status === 400) {
          this.mensajeError =
            'Movimiento inválido. Verificá la cantidad y el stock disponible.';
        } else if (err.status === 404) {
          this.mensajeError =
            'El producto o usuario no existe en Django.';
        } else if (err.status === 0) {
          this.mensajeError =
            'No se pudo conectar con el servidor Django.';
        } else {
          this.mensajeError =
            'Ocurrió un error al registrar el movimiento.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}
