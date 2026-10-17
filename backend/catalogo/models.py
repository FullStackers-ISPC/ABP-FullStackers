from decimal import Decimal
from django.core.validators import MinLengthValidator, MinValueValidator
from django.apps import apps
from django.core.exceptions import ValidationError
from django.db import models


class Categoria(models.Model):
    """Clasificación de los productos del inventario."""

    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categorias'
        ordering = ['nombre']
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def clean(self):
        super().clean()
        self.nombre = (self.nombre or '').strip()

        if not self.nombre:
            raise ValidationError({'nombre': 'El nombre no puede estar vacío.'})

        if not 3 <= len(self.nombre) <= 50:
            raise ValidationError({
                'nombre': 'El nombre debe tener entre 3 y 50 caracteres.'
            })

        repetida = Categoria.objects.filter(nombre__iexact=self.nombre).exclude(
            pk=self.pk
        )
        if repetida.exists():
            raise ValidationError({
                'nombre': 'Ya existe una categoría con ese nombre.'
            })

    def tiene_productos_asociados(self):
        """Consulta el modelo Producto cuando el módulo de Kevin esté integrado."""
        try:
            producto_model = apps.get_model('catalogo', 'Producto')
        except LookupError:
            return False

        return producto_model.objects.filter(categoria_id=self.pk).exists()

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    """Producto del inventario. Movimientos consulta y actualiza su stock."""

    id_producto = models.AutoField(primary_key=True)
    codigo = models.CharField(
        max_length=30, unique=True, validators=[MinLengthValidator(3)]
    )
    nombre = models.CharField(max_length=100, validators=[MinLengthValidator(3)])
    descripcion = models.CharField(max_length=255, blank=True, null=True)
    stock_actual = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    stock_alerta = models.IntegerField(validators=[MinValueValidator(0)])
    stock_critico = models.IntegerField(validators=[MinValueValidator(0)])
    precio = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))]
    )
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        db_column='id_categoria',
        related_name='productos',
    )
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'productos'
        ordering = ['nombre']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"