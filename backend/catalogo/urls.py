from django.urls import path

from .views import CategoriaDetailView, CategoriaListView

urlpatterns = [
    path('categorias/', CategoriaListView.as_view(), name='categoria-list'),
    path('categorias/<int:pk>/', CategoriaDetailView.as_view(), name='categoria-detail'),
]
