# OnlyFlans

OnlyFlans es una aplicación web de e-commerce desarrollada con Django para la venta de flanes (postres tradicionales españoles). Permite a los usuarios navegar productos, agregar al carrito, dejar reseñas y contactar al administrador.

## Características

- **Catálogo de Productos**: Lista de flanes con imágenes, descripciones y precios.
- **Carrito de Compras**: Funcionalidad completa para agregar, ver y gestionar productos en el carrito.
- **Sistema de Reseñas**: Usuarios autenticados pueden dejar reseñas y calificaciones.
- **Autenticación de Usuarios**: Registro, login y logout con Django auth.
- **Productos Privados**: Algunos flanes solo visibles para usuarios registrados.
- **Formulario de Contacto**: Envío de mensajes al administrador.
- **Interfaz Responsiva**: Diseñada con Bootstrap 5 para dispositivos móviles y desktop.

## Tecnologías Utilizadas

- **Backend**: Django 4.2.24
- **Base de Datos**: SQLite (desarrollo), PostgreSQL (producción)
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Despliegue**: PythonAnywhere

## Instalación y Configuración

### Prerrequisitos

- Python 3.12+
- Git

### Pasos de Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/MauricioBarrientos/onlyflans.git
   cd onlyflans
   ```

2. **Crea un entorno virtual**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   ```

3. **Instala las dependencias**:
   ```bash
   pip install -r onlyfans/requirements.txt
   ```

4. **Configura las variables de entorno**:
   Crea un archivo `.env` en la raíz del proyecto:
   ```
   SECRET_KEY=tu_clave_secreta_aqui
   DEBUG=True  # False para producción
   ```

5. **Ejecuta las migraciones**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Crea un superusuario** (opcional):
   ```bash
   python manage.py createsuperuser
   ```

7. **Puebla datos iniciales**:
   ```bash
   python manage.py create_initial_products
   ```

8. **Ejecuta el servidor**:
   ```bash
   python manage.py runserver
   ```
   Visita `http://127.0.0.1:8000` en tu navegador.

## Uso

### Navegación
- **Inicio**: Lista productos públicos.
- **Bienvenido**: Productos privados (requiere login).
- **Flanes**: Lista completa de productos con paginación.
- **Carrito**: Gestiona productos seleccionados.
- **Contacto**: Envía mensajes.
- **Reseñas**: Ve y deja reseñas (requiere login).

### Administración
Accede a `/admin/` con credenciales de superusuario para gestionar modelos.

## Despliegue

### En PythonAnywhere

1. Crea una cuenta en PythonAnywhere.
2. Clona el repositorio en tu cuenta.
3. Configura el entorno virtual y instala dependencias.
4. Actualiza `settings.py`:
   - `DEBUG = False`
   - `ALLOWED_HOSTS = ['tu-usuario.pythonanywhere.com']`
   - `SECRET_KEY` desde variable de entorno.
5. Ejecuta migraciones y puebla datos.
6. Configura el WSGI file apuntando a `onlyfans.wsgi:application`.
7. Recarga la aplicación.

### Configuración de Producción

- Usa PostgreSQL en lugar de SQLite.
- Configura variables de entorno para secrets.
- Habilita HTTPS y configura headers de seguridad.
- Configura logging y monitoreo.

## Estructura del Proyecto

```
onlyflans/
├── onlyfans/              # Configuración principal de Django
│   ├── settings.py       # Configuraciones
│   ├── urls.py           # URLs principales
│   └── wsgi.py           # WSGI para despliegue
├── web/                   # Aplicación principal
│   ├── models.py         # Modelos de datos
│   ├── views.py          # Lógica de vistas
│   ├── forms.py          # Formularios
│   ├── admin.py          # Configuración de admin
│   ├── templates/        # Plantillas HTML
│   ├── static/           # Archivos estáticos
│   └── migrations/       # Migraciones de BD
├── db.sqlite3            # Base de datos (desarrollo)
├── manage.py             # Script de gestión de Django
├── requirements.txt      # Dependencias
└── README.md             # Este archivo
```

## Contribución

1. Fork el proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## Contacto

Mauricio Barrientos - [Tu email o contacto]

Proyecto Link: [https://github.com/MauricioBarrientos/onlyflans](https://github.com/MauricioBarrientos/onlyflans)