# 📓 Personal Notebook

<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.16-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/JavaScript-Puro-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Sin%20Dependencias-Externas-4CAF50?style=for-the-badge" alt="No Dependencies">
  <img src="https://img.shields.io/badge/100%25-Local-2196F3?style=for-the-badge" alt="Local Only">
</p>

---

## 🚀 Introducción

**Personal Notebook** es una aplicación web de productividad personal completamente local, diseñada para gestionar notas, tareas, diarios y fragmentos de código en un solo lugar.

### Tecnologías

| Tecnología | Descripción |
|------------|-------------|
| **[Astro](https://astro.build/)** | Framework web moderno para sitios rápidos |
| **JavaScript Puro** | Sin React, Vue ni otras librerías de UI |
| **CSS Variables** | Sistema de temas dinámico sin preprocesadores |
| **LocalStorage** | Persistencia 100% local, sin servidor |

### Desarrollado con IA

Este proyecto fue desarrollado íntegramente utilizando **[Google Antigravity](https://antigravity.google/)**, un editor de código potenciado por IA de Google. La asistencia de IA permitió:

- Diseño de arquitectura de estado robusta
- Implementación de validación profunda de datos
- Sistema de temas con 13 paletas de colores
- Localización completa a español
- Métricas automáticas calculadas desde los datos

---

## ✨ Funcionalidades

### 📁 Workspaces
Organiza tu trabajo en espacios separados. Cada workspace puede contener múltiples agendas.

- Crear, renombrar y eliminar workspaces
- Cambiar entre workspaces con un clic
- Ver fecha de última actividad

### 📋 Agendas
Cada agenda es un contenedor completo con todas las herramientas:

| Módulo | Descripción |
|--------|-------------|
| **Notas** | Editor de notas con soporte de carpetas jerárquicas |
| **Tasks** | Tablero Kanban con columnas TO DO, IN PROGRESS, DONE |
| **Journal** | Diario personal con timeline visual |
| **Snippets** | Gestor de fragmentos de código con resaltado |
| **Métricas** | Dashboard de productividad automático |

---

## 📝 Notas

- **Crear notas** con título y contenido
- **Organizar en carpetas** con arrastrar y soltar
- **Búsqueda en tiempo real** por título o contenido
- **Breadcrumbs** para navegación jerárquica
- **Auto-guardado** mientras escribes
- **Editor Ultra-Ancho** (1000px) para máxima comodidad
- **Tarjetas Uniformes** con altura fija para orden visual
- **Interfaz Limpia** sin barras de desplazamiento visibles

---

## ✅ Tablero de Tareas (Kanban)

Sistema completo de gestión de tareas:

### Columnas
| Columna | Descripción |
|---------|-------------|
| **Backlog & Intake** | Cola de tareas pendientes |
| **TO DO** | Tareas listas para empezar |
| **IN PROGRESS** | Tareas en curso |
| **DONE** | Tareas completadas |

### Características
- **Prioridades**: Alta, Media, Baja (con colores)
- **Fechas de vencimiento** con indicador visual
- **Arrastrar y soltar** entre columnas
- **Finalizar tareas** (moverlas al archivo)
- **Papelera** con restauración posible
- **Edición modal** con todos los campos

---

## 📔 Journal (Diario)

Lleva un registro diario de tus pensamientos:

- **Timeline visual** con marcadores de tiempo
- **Múltiples journals** por agenda
- **Búsqueda** por contenido
- **Navegación** entre journals con flechas
- **Crear/Renombrar/Eliminar** journals

---

## 💻 Snippets (Código)

Guarda fragmentos de código reutilizables:

- **Título y descripción**
- **Lenguaje de programación** (JavaScript, Python, CSS, etc.)
- **Tags** para categorizar
- **Gestaor de Snippets** con diseño de tarjetas cuadradas uniformes
- **Vista Previa Inteligente** de 5 líneas de código
- **Copiar al portapapeles** con feedback visual
- **Editor Sólido** con área de código no redimensionable
- **Scroll Invisible** en previsualización y edición

---

## 📊 Métricas Automáticas

Dashboard de productividad **sin entrada manual**. Todas las métricas se calculan automáticamente desde tus datos:

| Métrica | Descripción |
|---------|-------------|
| **Tasa de Completado** | % de tareas done vs totales (con barra de progreso) |
| **Tareas Activas** | Número de tareas en "In Progress" |
| **Backlog Pendiente** | Tareas en la cola de entrada |
| **Tareas Atrasadas** | Tareas con fecha vencida no completadas |
| **Palabras en Journal** | Conteo total de palabras escritas |
| **Actividad (7 días)** | Elementos creados en la última semana |

### Gráficos Incluidos
- **Distribución de Tareas**: Gráfico de barras por columna
- **Lenguajes de Snippets**: Gráfico de donut

---

## 🎨 Sistema de Temas

Cambia la apariencia de toda la aplicación con un clic:

| Tema | Tipo | Descripción |
|------|------|-------------|
| 🌙 **Dark** | Oscuro | Tema por defecto, tonos índigo |
| ☀️ **Light** | Claro | Limpio y profesional |
| 🌊 **Ocean** | Claro | Tonos azul océano |
| 🌸 **Pastel** | Claro | Violetas y rosas suaves |
| 💎 **Ruby** | Oscuro | Acentos rojo rubí |
| 🌲 **Forest** | Oscuro | Verdes naturales |
| 🌅 **Sunset** | Claro | Naranjas cálidos |
| 🐉 **Yakuza** | Claro | Estética japonesa: blanco puro y rojo carmesí |
| 🚀 **Neon** | Oscuro | Cyberpunk: fondo negro y neones cyan/rosa |
| 🎃 **Halloween** | Oscuro | Negro, morado y naranja calabaza |
| 🎄 **Navidad** | Claro | Crema con rojo y verde festivo |
| 📽️ **Noir** | Mixto | Blanco y negro puro, alto contraste |
| 🌸 **Sakura** | Claro | Rosa suave con acentos fucsia |

### Mejoras UX
- **Interacción por Clic**: El selector ahora se abre al hacer clic, evitando cierres accidentales.
- **Indicador Dinámico**: El botón de tema muestra el color activo en tiempo real.

El tema seleccionado se guarda automáticamente y persiste entre sesiones.

---

## 💾 Importar / Exportar

### Exportar
- Genera un archivo `.json` con todo tu contenido
- Incluye workspaces, agendas, notas, tareas, journals y snippets
- Formato legible con indentación

### Importar
- Carga un backup previamente exportado
- **Validación profunda** de toda la estructura
- Mensajes de error claros si el archivo es inválido

---

## 🔒 Robustez y Seguridad de Datos

### Arquitectura de Validación

La aplicación implementa un sistema de **validación profunda multinivel** que garantiza la integridad de los datos:

```
State (raíz)
  ├── schemaVersion (debe ser 1)
  ├── workspaces[] ─────────────────┐
  │      ├── id (string 1-100)      │
  │      ├── name (max 200 chars)   │
  │      ├── createdAt (ISO 8601)   │
  │      └── agendas[] ─────────────┤
  │             ├── notes[]         │
  │             ├── tasks[]         │
  │             ├── journals[]      │
  │             ├── snippets[]      │
  │             └── columns[]       │
  └── activeWorkspaceId             │
      activeAgendaId ───────────────┘
                         (referencias validadas)
```

### Protecciones Implementadas

| Protección | Descripción |
|------------|-------------|
| ✅ Validación de tipos | Cada campo verifica su tipo (string, number, boolean, array) |
| ✅ Límites de longitud | Títulos max 500 chars, contenido max 100K chars |
| ✅ Valores enum | Prioridades y columnas solo aceptan valores válidos |
| ✅ Fechas ISO 8601 | Fechas inválidas se reemplazan automáticamente |
| ✅ IDs válidos | Strings de 1-100 caracteres |
| ✅ Referencias huérfanas | activeWorkspaceId/agendaId se resetean si no existen |
| ✅ Auto-reparación | Columnas Kanban por defecto si faltan |
| ✅ Migración legacy | Formatos antiguos se actualizan automáticamente |

### Manejo de Errores

| Escenario | Comportamiento |
|-----------|----------------|
| JSON inválido | Error claro: "El archivo no es JSON válido" |
| Schema incorrecto | Error: "Schema version mismatch" |
| Campo faltante | Auto-relleno con valor por defecto |
| Elemento corrupto | Se descarta y se loguea el error |
| LocalStorage lleno | Error capturado, no se pierde el estado actual |

### Inmutabilidad

El estado nunca se muta directamente. Cada actualización:
1. Clona el estado con `structuredClone()`
2. Aplica cambios al clon
3. Reemplaza el estado completo
4. Guarda en LocalStorage

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/
│   ├── AgendaView.astro      # Vista principal con tabs
│   ├── Journal.astro         # Módulo de diario
│   ├── MetricsDashboard.astro # Dashboard de métricas
│   ├── NoteEditor.astro      # Editor de notas
│   ├── SnippetManager.astro  # Gestor de snippets
│   ├── TaskBoard.astro       # Tablero Kanban
│   └── WorkspaceSelector.astro # Selector de workspace
├── layouts/
│   └── Layout.astro          # Layout principal
├── lib/
│   ├── actions/
│   │   ├── agendas.js        # CRUD de agendas
│   │   ├── journal.js        # CRUD de journals
│   │   ├── notes.js          # CRUD de notas
│   │   ├── snippets.js       # CRUD de snippets
│   │   ├── tasks.js          # CRUD de tareas
│   │   └── workspaces.js     # CRUD de workspaces
│   ├── persistence.js        # Validación y LocalStorage
│   └── store.js              # Estado global (Observer pattern)
├── pages/
│   └── index.astro           # Página principal
└── styles/
    └── global.css            # Sistema de temas y estilos
```

---

## 🚀 Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm run dev

# Construir para producción
pnpm run build
```

---

## 📦 Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| `astro` | ^5.16.6 | Framework web |

> **Nota**: Esta es la **única dependencia** del proyecto. Todo el resto está implementado con JavaScript puro.

---

## 🌐 Compatibilidad

| Navegador | Soporte |
|-----------|---------|
| Chrome 90+ | ✅ Completo |
| Firefox 90+ | ✅ Completo |
| Safari 15+ | ✅ Completo |
| Edge 90+ | ✅ Completo |

Requiere soporte para:
- `structuredClone()` (2022+)
- CSS Custom Properties
- LocalStorage
- ES Modules

---

<p align="center">
  <sub>Desarrollado con ❤️ y 🤖 Google Antigravity AI</sub>
</p>