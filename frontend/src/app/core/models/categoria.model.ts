export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion?: string;
  cantidad_productos: number;
}

export type CategoriaPayload = Pick<Categoria, 'nombre' | 'descripcion'>;
