from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistroSerializer
from .models import Usuario

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

class LoginAPIView(APIView):
    """
    POST /api/v1/auth/login/
    """
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Debe ingresar username y password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = Usuario.objects.select_related('id_rol').get(
                username=username,
                password=password
            )
        except Usuario.DoesNotExist:
            return Response(
                {'error': 'Credenciales inválidas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.activo:
            return Response(
                {'error': 'El usuario se encuentra inactivo.'},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({
            'id_usuario': user.id_usuario,
            'username': user.username,
            'nombre': user.nombre,
            'apellido': user.apellido,
            'email': user.email,
            'rol': user.id_rol.nombre
        }, status=status.HTTP_200_OK)

    