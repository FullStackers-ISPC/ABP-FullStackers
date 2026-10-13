import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';


export interface CategoriaResumen {
  id: string | number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {

  private categoriasService = inject(CategoriasService);
  private productosService = inject(ProductosService);
  private cdr = inject(ChangeDetectorRef);

  categorias: CategoriaResumen[] = [];

  ngOnInit(): void {
    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.productosService.getProductos().subscribe({
          next: (productos) => {
            this.categorias = categorias.map(categoria => ({
              id: categoria.id,
              nombre: categoria.nombre,
              cantidad: productos.filter(prod => prod.categoria === categoria.nombre).length
            }));

            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al cargar productos para contar por categoría:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

}