from django.db import models
from django.contrib.auth.models import User
import uuid

class Flan(models.Model):
    flan_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=64)
    description = models.TextField()
    image_url = models.URLField(default='https://upload.wikimedia.org/wikipedia/commons/6/64/Cr%C3%A8me_caramel_2.jpg')
    slug = models.SlugField(unique=True)
    is_private = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return self.name

# Remove Product model entirely

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    flan = models.ForeignKey(Flan, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.flan.name}"

class ContactForm(models.Model):
    email = models.EmailField()
    nombre = models.CharField(max_length=64)
    mensaje = models.TextField()

    def __str__(self):
        return self.email

class Review(models.Model):
    flan = models.ForeignKey(Flan, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review by {self.user} for {self.flan}'
