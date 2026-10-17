
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import {
  Movimiento,
  MovimientoPayload,
  TipoMovimiento
} from '../../core/models/movimiento.model';

import { Producto } from '../../core/models/producto.model';
import { AuthService } from '../../core/services/auth.service';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductosService } from '../../core/services/productos.service';
import { obtenerMensajeError } from '../../core/utils/mensaje-error';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})
export class DashboardUser implements OnInit {

  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly productosService = inject(ProductosService);
  private readonly movimientosService = inject(MovimientosService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly usuarioActual = this.getUsuarioActual();

  readonly nombreUsuario = [this.usuarioActual?.nombre, this.usuarioActual?.apellido]
    .map((parte) => parte?.trim())
    .filter((parte): parte is string => Boolean(parte))
    .join(' ') || 'Usuario';
  readonly emailUsuario = this.usuarioActual?.email?.trim() || 'Sin sesión iniciada';
  readonly rolUsuario = this.usuarioActual?.rol === 'admin' ? 'Administrador' : 'Usuario';

  sidebarOpen = false;
  submitted = false;
  movementRegistered = false;
  stockIssue = false;
  stockIssueMessage = '';
  mensajeError = '';

  isLoadingProducts = true;
  isLoadingMovements = true;
  productsErrorMessage = '';
  movementsErrorMessage = '';
  isSubmitting = false;

  products: Producto[] = [];

  categories: Array<{
    id: number;
    name: string;
    productCount: number;
  }> = [];

  movementHistory: Movimiento[] = [];

  readonly movementForm: FormGroup;

  private getUsuarioActual() {
    try {
      return this.authService.getUsuarioActual();
    } catch {
      return null;
    }
  }

  constructor() {
    this.movementForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      product: ['', Validators.required],
      quantity: [null as number | null, Validators.required],
      observation: ['']
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarMovimientos();
  }

  // Obtener productos desde Django
  cargarProductos(): void {
    this.isLoadingProducts = true;
    this.productsErrorMessage = '';
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.products = data;
        this.categories = this.buildCategories(data);
        this.isLoadingProducts = false;
        this.productsErrorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.isLoadingProducts = false;
        this.productsErrorMessage = `No se pudieron cargar los productos y categorías. ${obtenerMensajeError(err)}`;
        this.cdr.detectChanges();
      }
    });
  }

  // Obtener historial desde Django
  cargarMovimientos(): void {
    this.isLoadingMovements = true;
    this.movementsErrorMessage = '';
    this.movimientosService.getMovimientos().subscribe({
      next: (data) => {
        this.movementHistory = this.usuarioActual
          ? data.filter(movimiento => movimiento.usuario === String(this.usuarioActual!.id_usuario))
          : [];
        this.isLoadingMovements = false;
        this.movementsErrorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar movimientos:', err);
        this.isLoadingMovements = false;
        this.movementsErrorMessage = `No se pudo cargar el historial de movimientos. ${obtenerMensajeError(err)}`;
        this.cdr.detectChanges();
      }
    });
  }

  // Construir categorías a partir del catálogo
  buildCategories(productos: Producto[]): Array<{
    id: number;
    name: string;
    productCount: number;
  }> {

    const grouped = new Map<string, {
      id: number;
      name: string;
      productCount: number;
    }>();

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

  // Métricas del dashboard
  getAvailableProductsCount(): number {
    return this.products.filter(
      producto => producto.stock > 0
    ).length;
  }

  getLowStockCount(): number {
    return this.products.filter(
      producto => producto.stock <= producto.stockAlerta
    ).length;
  }

  getTodayMovementsCount(): number {
    const hoy = new Date().toDateString();

    return this.movementHistory.filter(
      movimiento =>
        new Date(movimiento.fecha).toDateString() === hoy
    ).length;
  }

  // Estado del producto
  get productosDeCategoria(): Producto[] {
    const categoria = this.movementForm.get('category')?.value;
    return this.products.filter(producto => producto.categoria === categoria);
  }

  cambiarCategoria(): void {
    this.movementForm.get('product')?.reset('');
  }

  getProductStatus(product: Producto): {
    label: string;
    className: string;
  } {

    if (product.stock <= product.stockCritico) {
      return {
        label: 'Crítico',
        className: 'badge-critico'
      };
    }

    if (product.stock <= product.stockAlerta) {
      return {
        label: 'Alerta',
        className: 'badge-alerta'
      };
    }

    return {
      label: 'Disponible',
      className: 'badge-ok'
    };
  }

  // Etiqueta del movimiento
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

  // Clase CSS según el tipo
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

  // Mostrar cantidades con signo
  getMovementAmount(movimiento: Movimiento): string {
    const cantidad = movimiento.cantidad;

    if (movimiento.tipo === 'salida') {
      return `-${Math.abs(cantidad)}`;
    }

    return cantidad > 0
      ? `+${cantidad}`
      : String(cantidad);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }

  // Registrar movimiento en Django
  onSubmit(): void {

    if (this.isSubmitting) {
      return;
    }

    this.submitted = true;
    this.movementRegistered = false;
    this.stockIssue = false;
    this.stockIssueMessage = '';
    this.mensajeError = '';

    // Validar formulario
    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    // Obtener usuario actual
    const usuarioActual = this.getUsuarioActual();

    if (!usuarioActual) {
      this.mensajeError =
        'Debés iniciar sesión para registrar movimientos.';
      this.cdr.detectChanges();
      return;
    }

    const formValue = this.movementForm.getRawValue();

    // Buscar producto por ID
    const selectedProduct = this.products.find(
      producto => producto.id === Number(formValue.product)
    );

    if (!selectedProduct) {
      this.mensajeError = 'El producto seleccionado no existe.';
      this.cdr.detectChanges();
      return;
    }

    if (selectedProduct.categoria !== formValue.category) {
      this.mensajeError = 'Seleccioná un producto de la categoría elegida.';
      this.cdr.detectChanges();
      return;
    }

    const tipo = formValue.type as TipoMovimiento;
    const quantity = Number(formValue.quantity);

    // Validar tipo
    if (!['entrada', 'salida', 'ajuste'].includes(tipo)) {
      this.mensajeError = 'Seleccioná un tipo válido.';
      this.cdr.detectChanges();
      return;
    }

    // Validar cantidad entera
    if (
      formValue.quantity === null ||
      !Number.isInteger(quantity)
    ) {
      this.mensajeError = 'Ingresá una cantidad entera válida.';
      this.cdr.detectChanges();
      return;
    }

    // Validar cantidad según tipo
    if (tipo === 'ajuste') {

      if (quantity === 0) {
        this.mensajeError = 'El ajuste no puede ser cero.';
        this.cdr.detectChanges();
        return;
      }

    } else if (quantity <= 0) {

      this.mensajeError =
        'La cantidad debe ser mayor a cero.';
      this.cdr.detectChanges();
      return;
    }

    // Verificar stock en salidas
    if (
      tipo === 'salida' &&
      quantity > selectedProduct.stock
    ) {
      this.stockIssue = true;
      this.stockIssueMessage =
        `Stock actual: ${selectedProduct.stock} unidades.`;
      this.cdr.detectChanges();
      return;
    }

    // Verificar stock en ajustes negativos
    if (
      tipo === 'ajuste' &&
      selectedProduct.stock + quantity < 0
    ) {
      this.stockIssue = true;
      this.stockIssueMessage =
        'El ajuste no puede dejar el stock negativo.';
      this.cdr.detectChanges();
      return;
    }

    // Datos que espera Django
    const nuevoMovimiento: MovimientoPayload = {
      tipo,
      cantidad: quantity,
      producto: selectedProduct.id,
      usuario: usuarioActual.id_usuario
    };

    this.isSubmitting = true;

    // POST a Django
    this.movimientosService.crearMovimiento(nuevoMovimiento).subscribe({

      next: () => {

        this.movementRegistered = true;
        this.isSubmitting = false;
        this.submitted = false;

        // Limpiar formulario
        this.movementForm.reset({
          type: '',
          category: '',
          product: '',
          quantity: null,
          observation: ''
        });

        // Actualizar productos y movimientos
        this.cargarProductos();
        this.cargarMovimientos();

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error('Error al registrar movimiento:', err);

        this.isSubmitting = false;

        this.mensajeError = obtenerMensajeError(err);

        this.cdr.detectChanges();
      }
    });
  }

  // Validación visual de campos
  isInvalid(controlName: string): boolean {
    const control = this.movementForm.get(controlName);

    return Boolean(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );
  }
}
