from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APITestCase

from .models import Categoria


class CategoriaModelTests(TestCase):
    def test_nombre_no_admite_solo_espacios(self):
        categoria = Categoria(nombre='   ')

        with self.assertRaises(ValidationError):
            categoria.full_clean()

    def test_nombre_es_unico_sin_distinguir_mayusculas(self):
        Categoria.objects.create(nombre='Procesadores')
        categoria = Categoria(nombre='procesadores')

        with self.assertRaises(ValidationError):
            categoria.full_clean()


class CategoriaApiTests(APITestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(
            nombre='Procesadores',
            descripcion='CPUs de escritorio.',
        )

    def test_lista_categorias(self):
        response = self.client.get('/api/v1/categorias/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Procesadores')
        self.assertEqual(response.data[0]['cantidad_productos'], 0)

    def test_crea_categoria(self):
        response = self.client.post(
            '/api/v1/categorias/',
            {'nombre': 'Almacenamiento', 'descripcion': 'SSD y HDD.'},
            format='json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['nombre'], 'Almacenamiento')

    def test_rechaza_categoria_repetida_sin_distinguir_mayusculas(self):
        response = self.client.post(
            '/api/v1/categorias/',
            {'nombre': 'procesadores'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('nombre', response.data)

    def test_actualiza_categoria(self):
        response = self.client.put(
            f'/api/v1/categorias/{self.categoria.id_categoria}/',
            {'nombre': 'Procesadores AMD', 'descripcion': 'CPUs AMD.'},
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nombre'], 'Procesadores AMD')

    def test_elimina_categoria_sin_productos(self):
        response = self.client.delete(
            f'/api/v1/categorias/{self.categoria.id_categoria}/'
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Categoria.objects.filter(pk=self.categoria.pk).exists())

    def test_devuelve_404_si_la_categoria_no_existe(self):
        response = self.client.get('/api/v1/categorias/9999/')

        self.assertEqual(response.status_code, 404)
