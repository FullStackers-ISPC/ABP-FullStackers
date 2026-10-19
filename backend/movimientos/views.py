
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from catalogo.models import Producto
from usuarios.models import Usuario

from .models import Movimiento
from .serializers import MovimientoSerializer
from .services import registrar_movimiento


class MovimientoListaView(APIView):

    def get(self, request):
        movimientos = Movimiento.objects.select_related(
            "producto", "usuario"
        ).all()

        tipo = request.query_params.get("tipo")
        producto_id = request.query_params.get("producto")

        if tipo:
            movimientos = movimientos.filter(tipo=tipo)

        if producto_id:
            movimientos = movimientos.filter(
                producto_id=producto_id
            )

        serializer = MovimientoSerializer(
            movimientos,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = MovimientoSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        datos = serializer.validated_data

        producto = get_object_or_404(
            Producto,
            pk=datos["producto"].pk
        )

        usuario_id = request.data.get("usuario")

        if not usuario_id:
            return Response(
                {"usuario": "Debe indicar un usuario."},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = get_object_or_404(
            Usuario,
            pk=usuario_id
        )

        movimiento = registrar_movimiento(
            producto_id=producto.pk,
            usuario=usuario,
            tipo=datos["tipo"],
            cantidad=datos["cantidad"]
        )

        respuesta = MovimientoSerializer(movimiento)

        return Response(
            respuesta.data,
            status=status.HTTP_201_CREATED
        )


class MovimientoDetalleView(APIView):

    def get(self, request, pk):
        movimiento = get_object_or_404(
            Movimiento.objects.select_related(
                "producto", "usuario"
            ),
            pk=pk
        )

        serializer = MovimientoSerializer(movimiento)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
