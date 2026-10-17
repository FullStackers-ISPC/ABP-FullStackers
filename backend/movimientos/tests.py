
from decimal import Decimal

from django.test import TestCase
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase

from catalogo.models import Categoria, Producto
from usuarios.models import Rol, Usuario

from .models import Movimiento
from .services import registrar_movimiento


class MovimientoServiceTests(TestCase):

    def setUp(self):
        # Datos exclusivos de la base de pruebas
        self.rol = Rol.objects.create(
            nombre="admin"
        )

        self.usuario = Usuario.objects.create(
            nombre="Administrador",
            apellido="Prueba",
            email="admin@prueba.com",
            password="prueba1234",
            id_rol=self.rol
        )

        self.categoria = Categoria.objects.create(
            nombre="Perifericos"
        )

        self.producto = Producto.objects.create(
            codigo="TEC-001",
            nombre="Teclado Logitech",
            descripcion="Teclado USB",
            stock_actual=20,
            stock_alerta=10,
            stock_critico=5,
            precio=Decimal("15000.00"),
            categoria=self.categoria
        )

    def registrar(self, tipo, cantidad):
        return registrar_movimiento(
            producto_id=self.producto.pk,
            usuario=self.usuario,
            tipo=tipo,
            cantidad=cantidad
        )

    def test_entrada_incrementa_stock(self):
        movimiento = self.registrar("entrada", 10)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 30)
        self.assertEqual(movimiento.tipo, "entrada")
        self.assertEqual(movimiento.cantidad, 10)

    def test_salida_disminuye_stock(self):
        movimiento = self.registrar("salida", 5)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 15)
        self.assertEqual(movimiento.tipo, "salida")

    def test_salida_sin_stock_suficiente(self):
        with self.assertRaises(ValidationError):
            self.registrar("salida", 25)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 20)
        self.assertEqual(Movimiento.objects.count(), 0)

    def test_ajuste_positivo(self):
        self.registrar("ajuste", 3)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 23)

    def test_ajuste_negativo(self):
        self.registrar("ajuste", -4)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 16)

    def test_cantidad_cero_no_permitida(self):
        with self.assertRaises(ValidationError):
            self.registrar("entrada", 0)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 20)
        self.assertEqual(Movimiento.objects.count(), 0)

    def test_movimiento_guarda_usuario_y_producto(self):
        movimiento = self.registrar("entrada", 2)

        self.assertEqual(movimiento.usuario, self.usuario)
        self.assertEqual(movimiento.producto, self.producto)
        self.assertIsNotNone(movimiento.fecha)

class MovimientoAPITests(APITestCase):

    def setUp(self):
        self.rol = Rol.objects.create(
            nombre="Operador"
        )

        self.usuario = Usuario.objects.create(
            nombre="Usuario",
            apellido="Prueba",
            email="operador@prueba.com",
            password="prueba1234",
            id_rol=self.rol
        )

        self.categoria = Categoria.objects.create(
            nombre="Informatica"
        )

        self.producto = Producto.objects.create(
            codigo="MOU-001",
            nombre="Mouse USB",
            stock_actual=20,
            stock_alerta=10,
            stock_critico=5,
            precio=Decimal("8500.00"),
            categoria=self.categoria
        )

    def test_post_entrada(self):
        datos = {
            "tipo": "entrada",
            "cantidad": 10,
            "producto": self.producto.pk,
            "usuario": self.usuario.pk
        }

        response = self.client.post(
            "/api/v1/movimientos/",
            datos,
            format="json"
        )

        self.assertEqual(response.status_code, 201)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 30)
        self.assertEqual(Movimiento.objects.count(), 1)

        movimiento = Movimiento.objects.first()

        self.assertEqual(movimiento.usuario, self.usuario)
        self.assertEqual(movimiento.tipo, "entrada")

    def test_post_stock_insuficiente(self):
        datos = {
            "tipo": "salida",
            "cantidad": 25,
            "producto": self.producto.pk,
            "usuario": self.usuario.pk
        }

        response = self.client.post(
            "/api/v1/movimientos/",
            datos,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        self.producto.refresh_from_db()

        self.assertEqual(self.producto.stock_actual, 20)
        self.assertEqual(Movimiento.objects.count(), 0)

    def test_get_movimiento_inexistente(self):
        response = self.client.get(
            "/api/v1/movimientos/999999/"
        )

        self.assertEqual(response.status_code, 404)