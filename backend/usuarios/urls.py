from django.urls import path
from .views import RegistroAPIView, LoginAPIView, UsuarioDetalleView

urlpatterns = [
    path('auth/registro/', RegistroAPIView.as_view(), name='auth-registro'),
    path('auth/login/', LoginAPIView.as_view(), name='auth-login'),
    path('usuarios/<int:pk>/', UsuarioDetalleView.as_view(), name='usuario-detalle'),
]
