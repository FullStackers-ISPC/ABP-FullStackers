import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-user',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard-user.html',
  styleUrl: './dashboard-user.css'
})
export class DashboardUser {
  // uan variable booleana permite controlar el menu mobile
  // esta variable booleana controla la apertura y el cierre del sidebar mobile
  sidebarOpen = false;
  submitted = false;
  movementRegistered = false;

  // estos arreglos son datos estaticos de prueba, separados del HTML para renderizar listas dinamicamente
  readonly categories = [
    { id: 1, name: 'Tarjetas Gráficas', productCount: 6 },
    { id: 2, name: 'Procesadores', productCount: 5 },
    { id: 3, name: 'Almacenamiento', productCount: 4 },
    { id: 4, name: 'Memorias RAM', productCount: 3 },
    { id: 5, name: 'Placas Madre', productCount: 4 }
  ];

  readonly products = [
    { code: 1, status: 'Disponible', statusClass: 'badge-ok', name: 'NVIDIA RTX 4090 24GB', category: 'Tarjetas Gráficas', stock: 15 },
    { code: 2, status: 'Disponible', statusClass: 'badge-ok', name: 'Intel Core i9-14900K', category: 'Procesadores', stock: 10 },
    { code: 3, status: 'Disponible', statusClass: 'badge-ok', name: 'Samsung 990 Pro 2TB', category: 'Almacenamiento', stock: 20 },
    { code: 4, status: 'Alerta', statusClass: 'badge-alerta', name: 'XFX Radeon RX 9070 XT 16GB', category: 'Tarjetas Gráficas', stock: 3 },
    { code: 5, status: 'Disponible', statusClass: 'badge-ok', name: 'Corsair Vengeance 32GB DDR5', category: 'Memorias RAM', stock: 18 },
    { code: 6, status: 'Crítico', statusClass: 'badge-critico', name: 'AMD Ryzen 9 9950X', category: 'Procesadores', stock: 1 },
    { code: 7, status: 'Crítico', statusClass: 'badge-critico', name: 'AMD Ryzen 5 5500', category: 'Procesadores', stock: 1 },
    { code: 8, status: 'Disponible', statusClass: 'badge-ok', name: 'ASUS ROG Strix B650-E', category: 'Placas Madre', stock: 12 }
  ];

  readonly movementHistory = [
    { id: 1, date: '11/05/2026', product: 'NVIDIA RTX 4090 24GB', category: 'Tarjetas Gráficas', type: 'Entrada', typeClass: 'tipo-entrada', quantity: '+5', user: 'usuario' },
    { id: 2, date: '11/05/2026', product: 'Intel Core i9-14900K', category: 'Procesadores', type: 'Salida', typeClass: 'tipo-salida', quantity: '-2', user: 'usuario' },
    { id: 3, date: '10/05/2026', product: 'Samsung 990 Pro 2TB', category: 'Almacenamiento', type: 'Entrada', typeClass: 'tipo-entrada', quantity: '+10', user: 'usuario' },
    { id: 4, date: '10/05/2026', product: 'AMD Ryzen 5 5500', category: 'Procesadores', type: 'Ajuste', typeClass: 'tipo-ajuste', quantity: '-3', user: 'usuario' },
    { id: 5, date: '09/05/2026', product: 'Corsair Vengeance 32GB DDR5', category: 'Memorias RAM', type: 'Salida', typeClass: 'tipo-salida', quantity: '-4', user: 'usuario' },
    { id: 6, date: '09/05/2026', product: 'ASUS ROG Strix B650-E', category: 'Placas Madre', type: 'Entrada', typeClass: 'tipo-entrada', quantity: '+6', user: 'usuario' },
    { id: 7, date: '08/05/2026', product: 'XFX Radeon RX 9070 XT 16GB', category: 'Tarjetas Gráficas', type: 'Salida', typeClass: 'tipo-salida', quantity: '-1', user: 'usuario' },
    { id: 8, date: '08/05/2026', product: 'AMD Ryzen 9 9950X', category: 'Procesadores', type: 'Ajuste', typeClass: 'tipo-ajuste', quantity: '+2', user: 'usuario' }
  ];

  // formulario reactivo con validaciones para impedir datos incompletos
  readonly movementForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder) {
    this.movementForm = this.formBuilder.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      product: ['', Validators.required],
      // la cantidad es obligatoria y debe ser como minimo una unidad
      quantity: [null as number | null, [Validators.required, Validators.min(1)]],
      observation: ['']
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  onSubmit(): void {
    this.submitted = true;
    this.movementRegistered = false;

    if (this.movementForm.invalid) {
      this.movementForm.markAllAsTouched();
      return;
    }

    this.movementRegistered = true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.movementForm.get(controlName);
    return Boolean(control && control.invalid && (control.touched || this.submitted));
  }
}
