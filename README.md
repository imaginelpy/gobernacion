# Prototipo PWA - Gestión de Datos Departamentales (Caazapá)

Aplicación web progresiva (PWA) orientada a la Gobernación de Caazapá para:

- Cargar datos desde Excel (`.xlsx`)
- Filtrar por distrito, categoría y texto libre
- Ver indicadores (monto total, beneficiarios, total de acciones)
- Generar gráficos por distrito y categoría
- Registrar nuevos datos manualmente
- Descargar informe filtrado en CSV
- Usar desde móvil y modo instalable/offline básico

## Formato esperado del Excel

Primera hoja con columnas:

- `Fecha`
- `Distrito`
- `Categoria`
- `Descripcion`
- `Monto`
- `Beneficiarios`

## Ejecutar localmente

```bash
python3 -m http.server 8080
```

Abrir: `http://localhost:8080`

## Publicar online

Puede subirse directamente a:

- GitHub Pages
- Netlify
- Vercel (sitio estático)

