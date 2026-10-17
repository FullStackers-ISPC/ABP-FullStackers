from django.contrib import admin
from .models import Rol, Usuario

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ('id_rol', 'nombre')
    search_fields = ('nombre',)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id_usuario', 'email', 'nombre', 'apellido', 'id_rol', 'activo')
    list_filter = ('id_rol', 'activo')
    search_fields = ('email', 'nombre', 'apellido')