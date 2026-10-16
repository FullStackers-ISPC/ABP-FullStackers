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