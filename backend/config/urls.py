from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('usuarios.urls')),
    path('api/v1/', include('catalogo.urls')),
    path('api/v1/movimientos/', include('movimientos.urls')),
]
