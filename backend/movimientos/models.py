
from django.db import models


class Movimiento(models.Model):

    class TipoMovimiento(models.TextChoices):
        ENTRADA = "entrada", "Entrada"
        SALIDA = "salida", "Salida"
        AJUSTE = "ajuste", "Ajuste"

    id_movimiento = models.AutoField(primary_key=True)

    fecha = models.DateTimeField(auto_now_add=True)

    tipo = models.CharField(
        max_length=20,
        choices=TipoMovimiento.choices
    )

    cantidad = models.IntegerField()

    producto = models.ForeignKey(
        "catalogo.Producto",
        on_delete=models.PROTECT,
        db_column="id_producto",
        related_name="movimientos"
    )

    usuario = models.ForeignKey(
        "usuarios.Usuario",
        on_delete=models.PROTECT,
        db_column="id_usuario",
        related_name="movimientos"
    )

    class Meta:
        db_table = "movimiento"
        ordering = ["-fecha"]

    def __str__(self):
        return (
            f"Movimiento {self.id_movimiento} - "
            f"{self.tipo} - {self.cantidad}"
        )
