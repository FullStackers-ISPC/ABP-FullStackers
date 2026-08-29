import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movimiento-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './movimiento-form.html',
  styleUrl: './movimiento-form.css'
})
export class MovimientoFormComponent {
  
  private fb = inject(FormBuilder);

  mostrarErrorStock = false;
  mostrarExito = false;
  intentoFallido = false;

  movimientoForm = this.fb.group({
    tipo: ['', Validators.required],
    categoria: ['', Validators.required],
    producto: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    observacion: ['']
  });

  isInvalidField(field: string): boolean {
    const control = this.movimientoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    this.mostrarErrorStock = false;
    this.mostrarExito = false;
    this.intentoFallido = false;

    if (this.movimientoForm.valid) {
      const formVal = this.movimientoForm.value;

      if (formVal.tipo === 'salida' && Number(formVal.cantidad) > 10) {
        this.mostrarErrorStock = true;
      } else {
        this.mostrarExito = true;
        console.log('Movimiento guardado:', formVal);
        
        this.movimientoForm.reset({ cantidad: 1, tipo: '', categoria: '', producto: '' });
      }
    } else {
      this.intentoFallido = true;
      this.movimientoForm.markAllAsTouched();
    }
  }
}