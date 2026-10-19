
from django.urls import path

from .views import (
    MovimientoListaView,
    MovimientoDetalleView,
)

urlpatterns = [
    path(
        "",
        MovimientoListaView.as_view(),
        name="movimientos-lista"
    ),
    path(
        "<int:pk>/",
        MovimientoDetalleView.as_view(),
        name="movimientos-detalle"
    ),
]
