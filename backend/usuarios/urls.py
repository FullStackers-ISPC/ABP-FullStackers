from django.urls import path
from .views import RegistroAPIView, LoginAPIView, UsuarioDetalleView, UsuarioListaView

urlpatterns = [
    path('', UsuarioListaView.as_view(), name='usuario-lista'),
    path('<int:pk>/', UsuarioDetalleView.as_view(), name='usuario-detalle'),
    path('registro/', RegistroAPIView.as_view(), name='auth-registro'),
    path('login/', LoginAPIView.as_view(), name='auth-login'),
]
