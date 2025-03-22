from django.urls import path
from . import views

urlpatterns = [
    path('companies/', views.get_companies, name='get_companies'),
    path('upload_excel/', views.upload_excel, name='upload_excel'),
    path('update_company/<int:pk>/', views.update_company, name='update_company'),
    path('delete_company/<int:pk>/', views.delete_company, name='delete_company'),
    path('add_company/', views.add_company, name='add_company'),
    path('generate_data/', views.generate_data, name='generate_data'),
    path('stop_generation/', views.stop_generation_view, name='stop_generation'),
    path('stats/', views.get_stats, name='get_stats'),
]