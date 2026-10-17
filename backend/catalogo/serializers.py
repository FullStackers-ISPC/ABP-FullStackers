from django.apps import apps
from rest_framework import serializers

from .models import Categoria, Producto


class CategoriaSerializer(serializers.ModelSerializer):
    cantidad_productos = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Categoria
        fields = [
            'id_categoria',
            'nombre',
            'descripcion',
            'fecha_creacion',
            'cantidad_productos',
        ]
        read_only_fields = ['id_categoria', 'fecha_creacion', 'cantidad_productos']

    def validate(self, attrs):
        categoria = self.instance or Categoria()
        for campo, valor in attrs.items():
            setattr(categoria, campo, valor)

        categoria.full_clean()
        return attrs

    def get_cantidad_productos(self, categoria):
        try:
            producto_model = apps.get_model('catalogo', 'Producto')
        except LookupError:
            return 0

        return producto_model.objects.filter(categoria_id=categoria.pk).count()

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = [
            'id_producto', 'codigo', 'nombre', 'descripcion',
            'stock_actual', 'stock_alerta', 'stock_critico', 'precio',
            'categoria', 'categoria_nombre', 'activo',
            'fecha_creacion', 'fecha_actualizacion',
        ]
        read_only_fields = ['id_producto', 'fecha_creacion', 'fecha_actualizacion']

    def validate(self, attrs):
        alerta = attrs.get('stock_alerta', getattr(self.instance, 'stock_alerta', None))
        critico = attrs.get('stock_critico', getattr(self.instance, 'stock_critico', None))
        if alerta is not None and critico is not None and critico >= alerta:
            raise serializers.ValidationError({
                'stock_critico': 'El stock crítico debe ser menor al stock de alerta.'
            })
        return attrs