import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoriaPayload } from '../../../core/models/categoria.model';
import { CategoriasService } from '../../../core/services/categorias.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.css'
})
export class CategoriaFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private categoriasService = inject(CategoriasService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  categoriaId: number | null = null;

  guardando = false;
  errorGuardado = false;
  mensajeError = '';

  categoriaForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    descripcion: ['', Validators.maxLength(255)]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.categoriaId = Number(idParam);

      if (!Number.isInteger(this.categoriaId) || this.categoriaId <= 0) {
        this.errorGuardado = true;
        this.mensajeError = 'El identificador de la categoría no es válido.';
        return;
      }

      this.categoriasService.getCategoriaById(this.categoriaId).subscribe({
        next: (categoria) => {
          this.categoriaForm.patchValue({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion ?? ''
          });
        },
        error: () => {
          this.isEditMode = false;
        }
      });
    }
  }

  isInvalidField(field: string): boolean {
    const control = this.categoriaForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    this.errorGuardado = false;
    this.mensajeError = '';

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const datos: CategoriaPayload = {
      nombre: this.categoriaForm.controls.nombre.value?.trim() ?? '',
      descripcion: this.categoriaForm.controls.descripcion.value?.trim() || null,
    };

    const peticion = this.isEditMode && this.categoriaId !== null
      ? this.categoriasService.actualizarCategoria(this.categoriaId, datos)
      : this.categoriasService.crearCategoria(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/admin/categorias']);
      },
      error: (error) => {
        this.guardando = false;
        this.errorGuardado = true;
        this.mensajeError = this.obtenerMensajeError(error);
      }
    });
  }

  private obtenerMensajeError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const datos = error.error;
      if (typeof datos?.detail === 'string') {
        return datos.detail;
      }
      if (Array.isArray(datos?.nombre)) {
        return datos.nombre[0];
      }
    }

    return 'Ocurrió un error al procesar la categoría. Intentá nuevamente.';
  }
}
