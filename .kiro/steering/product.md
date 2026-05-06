---
inclusion: always
---

# Producto: Mi Recetario

App web local tipo libro de recetas. Funciona 100% en el navegador: sin backend, sin red, sin cuentas.

## Capacidades clave
- Crear, editar y eliminar recetas con título, descripción, categoría, tiempo, porciones, dificultad, ingredientes, pasos y foto.
- Persistencia local con IndexedDB (las imágenes se guardan como Data URLs).
- Filtro por categoría (entradas, principales, postres, bebidas, salsas) y búsqueda por título / descripción / ingredientes.
- Datos de prueba con recetas mexicanas que se siembran solo si la base está vacía.

## Principios de producto
- **Privacidad total**: nada sale del dispositivo del usuario.
- **Cero fricción**: abrir y empezar a cocinar; sin login, sin sincronización.
- **Idioma por defecto: español**. Los textos de UI van en español neutro.
- **Mobile-first**: el layout debe funcionar en pantallas pequeñas antes que en desktop.
