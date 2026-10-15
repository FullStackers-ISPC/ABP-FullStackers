// Forma que usa el frontend en todas las pantallas.
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  idCategoria: number;
  stock: number;
  stockAlerta: number;
  stockCritico: number;
  precio: number;
  descripcion?: string;
}

// Datos que se envían al crear o editar (sin id ni nombre de categoría).
export type ProductoPayload = Omit<Producto, 'id' | 'categoria'>;

// Forma que devuelve el backend (Django REST Framework).
export interface ProductoApi {
  id_producto: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  stock_actual: number;
  stock_alerta: number;
  stock_critico: number;
  precio: string;
  categoria: number;
  categoria_nombre: string;
  activo: boolean;
}