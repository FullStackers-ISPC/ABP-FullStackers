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
            'id_usuario', 'email', 'nombre', 'apellido', 'password',
            'id_rol', 'rol_nombre', 'ciudad', 'provincia', 'activo'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = password
        instance.save()
        return instance


class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = [
            'email', 'password', 'nombre', 
            'apellido', 'ciudad', 'provincia', 'id_rol'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        usuario = Usuario(**validated_data)
        usuario.full_clean()
        usuario.save()
        return usuario
