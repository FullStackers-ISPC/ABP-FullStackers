import { firstValueFrom, of, throwError } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { ProductosService } from './productos.service';
import { MovimientosService } from './movimientos.service';
import { Producto } from '../models/producto.model';
import { Movimiento } from '../models/movimiento.model';

describe('Servicio de Dashboard', () => {
  const producto: Producto = {
    id: 1, codigo: 'PR-001', nombre: 'Prueba', categoria: 'Prueba', idCategoria: 1,
    stock: 10, stockAlerta: 5, stockCritico: 2, precio: 10
  };

  function servicio(productos: Producto[], movimientos: Movimiento[]): DashboardService {
    return new DashboardService(
      { getProductos: () => of(productos) } as ProductosService,
      { getMovimientos: () => of(movimientos) } as MovimientosService
    );
  }

  it('debería contar todos los productos y distinguir stock crítico, bajo y disponible', async () => {
    const resultado = await firstValueFrom(servicio([
      producto,
      { ...producto, id: 2, stock: 5 },
      { ...producto, id: 3, stock: 2 },
      { ...producto, id: 4, stock: 0 }
    ], []).getDashboardData());
    expect(resultado.totalProducts).toBe(4);
    expect(resultado.availableProducts).toBe(3);
    expect(resultado.criticalStockProducts).toBe(2);
    expect(resultado.lowStockProducts.map(p => p.id)).toEqual([4, 3, 2]);
  });

  it('debería contar movimientos de hoy de todos los usuarios y descartar otras fechas', async () => {
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    const movimiento: Movimiento = {
      id: 1, fecha: hoy.toISOString(), producto: 'Prueba', categoria: 'Prueba',
      tipo: 'entrada', cantidad: 1, usuario: '1'
    };
    const resultado = await firstValueFrom(servicio([], [
      movimiento,
      { ...movimiento, id: 2, usuario: '2', fecha: hoy.toLocaleDateString('es-AR') },
      { ...movimiento, id: 3, fecha: ayer.toISOString() },
      { ...movimiento, id: 4, fecha: 'fecha inválida' }
    ]).getDashboardData());
    expect(resultado.movementsToday).toBe(2);
    expect(resultado.movements).toHaveLength(4);
  });

  it('debería devolver métricas en cero si no hay datos', async () => {
    const resultado = await firstValueFrom(servicio([], []).getDashboardData());
    expect(resultado.totalProducts).toBe(0);
    expect(resultado.criticalStockProducts).toBe(0);
    expect(resultado.lowStockProducts).toEqual([]);
  });

  it('debería propagar el error de la API', async () => {
    const error = new Error('API no disponible');
    const dashboard = new DashboardService(
      { getProductos: () => throwError(() => error) } as unknown as ProductosService,
      { getMovimientos: () => of([]) } as unknown as MovimientosService
    );
    await expect(firstValueFrom(dashboard.getDashboardData())).rejects.toBe(error);
  });
});
