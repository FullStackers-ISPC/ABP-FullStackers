export interface Movimiento {
  id: number;
  fecha: string;
  producto: string;
  categoria: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  usuario: string;
}
