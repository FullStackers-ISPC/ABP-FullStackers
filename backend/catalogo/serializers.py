from django.apps import apps
from rest_framework import serializers

from .models import Categoria


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
        categoria = Categoria(**attrs)
        if self.instance is not None:
            categoria.pk = self.instance.pk

        categoria.full_clean()
        return attrs

    def get_cantidad_productos(self, categoria):
        try:
            producto_model = apps.get_model('catalogo', 'Producto')
        except LookupError:
            return 0

        return producto_model.objects.filter(categoria_id=categoria.pk).count()
