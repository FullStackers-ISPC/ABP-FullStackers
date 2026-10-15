from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistroSerializer, UsuarioSerializer
from .models import Usuario

class RegistroAPIView(APIView):
    """
    POST /api/v1/usuarios/registro/
    """
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            try:
                usuario = serializer.save()
                return Response({
                    'id_usuario': usuario.id_usuario,
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
    POST /api/v1/usuarios/login/
    """
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {'error': 'Debe ingresar email y password.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email_normalizado = email.strip().lower()

        try:
            user = Usuario.objects.select_related('id_rol').get(
                email=email_normalizado,
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
            'nombre': user.nombre,
            'apellido': user.apellido,
            'email': user.email,
            'rol': user.id_rol.nombre
        }, status=status.HTTP_200_OK)


class UsuarioListaView(APIView):
    """
    GET /api/v1/usuarios/
    Lista todos los usuarios registrados.
    """
    def get(self, request):
        usuarios = Usuario.objects.select_related('id_rol').all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UsuarioDetalleView(APIView):
    """
    GET, PUT, DELETE /api/v1/usuarios/<pk>/
    Consulta, actualización y baja de un usuario puntual.
    """
    def get_object(self, pk):
        try:
            return Usuario.objects.select_related('id_rol').get(pk=pk)
        except Usuario.DoesNotExist:
            return None

    def get(self, request, pk):
        usuario = self.get_object(pk)
        if not usuario:
            return Response(
                {'error': 'Usuario no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        usuario = self.get_object(pk)
        if not usuario:
            return Response(
                {'error': 'Usuario no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = UsuarioSerializer(usuario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        usuario = self.get_object(pk)
        if not usuario:
            return Response(
                {'error': 'Usuario no encontrado.'},
                status=status.HTTP_404_NOT_FOUND
            )
        usuario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    