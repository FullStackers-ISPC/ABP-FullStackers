from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistroSerializer

class RegistroAPIView(APIView):
    """
    POST /api/v1/auth/registro/
    """
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            try:
                usuario = serializer.save()
                return Response({
                    'id_usuario': usuario.id_usuario,
                    'username': usuario.username,
                    'email': usuario.email,
                    'nombre': usuario.nombre,
                    'apellido': usuario.apellido,
                    'rol': usuario.id_rol.nombre
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    