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
