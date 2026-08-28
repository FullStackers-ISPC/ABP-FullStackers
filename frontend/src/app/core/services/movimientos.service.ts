import { Injectable } from '@angular/core';

export interface Movimiento {
  id: number;
  fecha: string;
  producto: string;
  categoria: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  usuario: string;
}

@Injectable({
  providedIn: 'root' 
})
export class MovimientosService {
  
  private   mockMovimientos: Movimiento[] = [
    { 
      id: 1, 
      fecha: '11/05/2026', 
      producto: 'NVIDIA RTX 4090 24GB', 
      categoria: 'Tarjetas Gráficas', 
      tipo: 'entrada', 
      cantidad: 5, 
      usuario: 'usuario' 
    },
    { 
      id: 2, 
      fecha: '11/05/2026', 
      producto: 'Intel Core i9-14900K', 
      categoria: 'Procesadores', 
      tipo: 'salida', 
      cantidad: -2, 
      usuario: 'usuario' 
    },
    { 
      id: 3, 
      fecha: '10/05/2026', 
      producto: 'Samsung 990 Pro 2TB', 
      categoria: 'Almacenamiento', 
      tipo: 'entrada', 
      cantidad: 10, 
      usuario: 'usuario' 
    },
    { 
      id: 4, 
      fecha: '10/05/2026', 
      producto: 'AMD Ryzen 5 5500', 
      categoria: 'Procesadores', 
      tipo: 'ajuste', 
      cantidad: -3, 
      usuario: 'usuario' 
    },
    { 
      id: 5, 
      fecha: '09/05/2026', 
      producto: 'Corsair Vengeance 32GB DDR5', 
      categoria: 'Memorias RAM', 
      tipo: 'salida', 
      cantidad: -4, 
      usuario: 'usuario' 
    },
    { 
      id: 6, 
      fecha: '09/05/2026', 
      producto: 'ASUS ROG Strix B650-E', 
      categoria: 'Placas Madre', 
      tipo: 'entrada', 
      cantidad: 6, 
      usuario: 'usuario' 
    },
    { 
      id: 7, 
      fecha: '08/05/2026', 
      producto: 'XFX Radeon RX 9070 XT 16GB', 
      categoria: 'Tarjetas Gráficas', 
      tipo: 'salida', 
      cantidad: -1, 
      usuario: 'usuario' 
    },
    { 
      id: 8, 
      fecha: '08/05/2026', 
      producto: 'AMD Ryzen 9 9950X', 
      categoria: 'Procesadores', 
      tipo: 'ajuste', 
      cantidad: 2, 
      usuario: 'usuario' 
    }
  ];

  constructor() {}

  getMovimientos(): Movimiento[] {
    return this.mockMovimientos;
  }
}