
from rest_framework import serializers

from .models import Movimiento


class MovimientoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movimiento

        fields = [
            "id_movimiento",
            "fecha",
            "tipo",
            "cantidad",
            "producto",
            "usuario",
        ]

        read_only_fields = [
            "id_movimiento",
            "fecha",
            "usuario",
        ]

    def validate(self, attrs):
        tipo = attrs.get("tipo")
        cantidad = attrs.get("cantidad")

        if tipo in ("entrada", "salida") and cantidad <= 0:
            raise serializers.ValidationError({
                "cantidad": "La cantidad debe ser mayor a cero."
            })

        if tipo == "ajuste" and cantidad == 0:
            raise serializers.ValidationError({
                "cantidad": "El ajuste no puede ser cero."
            })

        return attrs
