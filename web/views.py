from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from .models import Flan, CartItem, Review
from .forms import ContactFormForm, UserRegisterForm, ReviewForm

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
    flans = Flan.objects.filter(is_private=False).order_by('name')
    paginator = Paginator(flans, 10)  # Show 10 flans per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'flans_list.html', {'page_obj': page_obj})

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
    cart_items = CartItem.objects.filter(user=request.user).select_related('flan')
    cart_total = sum(item.flan.price * item.quantity for item in cart_items)  # Updated to use flan.price
    context = {
        'cart_items': cart_items,
        'cart_total': cart_total
    }
    return render(request, 'carrito.html', context)

@login_required
def add_to_cart(request, flan_id):
    flan = get_object_or_404(Flan, id=flan_id)
    cart_item, created = CartItem.objects.get_or_create(user=request.user, flan=flan)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    return redirect('carrito')

@login_required
def remove_from_cart(request, item_id):
    cart_item = get_object_or_404(CartItem, id=item_id, user=request.user)
    cart_item.delete()
    return redirect('carrito')

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = UserRegisterForm()
    return render(request, 'register.html', {'form': form})


def detalle_flan(request, flan_id):
    flan = get_object_or_404(Flan, id=flan_id)

    # Verificar permisos: flanes privados solo para usuarios autenticados
    if flan.is_private and not request.user.is_authenticated:
        from django.http import Http404
        raise Http404("Flan no encontrado")

    reviews = Review.objects.filter(flan=flan).select_related('user')
    if request.method == 'POST' and request.user.is_authenticated:
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.flan = flan
            review.user = request.user
            review.save()
            return redirect('detalle_flan', flan_id=flan.id)
    else:
        form = ReviewForm()
    return render(request, 'flan_detail.html', {'flan': flan, 'reviews': reviews, 'form': form})


@login_required
def reviews(request):
    user_reviews = Review.objects.filter(user=request.user).select_related('flan')
    return render(request, 'reviews.html', {'reviews': user_reviews})
