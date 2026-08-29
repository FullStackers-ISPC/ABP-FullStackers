import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductosService } from '../../../core/services/productos.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute); 
  private router = inject(Router); 
  private productosService = inject(ProductosService);

  isEditMode = false;
  productoId: number | null = null;

  productoForm = this.fb.group({
    nombre: ['', Validators.required],
    codigo: ['', Validators.required],
    stock: [0, Validators.required],
    stockAlerta: [0, Validators.required],
    stockCritico: [0, Validators.required],
    categoria: ['', Validators.required],
    precio: [0, Validators.required],
    descripcion: ['']
  });

    ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.isEditMode = true;
      this.productoId = Number(idParam);
      
      const productoExistente = this.productosService.getProductoById(this.productoId);
      
      if (productoExistente) {
        this.productoForm.patchValue({
          nombre: productoExistente.nombre,
          codigo: productoExistente.id.toString(), 
          stock: productoExistente.stock,
          stockAlerta: productoExistente.stockAlerta,
          stockCritico: productoExistente.stockCritico,
          categoria: productoExistente.categoria,
          precio: productoExistente.precio,              
          descripcion: productoExistente.descripcion || '',
        });
      }
      else {
        this.isEditMode = false;
      }
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      console.log('Datos listos para enviar:', this.productoForm.value);
      
      this.router.navigate(['/admin/productos']);
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  isInvalidField(field: string): boolean {
    const control = this.productoForm.get(field);

    return !!(control && control.invalid && control.touched);
  }
}