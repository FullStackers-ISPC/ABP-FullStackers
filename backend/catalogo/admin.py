from django.contrib import admin

from .models import Categoria, Producto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id_categoria', 'nombre', 'fecha_creacion')
    search_fields = ('nombre',)

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id_producto', 'codigo', 'nombre', 'categoria', 'stock_actual', 'precio', 'activo')
    search_fields = ('codigo', 'nombre')
    list_filter = ('categoria', 'activo')