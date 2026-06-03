// ============================================================
// CityFix — src/utils/reportEngine.js
// Motor de conexión a Supabase usando fetch nativo de Node 20
// ============================================================

// ── Credenciales de tu proyecto Supabase ─────────────────────
// En producción estas vendrían de variables de entorno.
// Reemplaza con los valores reales de tu proyecto Supabase.
const SUPABASE_URL = process.env.SUPABASE_URL || "https://TU_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "TU_ANON_KEY_PUBLICA";

/**
 * Obtiene todos los reportes de daños desde Supabase.
 *
 * Regla de Oro: el endpoint apunta directamente a /rest/v1/reports
 * con las credenciales inyectadas como cabeceras HTTP estándar de
 * PostgREST, evitando rutas intermedias corruptas.
 *
 * @returns {Promise<Array>} Array de objetos report con id, title, category, votes, created_at
 * @throws {Error} Si la respuesta HTTP no es exitosa (response.ok === false)
 */
async function getReports() {
  // Endpoint directo al recurso reports en la API REST de Supabase (PostgREST)
  const endpoint = `${SUPABASE_URL}/rest/v1/reports`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        // Clave de API pública (anon key) — requerida por Supabase
        "apikey": SUPABASE_ANON_KEY,
        // Header de autorización estándar Bearer
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        // Solicitamos respuesta en formato JSON
        "Content-Type": "application/json",
      },
    });

    // ── Control de errores: verificar que la respuesta sea exitosa ──
    if (!response.ok) {
      // Intentamos leer el cuerpo del error para dar contexto útil
      const errorBody = await response.text();
      throw new Error(
        `Error HTTP ${response.status} al consultar Supabase: ${errorBody}`
      );
    }

    // Parsear y retornar el array de reportes
    const data = await response.json();
    return data;

  } catch (error) {
    // Re-lanzar el error con contexto adicional para facilitar debugging
    throw new Error(`getReports() falló: ${error.message}`);
  }
}

// Exportar para uso en tests y otros módulos
module.exports = { getReports };
