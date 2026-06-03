// ============================================================
// CityFix — src/utils/reportEngine.test.js
// Tests E2E con red real — SIN jest.fn() ni intercepción de fetch
// ============================================================

const { getReports } = require("./reportEngine");

// ── Tiempo de espera amplio para llamadas de red reales ───────
// Supabase puede tardar en responder en redes con latencia.
jest.setTimeout(10000);

// ── Suite principal de pruebas E2E ────────────────────────────
describe("CityFix — Integración E2E con Supabase (Red Real)", () => {

  // Variable compartida entre tests para evitar llamadas duplicadas
  let reports;

  // Se ejecuta UNA vez antes de todos los tests de esta suite
  beforeAll(async () => {
    // Llamada real a la red — sin mocks, sin interceptores
    reports = await getReports();
  });

  // ── Test 1: La conexión devuelve código exitoso y un array real ──
  test("1. La API responde con un array auténtico de JavaScript", () => {
    // Verificamos que la variable fue asignada (no undefined/null)
    expect(reports).toBeDefined();

    // Verificamos que el resultado sea EFECTIVAMENTE un array de JS
    // (no un objeto, string, ni null)
    expect(Array.isArray(reports)).toBe(true);
  });

  // ── Test 2: El array tiene datos reales (los que ingresaste) ──
  test("2. El array contiene al menos un registro (length > 0)", () => {
    // Certifica que Supabase está leyendo los datos que insertaste
    // en el Table Editor. Si falla aquí, verifica que insertaste los
    // 5 registros mínimos y que la política RLS permite SELECT público.
    expect(reports.length).toBeGreaterThan(0);
  });

  // ── Test 3: El primer registro tiene la estructura correcta ──
  test("3. El primer reporte tiene las propiedades estructuradas correctamente", () => {
    const primerReporte = reports[0];

    // Verificar que el id existe y es un string (UUID)
    expect(primerReporte).toHaveProperty("id");
    expect(typeof primerReporte.id).toBe("string");

    // Verificar que title existe y es un string
    expect(primerReporte).toHaveProperty("title");
    expect(typeof primerReporte.title).toBe("string");

    // Verificar que category existe y es uno de los valores válidos
    expect(primerReporte).toHaveProperty("category");
    expect(["Vías", "Iluminación", "Aseo"]).toContain(primerReporte.category);

    // Verificar que votes existe y es un número
    expect(primerReporte).toHaveProperty("votes");
    expect(typeof primerReporte.votes).toBe("number");
  });

  // ── Test bonus: Mostrar los datos en consola para verificación visual ──
  test("4. [Bonus] Muestra los reportes en consola para verificación", () => {
    console.log("\n✅ Reportes recibidos desde Supabase:");
    console.table(
      reports.map((r) => ({
        id: r.id.substring(0, 8) + "...",
        title: r.title,
        category: r.category,
        votes: r.votes,
      }))
    );

    // Este test siempre pasa — solo es para inspección visual
    expect(true).toBe(true);
  });
});
