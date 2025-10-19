from django.test import TestCase, override_settings
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Flan, CartItem, ContactForm, Review
from .forms import ContactFormForm, UserRegisterForm, ReviewForm


class FlanModelTest(TestCase):
    def test_flan_creation(self):
        flan = Flan.objects.create(
            name="Flan de Prueba",
            description="Descripción de prueba",
            price=1000.00,
            slug="flan-prueba"
        )
        self.assertEqual(flan.name, "Flan de Prueba")
        self.assertEqual(str(flan), "Flan de Prueba")
        self.assertEqual(flan.price, 1000.00)

    def test_flan_private(self):
        public_flan = Flan.objects.create(name="Público", is_private=False, slug="publico")
        private_flan = Flan.objects.create(name="Privado", is_private=True, slug="privado")
        public_flans = Flan.objects.filter(is_private=False)
        private_flans = Flan.objects.filter(is_private=True)
        self.assertIn(public_flan, public_flans)
        self.assertIn(private_flan, private_flans)


class CartItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.flan = Flan.objects.create(name="Flan Test", price=500.00, slug="flan-test")

    def test_cart_item_creation(self):
        cart_item = CartItem.objects.create(user=self.user, flan=self.flan, quantity=2)
        self.assertEqual(cart_item.quantity, 2)
        self.assertEqual(str(cart_item), "2 x Flan Test")


class ContactFormModelTest(TestCase):
    def test_contact_form_creation(self):
        contact = ContactForm.objects.create(
            email="test@example.com",
            nombre="Test User",
            mensaje="Mensaje de prueba"
        )
        self.assertEqual(contact.email, "test@example.com")
        self.assertEqual(str(contact), "test@example.com")


class ReviewModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='reviewer', password='12345')
        self.flan = Flan.objects.create(name="Flan Review", slug="flan-review")

    def test_review_creation(self):
        review = Review.objects.create(
            flan=self.flan,
            user=self.user,
            rating=5,
            comment="Excelente flan"
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(str(review), f"Review by {self.user} for {self.flan}")


class ContactFormFormTest(TestCase):
    def test_valid_form(self):
        form_data = {
            'email': 'test@example.com',
            'nombre': 'Test User',
            'mensaje': 'Mensaje válido'
        }
        form = ContactFormForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_invalid_form(self):
        form_data = {
            'email': 'invalid-email',
            'nombre': '',
            'mensaje': ''
        }
        form = ContactFormForm(data=form_data)
        self.assertFalse(form.is_valid())


class UserRegisterFormTest(TestCase):
    def test_valid_registration(self):
        form_data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        }
        form = UserRegisterForm(data=form_data)
        self.assertTrue(form.is_valid())

    def test_password_mismatch(self):
        form_data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123',
            'confirm_password': 'different'
        }
        form = UserRegisterForm(data=form_data)
        self.assertFalse(form.is_valid())


class ReviewFormTest(TestCase):
    def setUp(self):
        self.flan = Flan.objects.create(name="Flan Form", slug="flan-form")

    def test_valid_review_form(self):
        form_data = {
            'flan': self.flan.id,
            'rating': 4,
            'comment': 'Buen flan'
        }
        form = ReviewForm(data=form_data)
        self.assertTrue(form.is_valid())


@override_settings(SECURE_SSL_REDIRECT=False)
class ViewTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.flan = Flan.objects.create(
            name="Flan View",
            description="Descripción",
            price=1000.00,
            slug="flan-view",
            is_private=False
        )

    def test_index_view(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Flan View")

    def test_flan_detail_view(self):
        response = self.client.get(reverse('detalle_flan', args=[self.flan.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Flan View")

    def test_flans_list_view(self):
        response = self.client.get(reverse('flans_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Flan View")

    def test_contact_view_get(self):
        response = self.client.get(reverse('contacto'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'contacto.html')

    def test_contact_view_post_valid(self):
        form_data = {
            'email': 'contact@example.com',
            'nombre': 'Contact User',
            'mensaje': 'Mensaje de contacto'
        }
        response = self.client.post(reverse('contacto'), form_data)
        self.assertRedirects(response, reverse('exito_contacto'))
        self.assertEqual(ContactForm.objects.count(), 1)

    def test_add_to_cart_view(self):
        self.client.login(username='testuser', password='12345')
        response = self.client.post(reverse('add_to_cart', args=[self.flan.id]))
        self.assertRedirects(response, reverse('carrito'))
        self.assertEqual(CartItem.objects.count(), 1)

    def test_cart_view_authenticated(self):
        self.client.login(username='testuser', password='12345')
        CartItem.objects.create(user=self.user, flan=self.flan, quantity=1)
        response = self.client.get(reverse('carrito'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Flan View")

    def test_register_view_get(self):
        response = self.client.get(reverse('register'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'register.html')

    def test_register_view_post_valid(self):
        form_data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        }
        response = self.client.post(reverse('register'), form_data)
        self.assertRedirects(response, reverse('login'))
        self.assertEqual(User.objects.count(), 2)  # Including setUp user

    def test_reviews_view_authenticated(self):
        self.client.login(username='testuser', password='12345')
        Review.objects.create(flan=self.flan, user=self.user, rating=5, comment="Test review")
        response = self.client.get(reverse('reviews'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Test review")


@override_settings(SECURE_SSL_REDIRECT=False)
class IntegrationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='integration', password='12345')
        self.flan = Flan.objects.create(
            name="Flan Integration",
            description="Descripción",
            price=2000.00,
            slug="flan-integration",
            is_private=False
        )

    def test_full_purchase_flow(self):
        # Register
        register_data = {
            'username': 'buyer',
            'email': 'buyer@example.com',
            'password': 'password123',
            'confirm_password': 'password123'
        }
        self.client.post(reverse('register'), register_data)

        # Login
        self.client.login(username='buyer', password='password123')

        # Browse products
        response = self.client.get(reverse('index'))
        self.assertContains(response, "Flan Integration")

        # View product detail
        response = self.client.get(reverse('detalle_flan', args=[self.flan.id]))
        self.assertContains(response, "Flan Integration")

        # Add to cart
        response = self.client.post(reverse('add_to_cart', args=[self.flan.id]))
        self.assertRedirects(response, reverse('carrito'))

        # Check cart
        response = self.client.get(reverse('carrito'))
        self.assertContains(response, "Flan Integration")
        self.assertContains(response, "2000")

        # Leave review
        review_data = {
            'rating': 5,
            'comment': 'Excelente producto'
        }
        response = self.client.post(reverse('detalle_flan', args=[self.flan.id]), review_data)
        self.assertEqual(Review.objects.count(), 1)

    def test_contact_flow(self):
        contact_data = {
            'email': 'contact@example.com',
            'nombre': 'Contact Test',
            'mensaje': 'Mensaje de prueba'
        }
        response = self.client.post(reverse('contacto'), contact_data)
        self.assertRedirects(response, reverse('exito_contacto'))
        self.assertEqual(ContactForm.objects.count(), 1)

        # Check success page
        response = self.client.get(reverse('exito_contacto'))
        self.assertEqual(response.status_code, 200)
