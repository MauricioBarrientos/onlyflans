from django.contrib import admin
from django.urls import path
from web import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('acerca/', views.about, name='about'),
    path('bienvenido/', views.welcome, name='welcome'),
    path('flans/', views.flans_list, name='flans_list'),
    path('contacto/', views.contacto, name='contacto'),
    path('exito/', views.exito_contacto, name='exito_contacto'),
]
