import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  stockAlerta: number;
  stockCritico: number;
  precio: number;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private mockProductos: Producto[] = [
    { id: 1, nombre: 'AMD Ryzen 7 9800X3D', categoria: 'Procesadores', stock: 15, stockAlerta: 10, stockCritico: 5, precio: 450, descripcion: 'Procesador de alto rendimiento, especial para gaming con tecnología 3D V-Cache.' },
    { id: 2, nombre: 'Intel Core i7-14700K', categoria: 'Procesadores', stock: 12, stockAlerta: 10, stockCritico: 5, precio: 400 },
    { id: 3, nombre: 'AMD Ryzen 7 7700', categoria: 'Procesadores', stock: 9, stockAlerta: 5, stockCritico: 2, precio: 330 },
    { id: 4, nombre: 'XFX Radeon RX 9070 XT 16GB', categoria: 'Tarjetas Gráficas', stock: 3, stockAlerta: 5, stockCritico: 2, precio: 850, descripcion: 'Placa de video tope de gama, arquitectura RDNA 4 ideal para 4K.' },
    { id: 5, nombre: 'RTX 5070 Ti 16GB', categoria: 'Tarjetas Gráficas', stock: 11, stockAlerta: 10, stockCritico: 5, precio: 750 },
    { id: 6, nombre: 'RTX 5060 Ti 8GB', categoria: 'Tarjetas Gráficas', stock: 13, stockAlerta: 10, stockCritico: 5, precio: 400 },
    { id: 7, nombre: 'AMD Ryzen 5 5500', categoria: 'Procesadores', stock: 1, stockAlerta: 5, stockCritico: 2, precio: 100, descripcion: 'Procesador de entrada, excelente relación calidad-precio para presupuestos ajustados.' },
    { id: 8, nombre: 'Kingston Fury Beast DDR5 32GB', categoria: 'Memorias RAM', stock: 18, stockAlerta: 10, stockCritico: 5, precio: 120 },
    { id: 9, nombre: 'G.Skill Trident Z5 32GB', categoria: 'Memorias RAM', stock: 14, stockAlerta: 10, stockCritico: 5, precio: 135 },
    { id: 10, nombre: 'Corsair Vengeance DDR5 16GB', categoria: 'Memorias RAM', stock: 20, stockAlerta: 10, stockCritico: 5, precio: 65 },
    { id: 11, nombre: 'Corsair Vengeance DDR5 32GB 6000MHz', categoria: 'Memorias RAM', stock: 4, stockAlerta: 5, stockCritico: 2, precio: 140 },
    { id: 12, nombre: 'AMD Ryzen 9 9950X', categoria: 'Procesadores', stock: 1, stockAlerta: 5, stockCritico: 2, precio: 650, descripcion: 'La bestia del procesamiento multinúcleo para tareas de productividad pesada.' },
    { id: 13, nombre: 'Seagate Barracuda 4TB', categoria: 'Almacenamiento', stock: 6, stockAlerta: 10, stockCritico: 5, precio: 85 },
    { id: 14, nombre: 'WD Black SN850X 2TB', categoria: 'Almacenamiento', stock: 17, stockAlerta: 10, stockCritico: 5, precio: 160, descripcion: 'NVMe Gen4 de máxima velocidad, recomendado para el sistema operativo.' },
    { id: 15, nombre: 'Kingston NV3 1TB', categoria: 'Almacenamiento', stock: 21, stockAlerta: 10, stockCritico: 5, precio: 60 },
    { id: 16, nombre: 'AMD Radeon 6600XT 8GB', categoria: 'Tarjetas Gráficas', stock: 5, stockAlerta: 10, stockCritico: 2, precio: 240 },
    { id: 17, nombre: 'RTX 4060 8GB', categoria: 'Tarjetas Gráficas', stock: 16, stockAlerta: 10, stockCritico: 5, precio: 300 },
    { id: 18, nombre: 'RTX 4070 Super', categoria: 'Tarjetas Gráficas', stock: 10, stockAlerta: 5, stockCritico: 2, precio: 600 },
    { id: 19, nombre: 'Crucial P3 Plus 1TB', categoria: 'Almacenamiento', stock: 19, stockAlerta: 10, stockCritico: 5, precio: 55 },
    { id: 20, nombre: 'Samsung 990 PRO 2TB NVMe', categoria: 'Almacenamiento', stock: 1, stockAlerta: 5, stockCritico: 2, precio: 170 },
    { id: 21, nombre: 'Lexar NM790 2TB', categoria: 'Almacenamiento', stock: 13, stockAlerta: 10, stockCritico: 5, precio: 130 },
    { id: 22, nombre: 'AMD Ryzen 5 5600', categoria: 'Procesadores', stock: 7, stockAlerta: 10, stockCritico: 5, precio: 135 }
  ];

  constructor() {}

  getProductos(): Producto[] {
    return this.mockProductos;
  }

  getProductoById(id: number): Producto | undefined {
    return this.mockProductos.find(prod => prod.id === id);
  }
}