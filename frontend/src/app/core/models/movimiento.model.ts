// modelo del recurso /movimientos en db.json
// representa la fila que se guarda en el historial del inventario y que luego se renderiza
// en el dashboard usuario y en los paneles admin
export interface Movimiento {
  id: number;
  fecha: string;
  producto: string;
  categoria: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  usuario: string;
  observacion?: string;
}
