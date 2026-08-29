import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto, ProductosService } from '../../../core/services/productos.service';


@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})

export class ProductosComponent implements OnInit {
  private productosService = inject(ProductosService);
  productos: Producto[] = [];

  ngOnInit(): void {
    this.productos = this.productosService.getProductos();
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