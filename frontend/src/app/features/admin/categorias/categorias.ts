import { Component, inject, OnInit } from '@angular/core';
import { ProductosService } from '../../../core/services/productos.service';


export interface CategoriaResumen {
  id: number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {

  private productosService = inject(ProductosService);
  
  categorias: CategoriaResumen[] = [];

  ngOnInit(): void {
    const todosLosProductos = this.productosService.getProductos();
    
    const contador = new Map<string, number>();
    
    todosLosProductos.forEach(prod => {
      const cantidadActual = contador.get(prod.categoria) || 0;
      contador.set(prod.categoria, cantidadActual + 1);
    });

    let idGenerado = 1;
    this.categorias = Array.from(contador.entries()).map(([nombre, cantidad]) => {
      return {
        id: idGenerado++,
        nombre: nombre,
        cantidad: cantidad
      };
    });
  }

}