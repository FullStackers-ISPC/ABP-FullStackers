
from django.db import transaction
from rest_framework.exceptions import ValidationError

from catalogo.models import Producto
from .models import Movimiento


@transaction.atomic
def registrar_movimiento(*, producto_id, usuario, tipo, cantidad):

    producto = Producto.objects.select_for_update().get(
        pk=producto_id
    )

    if not producto.activo:
        raise ValidationError({
            "producto": "El producto está inactivo."
        })

    if tipo not in Movimiento.TipoMovimiento.values:
        raise ValidationError({
            "tipo": "Tipo de movimiento inválido."
        })

    if tipo in ("entrada", "salida") and cantidad <= 0:
        raise ValidationError({
            "cantidad": "La cantidad debe ser mayor a cero."
        })

    if tipo == "ajuste" and cantidad == 0:
        raise ValidationError({
            "cantidad": "El ajuste no puede ser cero."
        })

    stock_anterior = producto.stock_actual

    if tipo == "entrada":
        stock_nuevo = stock_anterior + cantidad

    elif tipo == "salida":
        stock_nuevo = stock_anterior - cantidad

    else:
        stock_nuevo = stock_anterior + cantidad

    if stock_nuevo < 0:
        raise ValidationError({
            "cantidad": (
                f"Stock insuficiente. "
                f"Stock actual: {stock_anterior}"
            )
        })

    producto.stock_actual = stock_nuevo
    producto.save(update_fields=["stock_actual", "fecha_actualizacion"])

    movimiento = Movimiento.objects.create(
        producto=producto,
        usuario=usuario,
        tipo=tipo,
        cantidad=cantidad,
    )

    return movimiento
