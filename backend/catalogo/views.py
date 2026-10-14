from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Categoria
from .serializers import CategoriaSerializer


class CategoriaListView(APIView):
    """Lista y crea categorías: /api/v1/categorias/."""

    def get(self, request):
        categorias = Categoria.objects.all()
        serializer = CategoriaSerializer(categorias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategoriaSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        categoria = serializer.save()
        return Response(
            CategoriaSerializer(categoria).data,
            status=status.HTTP_201_CREATED,
        )


class CategoriaDetailView(APIView):
    """Consulta, actualiza o elimina una categoría por identificador."""

    @staticmethod
    def get_categoria(pk):
        try:
            return Categoria.objects.get(pk=pk)
        except Categoria.DoesNotExist:
            return None

    def get(self, request, pk):
        categoria = self.get_categoria(pk)
        if categoria is None:
            return Response(
                {'detail': 'Categoría no encontrada.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(CategoriaSerializer(categoria).data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        categoria = self.get_categoria(pk)
        if categoria is None:
            return Response(
                {'detail': 'Categoría no encontrada.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CategoriaSerializer(categoria, data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        categoria = serializer.save()
        return Response(CategoriaSerializer(categoria).data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        categoria = self.get_categoria(pk)
        if categoria is None:
            return Response(
                {'detail': 'Categoría no encontrada.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if categoria.tiene_productos_asociados():
            return Response(
                {
                    'detail': (
                        'No se puede eliminar la categoría porque tiene productos asociados.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        categoria.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
