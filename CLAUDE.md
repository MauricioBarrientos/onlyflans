# CLAUDE.md - Guías del Proyecto OnlyFlans

Este documento define las guías específicas para el desarrollo del proyecto OnlyFlans, incluyendo estándares de código, estructura del proyecto y requisitos personalizados.

## Estándares de Código

### Python/Django
- **PEP 8**: Seguir las guías de estilo Python.
- **Longitud de línea**: Máximo 88 caracteres (Black compatible).
- **Imports**: Ordenar alfabéticamente, con imports estándar primero, luego de terceros, luego locales.
- **Docstrings**: Usar formato Google para funciones y clases.
- **Nombres**: Usar snake_case para variables/funciones, CamelCase para clases.

### HTML/CSS
- **Indentación**: 2 espacios para HTML, 4 para CSS.
- **Clases CSS**: Usar kebab-case (e.g., `btn-primary`).
- **Accesibilidad**: Incluir atributos `alt` en imágenes, labels en formularios.
- **Bootstrap**: Usar clases de Bootstrap 5 para consistencia.

### JavaScript (futuro)
- **ES6+**: Usar sintaxis moderna.
- **Linting**: ESLint con configuración estándar.

## Estructura del Proyecto

### Directorios
```
onlyflans/
├── onlyfans/              # Configuración Django
├── web/                   # App principal
│   ├── migrations/        # Solo archivos de migración
│   ├── templates/web/     # Plantillas por app
│   └── static/web/        # Archivos estáticos por app
├── staticfiles/           # Archivos recolectados (producción)
├── media/                 # Archivos subidos por usuarios (futuro)
└── docs/                  # Documentación adicional
```

### Archivos Importantes
- `project-state.md`: Estado actual del proyecto y tareas pendientes.
- `requirements.txt`: Dependencias con versiones fijas.
- `.env`: Variables de entorno (no commitear).

## Requisitos Personalizados

### Idioma y Localización
- **Idioma principal**: Español.
- **Configuración**: `LANGUAGE_CODE = 'es'` en settings.py.
- **Mensajes**: Todos los textos de usuario en español.
- **Moneda**: Pesos chilenos ($) para precios.

### Lógica de Flanes
- **Productos públicos**: `is_private = False`, visibles sin login.
- **Productos privados**: `is_private = True`, solo para usuarios autenticados.
- **Carrito**: Vinculado a usuario, persiste sesiones.
- **Reseñas**: Solo usuarios autenticados, 1-5 estrellas con comentario.
- **Slugs únicos**: Generar automáticamente para URLs amigables.

### Seguridad
- **SECRET_KEY**: Siempre desde variable de entorno.
- **DEBUG**: False en producción.
- **HTTPS**: Obligatorio en producción.
- **Headers de seguridad**: HSTS, XSS protection, etc.
- **Validación**: Sanitizar todas las entradas de usuario.

### Rendimiento
- **Paginación**: 10 elementos por página en listas.
- **Consultas optimizadas**: Usar `select_related` y `prefetch_related`.
- **Caché**: Implementar para datos estáticos (futuro).
- **Imágenes**: Optimizar tamaños y formatos.

## Flujo de Desarrollo

### Commits
- **Mensaje**: "tipo: descripción breve" (e.g., "feat: agregar paginación a flanes").
- **Tipos**: feat, fix, docs, style, refactor, test, chore.
- **Frecuencia**: Commits pequeños y frecuentes.

### Branches
- `main`: Código de producción.
- `develop`: Desarrollo activo.
- `feature/nombre`: Nuevas funcionalidades.
- `hotfix/nombre`: Corrección urgente.

### Testing
- **Unidades**: Modelos, forms, views.
- **Integración**: Flujos completos (registro → compra).
- **Aceptación**: Pruebas manuales de UX.
- **Cobertura**: Mínimo 80%.

## Dependencias y Versiones

### Obligatorias
- Django==4.2.24 (seguridad actualizada)
- Bootstrap==5.0.2

### Futuras
- django-redis: Para caché.
- django-storages: Para archivos en cloud.
- Stripe: Para pagos.

## Configuración por Entorno

### Desarrollo
```python
DEBUG = True
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': 'db.sqlite3'}}
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
```

### Producción
```python
DEBUG = False
DATABASES = {'default': {'ENGINE': 'django.db.backends.postgresql', ...}}
ALLOWED_HOSTS = ['tu-dominio.com']
SECRET_KEY = os.environ['SECRET_KEY']
```

## Manejo de Errores

### Vistas
- Usar `get_object_or_404` para objetos no encontrados.
- Manejar excepciones con try-except.
- Mostrar mensajes de error amigables al usuario.

### Templates
- Usar `{% if %}` para verificar existencia de datos.
- Incluir bloques de error en formularios.

### Logs
- Configurar logging en settings.py.
- Niveles: DEBUG (dev), WARNING (prod).
- Archivo: `logs/django.log`.

## Mejores Prácticas

### Modelos
- Usar managers personalizados para consultas complejas.
- Validaciones en `clean()` methods.
- Índices en campos frecuentemente consultados.

### Vistas
- Mantener lógica simple; delegar a managers/forms.
- Usar decoradores para autenticación.
- Paginación en listas grandes.

### Templates
- Heredar de `base.html`.
- Usar `{% load static %}` para archivos.
- Minimizar lógica; usar context processors.

### Admin
- Personalizar list_display, search_fields, filters.
- Usar inlines para relaciones.

## Métricas de Calidad

- **Complejidad ciclomática**: < 10 por función.
- **Duplicación de código**: < 5%.
- **Tiempo de respuesta**: < 2s para páginas.
- **Puntuación Lighthouse**: > 90 en performance/accesibilidad.

## Contacto y Soporte

Para preguntas sobre estas guías, contactar al maintainer del proyecto.

---

*Última actualización: Octubre 2025*