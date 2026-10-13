from django.urls import path
from .views import RegistroAPIView, LoginAPIView

urlpatterns = [
    path('registro/', RegistroAPIView.as_view(), name='auth-registro'),
    path('login/', LoginAPIView.as_view(), name='auth-login'),
]
