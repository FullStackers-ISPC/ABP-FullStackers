from decimal import Decimal

from rest_framework.test import APITestCase

from catalogo.models import Categoria, Producto
from movimientos.models import Movimiento
from usuarios.models import Rol, Usuario


class DashboardIntegracionTests(APITestCase):
    """verifica el flujo de API que consumen los dashboards en una base temporal"""

    def setUp(self):
        rol = Rol.objects.create(nombre='usuario')
        self.usuario = Usuario.objects.create(
            nombre='Usuario', apellido='Demo', email='user@easystock.com',
            password='user1234', id_rol=rol,
        )
        categoria = Categoria.objects.create(nombre='Periféricos')
        self.producto = Producto.objects.create(
            codigo='PR-001', nombre='Teclado de prueba', categoria=categoria,
            stock_actual=10, stock_alerta=5, stock_critico=2,
            precio=Decimal('100.00'),
        )

    def registrar(self, tipo, cantidad):
        return self.client.post('/api/v1/movimientos/', {
            'tipo': tipo, 'cantidad': cantidad,
            'producto': self.producto.pk, 'usuario': self.usuario.pk,
        }, format='json')

    def comprobar_stock(self, esperado):
        respuesta = self.client.get(f'/api/v1/productos/{self.producto.pk}/')
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data['stock_actual'], esperado)

    def test_login_entrada_salida_ajuste_e_historial(self):
        login = self.client.post('/api/v1/usuarios/login/', {
            'email': 'user@easystock.com', 'password': 'user1234',
        }, format='json')
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.data['id_usuario'], self.usuario.pk)
        self.assertEqual(login.data['rol'], 'usuario')

        for tipo, cantidad, stock in [
            ('entrada', 3, 13), ('salida', 8, 5), ('ajuste', -3, 2),
        ]:
            with self.subTest(tipo=tipo):
                respuesta = self.registrar(tipo, cantidad)
                self.assertEqual(respuesta.status_code, 201)
                self.assertEqual(respuesta.data['usuario'], self.usuario.pk)
                self.assertIn('id_movimiento', respuesta.data)
                self.assertIn('fecha', respuesta.data)
                self.comprobar_stock(stock)

        historial = self.client.get('/api/v1/movimientos/')
        self.assertEqual(historial.status_code, 200)
        self.assertEqual(len(historial.data), 3)
        self.assertEqual({m['tipo'] for m in historial.data}, {'entrada', 'salida', 'ajuste'})
        catalogo = self.client.get('/api/v1/productos/')
        self.assertEqual(catalogo.status_code, 200)
        self.assertEqual(catalogo.data[0]['categoria_nombre'], 'Periféricos')
        self.assertEqual(catalogo.data[0]['stock_actual'], 2)

    def test_rechazo_por_stock_insuficiente_no_altera_inventario_ni_historial(self):
        respuesta = self.registrar('salida', 11)
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn('Stock insuficiente', str(respuesta.data))
        self.comprobar_stock(10)
        self.assertEqual(Movimiento.objects.count(), 0)

    def test_cors_permite_el_origen_de_angular(self):
        respuesta = self.client.options(
            '/api/v1/movimientos/',
            HTTP_ORIGIN='http://localhost:4200',
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type',
        )
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta['Access-Control-Allow-Origin'], 'http://localhost:4200')
