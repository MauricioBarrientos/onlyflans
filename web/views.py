from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from .models import Flan
from .forms import ContactFormForm
from .models import ContactForm

def index(request):
    flanes_publicos = Flan.objects.filter(is_private=False)
    return render(request, 'index.html', {'flanes': flanes_publicos})

def about(request):
    return render(request, 'about.html')

def welcome(request):
    flanes_privados = Flan.objects.filter(is_private=True)
    return render(request, 'welcome.html', {'flanes': flanes_privados})

def flans_list(request):
    flans = Flan.objects.all()
    return render(request, 'flans_list.html', {'flans': flans})

def contacto(request):
    if request.method == 'POST':
        form = ContactFormForm(request.POST)
        if form.is_valid():
            # Procesar el formulario si es válido
            # Por ejemplo, guardar en la base de datos
            form.save()
            # Redirigir al usuario a la vista de éxito
            return HttpResponseRedirect('/exito/')
    else:
        form = ContactFormForm()

    return render(request, 'contacto.html', {'form': form})

def exito_contacto(request):
    return render(request, 'exito_contacto.html')
