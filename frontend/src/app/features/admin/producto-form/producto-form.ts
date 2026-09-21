import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';

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
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  productoId: number | null = null;

  guardando = false;
  errorGuardado = false;

  productoForm = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    stock: [0, Validators.required],
    stockAlerta: [0, Validators.required],
    stockCritico: [0, Validators.required],
    categoria: ['', Validators.required],
    precio: [0, Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.productoId = Number(idParam);

      this.productosService.getProductoById(this.productoId).subscribe({
        next: (productoExistente) => {
          if (!productoExistente) {
            console.warn(`No se encontró el producto con ID ${this.productoId}`);
            this.router.navigate(['/admin/productos']);
            return;
          }

          this.productoForm.patchValue({
            nombre: productoExistente.nombre,
            codigo: productoExistente.id.toString(),
            stock: productoExistente.stock,
            stockAlerta: productoExistente.stockAlerta,
            stockCritico: productoExistente.stockCritico,
            categoria: productoExistente.categoria,
            precio: productoExistente.precio,
            descripcion: productoExistente.descripcion || '',
          });

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al obtener el producto desde la API:', err);
          this.router.navigate(['/admin/productos']);
        }
      });
    } else {
      this.isEditMode = false;
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      // PUT de edición todavía no implementado (fuera de este alcance).
      console.log('Datos listos para actualizar (pendiente conectar PUT):', this.productoForm.value);
      this.router.navigate(['/admin/productos']);
      return;
    }

    const formValue = this.productoForm.value;

    const nuevoProducto: Producto = {
      id: Number(formValue.codigo),
      nombre: formValue.nombre!,
      categoria: formValue.categoria!,
      stock: formValue.stock!,
      stockAlerta: formValue.stockAlerta!,
      stockCritico: formValue.stockCritico!,
      precio: formValue.precio!,
      descripcion: formValue.descripcion || undefined
    };

    this.guardando = true;
    this.errorGuardado = false;

    this.productosService.crearProducto(nuevoProducto).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        this.guardando = false;
        this.errorGuardado = true;
        console.error('Error al crear el producto:', err);
      }
    });
  }

  isInvalidField(field: string): boolean {
    const control = this.productoForm.get(field);

    return !!(control && control.invalid && control.touched);
  }
}