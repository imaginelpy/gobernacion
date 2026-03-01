# Prototipo: Panel de Datos para la Gobernación de Caazapá

Aplicación web móvil para cargar un archivo Excel y tener acceso rápido a:

- Filtros por distrito/tipo y buscador.
- Reportes de inversión, cantidad de acciones y beneficiarios.
- Gráficos automáticos.
- Carga manual de nuevos registros.
- Descarga del informe filtrado en Excel.
- Encabezado institucional con el logo oficial y paleta de colores basada en la identidad visual.

## Uso local

1. Abrir `index.html` en navegador **o** levantar servidor:

```bash
python3 -m http.server 4173
```

2. Ir a `http://localhost:4173`.
3. Cargar su Excel o usar **Cargar datos de ejemplo**.

## Logo institucional

Para mostrar el logo en el encabezado, colocar el archivo en:

- `assets/logo-gobernacion-caazapa.png`

Si no está presente, la aplicación sigue funcionando y oculta el espacio del logo automáticamente.

## Estructura esperada del Excel

Columnas recomendadas (primera fila como encabezados):

- `Distrito`
- `Tipo`
- `Descripcion`
- `Monto`
- `Fecha`
- `Beneficiarios`

## Publicación online rápida

Puede publicarse como sitio estático en:

- GitHub Pages
- Netlify
- Vercel

Solo subiendo estos archivos (`index.html`, `app.js`, `styles.css` y opcionalmente `assets/`) ya queda funcional.
