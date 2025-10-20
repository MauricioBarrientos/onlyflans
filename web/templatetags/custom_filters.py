from django import template

register = template.Library()

@register.filter
def multiply(value, arg):
    return value * arg

@register.filter(name='add_class')
def add_class(value, arg):
    return value.as_widget(attrs={'class': arg})