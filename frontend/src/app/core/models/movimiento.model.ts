
export type TipoMovimiento = 'entrada' | 'salida' | 'ajuste';

export interface Movimiento {
  id: number;
  fecha: string;
  producto: string;
  categoria: string;
  tipo: TipoMovimiento;
  cantidad: number;
  usuario: string;
  observacion?: string;
}

export interface MovimientoApi {
  id_movimiento: number;
  fecha: string;
  tipo: TipoMovimiento;
  cantidad: number;
  producto: number;
  usuario: number;
}

export interface MovimientoPayload {
  tipo: TipoMovimiento;
  cantidad: number;
  producto: number;
  usuario: number;
}
