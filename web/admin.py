from django.contrib import admin
from .models import Flan, CartItem, ContactForm, Review

@admin.register(Flan)
class FlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_private', 'slug')
    list_filter = ('is_private',)
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'flan', 'quantity')
    list_filter = ('user',)

@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ('email', 'nombre')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('flan', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
