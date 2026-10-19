from django.urls import path

from .views import CategoriaDetailView, CategoriaListView, ProductoDetailView, ProductoListView

urlpatterns = [
    path('categorias/', CategoriaListView.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categoria-detail'),
    path('', ProductoListView.as_view(), name='producto-list'),
    path('<int:pk>/', ProductoDetailView.as_view(), name='producto-detail'),
]
