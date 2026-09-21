import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { Producto } from '../../../core/models/producto.model';
import { Movimiento } from '../../../core/models/movimiento.model';

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
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  productos: Producto[] = [];
  mostrarErrorStock = false;
  mostrarExito = false;
  intentoFallido = false;

  movimientoForm = this.fb.group({
    tipo: ['', Validators.required],
    producto: ['', Validators.required], 
    categoria: [{ value: '', disabled: true }, Validators.required], 
    cantidad: [1, [Validators.required, Validators.min(1)]],
    observacion: ['']
  });

  ngOnInit(): void {
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data.filter(p => p.nombre);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar productos en formulario:', err)
    });

    this.movimientoForm.get('producto')?.valueChanges.subscribe((nombreProd) => {
      if (!nombreProd) {
        this.movimientoForm.patchValue({ categoria: '' });
        return;
      }

      const prod = this.productos.find(p => p.nombre === nombreProd);
      if (prod) {
        this.movimientoForm.patchValue({ categoria: prod.categoria });
      }
    });
  }

  isInvalidField(field: string): boolean {
    const control = this.movimientoForm.get(field);
    return !!(control && control.invalid && (control.touched || this.intentoFallido));
  }

  onSubmit(): void {
    this.mostrarErrorStock = false;
    this.mostrarExito = false;
    this.intentoFallido = false;

    if (this.movimientoForm.invalid) {
      this.intentoFallido = true;
      this.movimientoForm.markAllAsTouched();
      return;
    }

    const formVal = this.movimientoForm.getRawValue();
    const prodSeleccionado = this.productos.find(p => p.nombre === formVal.producto);

    if (!prodSeleccionado) {
      return;
    }

    const cantidad = Number(formVal.cantidad);

    if (formVal.tipo === 'salida' && cantidad > prodSeleccionado.stock) {
      this.mostrarErrorStock = true;
      return;
    }

    const nuevoMovimiento: Omit<Movimiento, 'id'> = {
      fecha: new Date().toLocaleDateString('es-AR'),
      producto: prodSeleccionado.nombre,
      categoria: prodSeleccionado.categoria, 
      tipo: formVal.tipo as 'entrada' | 'salida' | 'ajuste',
      cantidad: formVal.tipo === 'salida' ? -cantidad : cantidad,
      usuario: 'admin'
    };

    this.movimientosService.crearMovimiento(nuevoMovimiento).subscribe({
      next: () => {
        this.mostrarExito = true;
        this.movimientoForm.reset({ cantidad: 1, tipo: '', categoria: '', producto: '' });
        this.cdr.detectChanges();
        
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: (err) => console.error('Error al registrar movimiento:', err)
    });
  }
}