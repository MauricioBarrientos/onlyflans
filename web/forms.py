from django import forms
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from .models import ContactForm, Review

class ContactFormForm(forms.ModelForm):
    class Meta:
        model = ContactForm
        fields = ['email', 'nombre', 'mensaje']
        labels = {
            'email': _('Correo electrónico'),
            'nombre': _('Nombre'),
            'mensaje': _('Mensaje'),
        }

class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput, label=_("Contraseña"))
    confirm_password = forms.CharField(widget=forms.PasswordInput, label=_("Confirmar contraseña"))

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        labels = {
            'username': _('Nombre de usuario'),
            'email': _('Correo electrónico'),
        }
        help_texts = {
            'username': _('Requerido. 150 caracteres o menos. Letras, dígitos y @/./+/-/_ únicamente.'),
        }

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            raise forms.ValidationError(_("Las contraseñas no coinciden."))

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])
        if commit:
            user.save()
        return user


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(choices=[(i, f'{i} estrella{"s" if i > 1 else ""}') for i in range(1, 6)]),
            'comment': forms.Textarea(attrs={'rows': 4}),
        }
        labels = {
            'rating': _('Calificación'),
            'comment': _('Comentario'),
        }
