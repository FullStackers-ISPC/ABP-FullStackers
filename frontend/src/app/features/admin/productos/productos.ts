import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';
import { obtenerMensajeError } from '../../../core/utils/mensaje-error';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

export class ProductosComponent implements OnInit {
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  productos: Producto[] = [];
  cargando = true;
  mensajeError = '';
  busqueda = '';
  categoriaFiltro = '';

  get categoriasDisponibles(): string[] {
    return [...new Set(this.productos.map((p) => p.categoria))].sort();
  }

  get productosFiltrados(): Producto[] {
    const texto = this.busqueda.trim().toLowerCase();
    return this.productos.filter((p) =>
      (!this.categoriaFiltro || p.categoria === this.categoriaFiltro) &&
      (!texto ||
        p.nombre.toLowerCase().includes(texto) ||
        p.codigo.toLowerCase().includes(texto))
    );
  }

  onBuscar(event: Event): void {
    this.busqueda = (event.target as HTMLInputElement).value;
  }

  onFiltrarCategoria(event: Event): void {
    this.categoriaFiltro = (event.target as HTMLSelectElement).value;
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = obtenerMensajeError(err);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarProducto(producto: Producto): void {
    const confirmar = window.confirm(
      `¿Eliminar el producto “${producto.nombre}”? Esta acción no se puede deshacer.`
    );
    if (!confirmar) {
      return;
    }

    this.mensajeError = '';
    this.productosService.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.cargarProductos();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.mensajeError = obtenerMensajeError(err);
          this.cdr.detectChanges();
        });
      }
    });
  }

  getEstado(prod: Producto): { texto: string, clase: string } {
    if (prod.stock <= prod.stockCritico) {
      return { texto: 'Crítico', clase: 'badge-critico' };
    } else if (prod.stock <= prod.stockAlerta) {
      return { texto: 'Alerta', clase: 'badge-alerta' };
    } else {
      return { texto: 'Normal', clase: 'badge-ok' };
    }
  }
}