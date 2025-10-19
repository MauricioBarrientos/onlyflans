from django.core.management.base import BaseCommand
from web.models import Flan

class Command(BaseCommand):
    help = 'Create initial flans for testing'

    def handle(self, *args, **kwargs):
        flans = [
            {'name': 'Flan Clásico', 'description': 'Delicioso flan tradicional', 'price': 1000.00, 'slug': 'flan-clasico'},
            {'name': 'Flan de Coco', 'description': 'Flan con sabor a coco', 'price': 3000.00, 'slug': 'flan-coco'},
            {'name': 'Flan de Queso', 'description': 'Flan cremoso de queso', 'price': 2800.00, 'slug': 'flan-queso'},
        ]

        for flan_data in flans:
            Flan.objects.get_or_create(**flan_data)

        self.stdout.write(self.style.SUCCESS('Successfully created initial flans'))
