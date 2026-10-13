from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError

class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'rol'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return self.nombre


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)

    solo_letras = RegexValidator(
        regex=r'^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$',
        message='Este campo solo puede contener letras.'
    )

    nombre = models.CharField(max_length=100, validators=[solo_letras])
    apellido = models.CharField(max_length=100, validators=[solo_letras])
    email = models.EmailField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    id_rol = models.ForeignKey(Rol, on_delete=models.PROTECT, db_column='id_rol')
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    provincia = models.CharField(max_length=100, blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'usuario'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def clean(self):
        super().clean()
        if self.email:
            self.email = self.email.lower().strip()
        if len(self.password) < 8:
            raise ValidationError({'password': 'La contraseña debe tener al menos 8 caracteres.'})

    def __str__(self):
        return f"{self.email} ({self.id_rol.nombre})"