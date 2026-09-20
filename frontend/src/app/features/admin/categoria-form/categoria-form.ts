import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../core/models/categoria.model';
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
  categoriaId: string | null = null;

  guardando = false;
  errorGuardado = false;

  categoriaForm = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.categoriaId = idParam;

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

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const datos = this.categoriaForm.value as Omit<Categoria, 'id'>;

    const peticion = this.isEditMode && this.categoriaId !== null
      ? this.categoriasService.actualizarCategoria(this.categoriaId, datos)
      : this.categoriasService.crearCategoria(datos);

    peticion.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/admin/categorias']);
      },
      error: () => {
        this.guardando = false;
        this.errorGuardado = true;
      }
    });
  }
}