from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/productos/', include('catalogo.urls')), # Dentro vivira categorías: /api/v1/productos/categorias/ y sus endpoints
    path('api/v1/movimientos/', include('movimientos.urls')),
]
