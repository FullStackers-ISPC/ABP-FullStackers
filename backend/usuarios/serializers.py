from rest_framework import serializers
from .models import Rol, Usuario

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id_rol', 'nombre']


class UsuarioSerializer(serializers.ModelSerializer):
    rol_nombre = serializers.CharField(source='id_rol.nombre', read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario', 'username', 'email', 'nombre', 'apellido', 
            'id_rol', 'rol_nombre', 'ciudad', 'provincia', 'activo'
        ]
        read_only_fields = ['id']


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'nombre', 
            'apellido', 'ciudad', 'provincia', 'id_rol'
        ]

    def create(self, validated_data):
        usuario = Usuario(**validated_data)
        usuario.full_clean()
        usuario.save()
        return usuario
    