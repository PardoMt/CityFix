# CityFix — Taller Práctico Supabase + Docker + Jest E2E

Sistema de reporte de daños de infraestructura urbana.
Integra Supabase como backend serverless, Docker como entorno portable, y Jest para pruebas E2E con red real.

---

## Estructura del Proyecto

```
CityFixApp/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── src/
    └── utils/
        ├── reportEngine.js        ← Motor de conexión HTTP a Supabase
        └── reportEngine.test.js   ← Tests E2E con red real
```

---

## FASE 2 — Configuración de Supabase

### Paso 1: Crear la tabla con el SQL AI Editor

Ve a tu proyecto Supabase → **SQL Editor** → botón **"Ask AI"** y pega este prompt exacto:

```
Create a table called 'reports' for a city infrastructure damage app. It must have the following
columns: 'id' as a UUID and primary key (default gen_random_uuid()), 'title' as text, 'category' as
text (limited to 'Vías', 'Iluminación', 'Aseo'), 'votes' as integer (default 0), and 'created_at' as
timestamp with time zone (default now()). Disable RLS or create a public policy that allows
anyone to SELECT and INSERT data.
```

### Paso 2: SQL manual (alternativa si la IA falla)

Si el AI Editor no genera el SQL correcto, ejecuta este bloque directamente:

```sql
-- Crear la tabla reports
CREATE TABLE reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL CHECK (category IN ('Vías', 'Iluminación', 'Aseo')),
  votes       INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deshabilitar Row Level Security para acceso público
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- Alternativa: crear políticas públicas si prefieres mantener RLS activo
-- CREATE POLICY "allow_public_select" ON reports FOR SELECT USING (true);
-- CREATE POLICY "allow_public_insert" ON reports FOR INSERT WITH CHECK (true);
```

### Paso 3: Insertar 5 registros de ejemplo

Ve a **Table Editor** → tabla `reports` → botón **"Insert row"** e ingresa estos datos uno por uno:

| title                                          | category    | votes |
|------------------------------------------------|-------------|-------|
| Hueco profundo en la Calle 45 con Carrera 9    | Vías        | 3     |
| Poste de luz apagado en el Parque Principal    | Iluminación | 7     |
| Basura acumulada frente al CAI del barrio      | Aseo        | 5     |
| Andén destruido en la Avenida Caracas          | Vías        | 2     |
| Luminaria parpadeante en el semáforo peatonal  | Iluminación | 4     |

*(Los campos `id` y `created_at` se generan automáticamente — déjalos vacíos)*

### Paso 4: Obtener tus credenciales

Ve a **Project Settings** → **API** y copia:
- **Project URL** → ejemplo: `https://abcdefghij.supabase.co`
- **anon / public key** → empieza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## FASE 3 — Configurar credenciales en el proyecto

Edita `docker-compose.yml` y reemplaza los placeholders:

```yaml
environment:
  - SUPABASE_URL=https://TU_PROJECT_ID.supabase.co   # ← Tu URL real
  - SUPABASE_ANON_KEY=TU_ANON_KEY_PUBLICA            # ← Tu anon key real
```

---

## FASE 1 & 4 — Ejecutar el proyecto con Docker

### Construir e iniciar el contenedor

```bash
# Desde la carpeta CityFixApp/
docker-compose build
docker-compose run --rm cityfix npm test
```

### Ejecutar tests directamente (sin Docker)

```bash
# Instalar dependencias localmente
npm install

# Ejecutar los tests E2E
npm test
```

### Salida esperada en consola

```
PASS src/utils/reportEngine.test.js
  CityFix — Integración E2E con Supabase (Red Real)
    ✓ 1. La API responde con un array auténtico de JavaScript (432ms)
    ✓ 2. El array contiene al menos un registro (length > 0)
    ✓ 3. El primer reporte tiene las propiedades estructuradas correctamente
    ✓ 4. [Bonus] Muestra los reportes en consola para verificación

  ✅ Reportes recibidos desde Supabase:
  ┌─────────┬─────────────┬────────────────────────────────────────────┬─────────────┬───────┐
  │ (index) │ id          │ title                                      │ category    │ votes │
  ├─────────┼─────────────┼────────────────────────────────────────────┼─────────────┼───────┤
  │       0 │ a1b2c3d4... │ Hueco profundo en la Calle 45 con Carrera 9│ Vías        │     3 │
  └─────────┴─────────────┴────────────────────────────────────────────┴─────────────┴───────┘

Tests: 4 passed, 4 total
```

---

## Checklist de verificación final

- [ ] Tabla `reports` creada en Supabase con las 5 columnas correctas
- [ ] Constraint CHECK en `category` funcionando (solo acepta 'Vías', 'Iluminación', 'Aseo')
- [ ] RLS deshabilitado O políticas públicas creadas
- [ ] 5+ registros insertados desde el Table Editor
- [ ] `SUPABASE_URL` y `SUPABASE_ANON_KEY` configurados en `docker-compose.yml`
- [ ] `docker-compose build` ejecutado sin errores
- [ ] `npm test` pasa los 4 tests en verde ✅
