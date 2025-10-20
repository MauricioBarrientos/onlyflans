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
            Flan.objects.update_or_create(
                slug=flan_data['slug'],
                defaults=dict(flan_data, is_private=False)
            )

        self.stdout.write(self.style.SUCCESS('Successfully created or updated initial flans'))
