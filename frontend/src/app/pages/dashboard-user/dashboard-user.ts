import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movimiento } from '../../core/models/movimiento.model';
import { Producto } from '../../core/models/producto.model';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductosService } from '../../core/services/productos.service';

@Component({
  selector: 'app-dashboard-user',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})
export class DashboardUser implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);
  private readonly cdr = inject(ChangeDetectorRef);

  sidebarOpen = false;
  submitted = false;
  movementRegistered = false;
  stockIssue = false;
  stockIssueMessage = '';
  isLoadingProducts = true;
  isLoadingMovements = true;
  isSubmitting = false;

  products: Producto[] = [];
  categories: Array<{ id: number; name: string; productCount: number }> = [];
  movementHistory: Movimiento[] = [];

  readonly movementForm: FormGroup;

  constructor() {
    // el formulario reactive se conserva con la misma validación visual y funcional
    this.movementForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [null as number | null, [Validators.required, Validators.min(1)]],
      observation: ['']
    });
  }

  ngOnInit(): void {
    // carga inicial de productos desde json-server para renderizar el catalogo del dashboard
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.products = data;
        this.categories = this.buildCategories(data);
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos del dashboard usuario:', err);
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
      }
    });

    // carga inicial del historial de movimientos que luego se muestra en la tabla del dashboard
    this.movimientosService.getMovimientos().subscribe({
      next: (data) => {
        this.movementHistory = data;
        this.isLoadingMovements = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar movimientos del dashboard usuario:', err);
        this.isLoadingMovements = false;
        this.cdr.detectChanges();
      }
    });
  }

  // se derivan las categorías a partir de los productos reales del backend para evitar replicarlas en db.json
  buildCategories(productos: Producto[]): Array<{ id: number; name: string; productCount: number }> {
    const grouped = new Map<string, { id: number; name: string; productCount: number }>();

    productos.forEach((producto, index) => {
      if (!grouped.has(producto.categoria)) {
        grouped.set(producto.categoria, {
          id: index + 1,
          name: producto.categoria,
          productCount: 0
        });
      }

      const current = grouped.get(producto.categoria)!;
      current.productCount += 1;
    });

    return Array.from(grouped.values());
  }

  // las metricas del resumen se calculan en tiempo real para reflejar el estado actual del inventario
  getAvailableProductsCount(): number {
    return this.products.filter((producto) => producto.stock > 0).length;
  }

  getLowStockCount(): number {
    return this.products.filter((producto) => producto.stock <= producto.stockAlerta).length;
  }

  getTodayMovementsCount(): number {
    return this.movementHistory.filter((movimiento) => movimiento.fecha === new Date().toLocaleDateString('es-AR')).length;
  }

  getProductStatus(product: Producto): { label: string; className: string } {
    if (product.stock <= product.stockCritico) {
      return { label: 'Crítico', className: 'badge-critico' };
    }

    if (product.stock <= product.stockAlerta) {
      return { label: 'Alerta', className: 'badge-alerta' };
    }

    return { label: 'Disponible', className: 'badge-ok' };
  }

  getMovementTypeLabel(tipo: string): string {
    switch (tipo) {
      case 'entrada':
        return 'Entrada';
      case 'salida':
        return 'Salida';
      case 'ajuste':
        return 'Ajuste';
      default:
        return 'Movimiento';
    }
  }

  getMovementTypeClass(tipo: string): string {
    switch (tipo) {
      case 'entrada':
        return 'tipo-entrada';
      case 'salida':
        return 'tipo-salida';
      case 'ajuste':
        return 'tipo-ajuste';
      default:
        return 'tipo-entrada';
    }
  }

  getMovementAmount(movimiento: Movimiento): string {
    const absolute = Math.abs(movimiento.cantidad);
    return `${movimiento.cantidad >= 0 ? '+' : '-'}${absolute}`;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  // el submit mantiene la validación reactiva y si el stock lo permite envía un POST a /movimientos
  onSubmit(): void {
    this.submitted = true;
    this.movementRegistered = false;
    this.stockIssue = false;
    this.stockIssueMessage = '';

    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      return;
    }

    const formValue = this.movementForm.getRawValue();
    const selectedProduct = this.products.find(
      (producto) => String(producto.id) === String(formValue.product)
    );
    const quantity = Number(formValue.quantity);

    // el flujo de salida exige revisar el stock real antes de enviar el movimiento, como en el comportamiento
    // original de la maqueta, pero ahora con datos extraídos del backend
    if (formValue.type === 'salida' && selectedProduct && quantity > selectedProduct.stock) {
      this.stockIssue = true;
      this.stockIssueMessage = `No hay suficiente stock disponible para registrar la salida. Stock actual: ${selectedProduct.stock} unidad${selectedProduct.stock === 1 ? '' : 'es'}.`;
      return;
    }

    if (!selectedProduct) {
      return;
    }

    const numericIds = this.movementHistory
      .map((movimiento) => Number(movimiento.id))
      .filter((id) => Number.isInteger(id));
    const nextMovementId = String(Math.max(0, ...numericIds) + 1);

    const nuevoMovimiento = {
      id: nextMovementId,
      fecha: new Date().toLocaleDateString('es-AR'),
      producto: selectedProduct.nombre,
      categoria: selectedProduct.categoria,
      tipo: formValue.type as 'entrada' | 'salida' | 'ajuste',
      cantidad: formValue.type === 'salida' ? -quantity : quantity,
      usuario: 'usuario',
      observacion: formValue.observation || undefined
    };

    this.isSubmitting = true;

    // cuando el POST responde con exito, se inserta el movimiento nuevo al principio del historial para
    // reflejar la operación en la interfaz sin necesidad de recargar la pagina
    this.movimientosService.crearMovimiento(nuevoMovimiento).subscribe({
      next: (movimientoCreado) => {
        this.movementHistory = [movimientoCreado, ...this.movementHistory];
        this.movementRegistered = true;
        this.movementForm.reset({
          type: '',
          category: '',
          product: '',
          quantity: null,
          observation: ''
        });
        this.submitted = false;
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al registrar movimiento desde el dashboard usuario:', err);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.movementForm.get(controlName);
    return Boolean(control && control.invalid && (control.touched || this.submitted));
  }
}
