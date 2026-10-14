import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Categoria } from '../../../core/models/categoria.model';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {

  private categoriasService = inject(CategoriasService);

  categorias: Categoria[] = [];
  cargando = true;
  mensajeError = '';

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.categoriasService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = this.obtenerMensajeError(err);
      }
    });
  }

  eliminarCategoria(categoria: Categoria): void {
    const confirmar = window.confirm(
      `¿Eliminar la categoría “${categoria.nombre}”? Esta acción no se puede deshacer.`
    );

    if (!confirmar) {
      return;
    }

    this.mensajeError = '';
    this.categoriasService.eliminarCategoria(categoria.id_categoria).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => this.mensajeError = this.obtenerMensajeError(err),
    });
  }

  private obtenerMensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const detalle = error.error?.detail;
      if (typeof detalle === 'string') {
        return detalle;
      }
    }

    return 'No se pudieron cargar o modificar las categorías. Intentá nuevamente.';
  }
}
