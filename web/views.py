from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Flan, CartItem
from .forms import ContactFormForm, UserRegisterForm

def index(request):
    flanes_publicos = Flan.objects.filter(is_private=False)
    return render(request, 'index.html', {'flanes': flanes_publicos})

def about(request):
    return render(request, 'about.html')

@login_required
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
            form.save()
            return redirect('exito_contacto')
    else:
        form = ContactFormForm()
    return render(request, 'contacto.html', {'form': form})

def exito_contacto(request):
    return render(request, 'exito_contacto.html')

@login_required
def ver_carrito(request):
    cart_items = CartItem.objects.filter(user=request.user)
    cart_total = sum(item.product.price * item.quantity for item in cart_items)
    context = {
        'cart_items': cart_items,
        'cart_total': cart_total
    }
    return render(request, 'carrito.html', context)

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'register.html', {'form': form})

@login_required
def add_to_cart(request, product_id):
    product = Product.objects.get(id=product_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('carrito')

@login_required
def remove_from_cart(request, product_id):
    product = Product.objects.get(id=product_id)
    cart_item = CartItem.objects.filter(user=request.user, product=product)
    cart_item.delete()
    return redirect('carrito')
