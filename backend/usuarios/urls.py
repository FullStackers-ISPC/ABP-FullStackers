from django.urls import path
from .views import RegistroAPIView, LoginAPIView, UsuarioDetalleView

urlpatterns = [
    path('registro/', RegistroAPIView.as_view(), name='auth-registro'),
    path('login/', LoginAPIView.as_view(), name='auth-login'),
    path('<int:pk>/', UsuarioDetalleView.as_view(), name='usuario-detalle'),
]
