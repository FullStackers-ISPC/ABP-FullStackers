from django.urls import path
from .views import RegistroAPIView

urlpatterns = [
    path('registro/', RegistroAPIView.as_view(), name='auth-registro'),
]
