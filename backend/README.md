## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

2. Crear y activar un entorno virtual:

```bash
python -m venv env
```

**Windows:**

```bash
venv\Scripts\activate
```

**Linux/macOS:**

```bash
source venv/bin/activate
```

3. Instalar las dependencias:

```bash
pip install -r requirements.txt
```

4. Ejecutar las migraciones:

```bash
python manage.py migrate
```

5. Iniciar el servidor:

```bash
python manage.py runserver
```

La aplicación estará disponible en `http://127.0.0.1:8000/`.

## Productos

Base: `/api/v1/productos/`

| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| GET | `/api/v1/productos/` | Lista productos | 200 |
| POST | `/api/v1/productos/` | Crea un producto | 201, 400 |
| GET | `/api/v1/productos/{id}/` | Detalle | 200, 404 |
| PUT | `/api/v1/productos/{id}/` | Actualiza | 200, 400, 404 |
| DELETE | `/api/v1/productos/{id}/` | Elimina (400 si tiene movimientos) | 204, 400, 404 |

Campos: `codigo` (único, 3 a 30 caracteres), `nombre` (3 a 100), `descripcion` (opcional),
`stock_actual` (≥ 0), `stock_alerta` (≥ 0), `stock_critico` (≥ 0 y menor a `stock_alerta`),
`precio` (> 0) y `categoria` (id de una categoría existente).

Ejemplo de POST:

```json
{
  "codigo": "CPU-001",
  "nombre": "AMD Ryzen 7 9800X3D",
  "descripcion": "Procesador para gaming.",
  "stock_actual": 15,
  "stock_alerta": 10,
  "stock_critico": 5,
  "precio": "450.00",
  "categoria": 1
}
```

Ejemplo de error (400):

```json
{ "stock_critico": ["El stock crítico debe ser menor al stock de alerta."] }
```