import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Categoria } from '../../../core/models/categoria.model';
import { ProductoPayload } from '../../../core/models/producto.model';
import { obtenerMensajeError } from '../../../core/utils/mensaje-error';

// El stock crítico debe ser menor al stock de alerta (misma regla que el backend).
function criticoMenorQueAlerta(control: AbstractControl): ValidationErrors | null {
  const alerta = control.get('stockAlerta')?.value;
  const critico = control.get('stockCritico')?.value;
  if (alerta == null || critico == null) {
    return null;
  }
  return critico < alerta ? null : { criticoMayorOIgual: true };
}

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productosService = inject(ProductosService);
  private categoriasService = inject(CategoriasService);
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  productoId: number | null = null;

  categorias: Categoria[] = [];
  guardando = false;
  mensajeError = '';

  productoForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    stockAlerta: [0, [Validators.required, Validators.min(0)]],
    stockCritico: [0, [Validators.required, Validators.min(0)]],
    idCategoria: [null as number | null, Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    descripcion: ['', Validators.maxLength(255)]
  }, { validators: criticoMenorQueAlerta });

  ngOnInit(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mensajeError = obtenerMensajeError(err);
        this.cdr.detectChanges();
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.productoId = Number(idParam);

      this.productosService.getProductoById(this.productoId).subscribe({
        next: (producto) => {
          this.productoForm.patchValue({
            nombre: producto.nombre,
            codigo: producto.codigo,
            stock: producto.stock,
            stockAlerta: producto.stockAlerta,
            stockCritico: producto.stockCritico,
            idCategoria: producto.idCategoria,
            precio: producto.precio,
            descripcion: producto.descripcion ?? ''
          });
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener el producto desde la API:', err);
          this.router.navigate(['/admin/productos']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const valores = this.productoForm.getRawValue();

    const payload: ProductoPayload = {
      codigo: valores.codigo!.trim(),
      nombre: valores.nombre!.trim(),
      stock: valores.stock!,
      stockAlerta: valores.stockAlerta!,
      stockCritico: valores.stockCritico!,
      idCategoria: valores.idCategoria!,
      precio: valores.precio!,
      descripcion: valores.descripcion?.trim() || undefined
    };

    this.guardando = true;
    this.mensajeError = '';

    const peticion = this.isEditMode && this.productoId !== null
      ? this.productosService.actualizarProducto(this.productoId, payload)
      : this.productosService.crearProducto(payload);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        this.guardando = false;
        this.mensajeError = obtenerMensajeError(err);
        this.cdr.detectChanges();
      }
    });
  }

  isInvalidField(field: string): boolean {
    const control = this.productoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  get criticoInvalido(): boolean {
    const critico = this.productoForm.get('stockCritico');
    return this.productoForm.hasError('criticoMayorOIgual') && !!critico?.touched;
  }
}