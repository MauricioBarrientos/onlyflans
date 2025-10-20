# OnlyFlans

OnlyFlans es una aplicación web de e-commerce desarrollada con Django para la venta de flanes (postres tradicionales españoles). Permite a los usuarios navegar productos, agregar al carrito, dejar reseñas y contactar al administrador.

## Características

### 🛒 Funcionalidades Core
- **Catálogo de Productos**: Lista de flanes con imágenes, descripciones y precios.
- **Carrito de Compras**: Funcionalidad completa para agregar, ver y gestionar productos en el carrito.
- **Sistema de Reseñas**: Usuarios autenticados pueden dejar reseñas y calificaciones.
- **Autenticación de Usuarios**: Registro, login y logout con Django auth.
- **Productos Privados**: Algunos flanes solo visibles para usuarios registrados.
- **Formulario de Contacto**: Envío de mensajes al administrador.

### 🎨 Experiencia de Usuario
- **Interfaz Premium**: Diseño elegante con paleta de colores cálidos inspirada en flanes.
- **Modales Interactivos**: Vista rápida de productos y carrito flotante.
- **Galerías de Imágenes**: Zoom y navegación de miniaturas.
- **Animaciones Suaves**: Transiciones y efectos visuales optimizados.
- **Responsive Design**: Optimizado para móviles, tablets y desktop.

### ⚡ Optimizaciones de Performance
- **Lazy Loading**: Carga diferida de imágenes para mejor velocidad.
- **Service Worker**: Cache offline básico para assets estáticos.
- **Critical CSS**: CSS crítico inline para carga más rápida.
- **Web Vitals**: Monitoreo de métricas de performance.
- **SEO Optimizado**: Meta tags, Schema.org y Open Graph.

### ♿ Accesibilidad
- **WCAG 2.1**: Cumple estándares de accesibilidad web.
- **Navegación por Teclado**: Soporte completo para navegación sin mouse.
- **Screen Readers**: Etiquetas ARIA y soporte para lectores de pantalla.
- **Modo Alto Contraste**: Soporte para preferencias de usuario.
- **Zoom Support**: Funciona correctamente con zoom del navegador.

## Tecnologías Utilizadas

### Backend
- **Django 4.2.24**: Framework web robusto y seguro
- **PostgreSQL**: Base de datos relacional para producción
- **SQLite**: Base de datos ligera para desarrollo

### Frontend
- **HTML5**: Semántico y accesible
- **CSS3**: Variables CSS, Grid, Flexbox, Animaciones
- **Bootstrap 5**: Framework responsive y moderno
- **JavaScript ES6+**: Interacciones dinámicas y optimizaciones

### Optimizaciones
- **Service Worker**: Cache offline para mejor UX
- **Lazy Loading**: Carga diferida de imágenes
- **Critical CSS**: CSS crítico inline para velocidad
- **Web Vitals**: Monitoreo de performance
- **SEO**: Schema.org, Open Graph, meta tags

### Despliegue
- **PythonAnywhere**: Plataforma recomendada
- **Docker**: Contenedorización opcional
- **WhiteNoise**: Servicio de archivos estáticos
- **Gunicorn**: WSGI server para producción

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

### 🚀 Despliegue en Producción

#### Opción 1: PythonAnywhere (Recomendado)

1. **Crea una cuenta** en [PythonAnywhere](https://www.pythonanywhere.com/).
2. **Clona el repositorio**:
   ```bash
   git clone https://github.com/MauricioBarrientos/onlyflans.git
   cd onlyflans
   ```
3. **Configura el entorno virtual**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r onlyfans/requirements.txt
   ```
4. **Configura variables de entorno**:
   Crea un archivo `.env`:
   ```
   SECRET_KEY=tu_clave_secreta_muy_segura_aqui
   DEBUG=False
   ADMIN_URL=admin-panel/
   ```
5. **Usa configuración de producción**:
   ```bash
   # En settings.py, importa configuración de producción
   from .settings_production import *
   ```
6. **Configura la base de datos** (PostgreSQL recomendado):
   ```bash
   # Actualiza DATABASES en settings_production.py con tus credenciales
   ```
7. **Ejecuta migraciones y datos iniciales**:
   ```bash
   python manage.py migrate
   python manage.py create_initial_products
   python manage.py collectstatic
   ```
8. **Configura WSGI**:
   - Apunta a `onlyfans.wsgi:application`
   - Asegúrate de que el path incluya el directorio del proyecto
9. **Configura dominio**:
   - Actualiza `ALLOWED_HOSTS` con tu dominio
   - Configura HTTPS (PythonAnywhere lo proporciona automáticamente)

#### Opción 2: VPS/Docker

1. **Instala Docker y Docker Compose**
2. **Clona y configura**:
   ```bash
   git clone https://github.com/MauricioBarrientos/onlyflans.git
   cd onlyflans
   cp .env.example .env
   # Edita .env con tus configuraciones
   ```
3. **Construye y ejecuta**:
   ```bash
   docker-compose up -d --build
   ```

### 🔧 Configuración de Producción

#### Variables de Entorno Requeridas
```bash
SECRET_KEY=clave-secreta-muy-segura
DEBUG=False
DB_NAME=onlyflans_prod
DB_USER=onlyflans_user
DB_PASSWORD=contraseña_segura
DB_HOST=localhost
DB_PORT=5432
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu-email@gmail.com
EMAIL_HOST_PASSWORD=app-password
ADMIN_URL=admin-panel/
```

#### Optimizaciones de Performance
- **WhiteNoise**: Archivos estáticos servidos eficientemente
- **PostgreSQL**: Base de datos robusta para producción
- **Redis Cache**: Implementa cache para mejor performance (opcional)
- **CDN**: Considera CloudFlare para assets estáticos

#### Monitoreo y Logging
- **Logs**: Configurados en `logs/django_error.log`
- **Admin**: Accesible en `/admin-panel/` (configurable)
- **Health Checks**: Endpoint básico en `/health/`

#### Seguridad
- **HTTPS**: Obligatorio en producción
- **Headers de Seguridad**: HSTS, XSS protection, CSP
- **Rate Limiting**: Implementa límites de requests
- **Backups**: Configura backups automáticos de BD

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

## 📊 Métricas y Monitoreo

### Performance Metrics
- **Lighthouse Score**: >90 en Performance, Accesibilidad, SEO
- **Core Web Vitals**: Monitoreo continuo de CLS, FID, LCP
- **Load Time**: <2 segundos para páginas principales
- **Bundle Size**: CSS y JS optimizados y minificados

### Monitoreo en Producción
- **Error Logging**: Logs automáticos en `logs/django_error.log`
- **Uptime Monitoring**: Verificación automática de salud
- **Performance Tracking**: Web Vitals reportados en consola
- **User Analytics**: Google Analytics integrado (opcional)

### Testing
- **Unit Tests**: 22 tests cubriendo modelos, vistas y formularios
- **Integration Tests**: Flujos completos de usuario validados
- **Cross-browser**: Testing en Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Optimizado para iOS Safari y Chrome Mobile

## 🤝 Contribución

### Guías de Desarrollo
- Sigue `CLAUDE.md` para estándares de código
- Usa branches feature para nuevas funcionalidades
- Commits convencionales: `feat:`, `fix:`, `docs:`, `style:`
- Pull requests requieren revisión y tests passing

### Configuración de Desarrollo
```bash
# Instalar dependencias de desarrollo
pip install -r requirements-dev.txt

# Ejecutar tests
python manage.py test

# Verificar calidad de código
python manage.py check
flake8 web/
black --check web/
```

## 📞 Contacto

**Mauricio Barrientos** - Full Stack Python Developer
- Email: [tu-email@ejemplo.com]
- LinkedIn: [Tu perfil]
- Portfolio: [Tu sitio web]

**Proyecto**: [https://github.com/MauricioBarrientos/onlyflans](https://github.com/MauricioBarrientos/onlyflans)

---

## 🎯 Roadmap Futuro

- [ ] **Pagos Integrados**: Stripe/PayPal para procesamiento de pagos
- [ ] **Multi-idioma**: Soporte para inglés y portugués
- [ ] **API REST**: Endpoints para app móvil
- [ ] **Dashboard Admin**: Analytics y gestión avanzada
- [ ] **PWA Features**: Notificaciones push y instalación
- [ ] **SEO Avanzado**: Rich snippets y search console

---

**⭐ Si te gusta este proyecto, considera darle una estrella en GitHub!**