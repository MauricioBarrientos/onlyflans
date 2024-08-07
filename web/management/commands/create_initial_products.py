from django.core.management.base import BaseCommand
from web.models import Product

class Command(BaseCommand):
    help = 'Create initial products for testing'

    def handle(self, *args, **kwargs):
        products = [
            {'name': 'Flan Clásico', 'price': 1000.00},
            {'name': 'Flan de Coco', 'price': 3000.00},
            {'name': 'Flan de Queso', 'price': 2800.00},
        ]

        for product in products:
            Product.objects.create(**product)

        self.stdout.write(self.style.SUCCESS('Successfully created initial products'))
