# Plan de Mejora y Normas de Desarrollo para "Multi-Captcha Solver"

## 1. Propósito de este Documento

Este documento sirve como la fuente única de verdad para el plan de evolución de la librería `multi-captcha-solver`. Su objetivo es:

* **Alinear al equipo** en torno a una visión y arquitectura comunes.
* **Proveer un plan de trabajo detallado** y accionable, dividido en fases lógicas.
* **Controlar el avance** de las tareas mediante un sistema de checklist.
* **Consolidar todas las reglas y normas** de codificación, pruebas y contribución.

---

## 2. Fases del Proyecto

El trabajo se ha dividido en cuatro fases secuenciales para asegurar una progresión lógica y estable.

* **🚀 Fase 1: Fundación y Refactorización**
  * **Objetivo:** Fortalecer la base del código actual, optimizar el manejo de errores y mejorar el pipeline de CI/CD.
  * **Tareas Clave:** Refactorización de la estrategia de reintentos, mejora del workflow de CI/CD, integración de reportes de cobertura.

* **🧩 Fase 2: Expansión de Proveedores**
  * **Objetivo:** Aumentar la versatilidad de la librería añadiendo soporte para nuevos servicios de resolución de captchas.
  * **Tareas Clave:** Integración de CapMonster Cloud.

* **🤖 Fase 3: Funcionalidad Avanzada y UX del Desarrollador**
  * **Objetivo:** Reducir la complejidad para el usuario final implementando la detección automática del tipo de captcha.
  * **Tareas Clave:** Desarrollo de la clase `CaptchaDetector`.

* **✅ Fase 4: Consolidación de la Calidad**
  * **Objetivo:** Asegurar la robustez y fiabilidad de la librería a través de pruebas exhaustivas que simulen escenarios reales.
  * **Tareas Clave:** Creación de suites de pruebas de integración y End-to-End (E2E).

---

## 3. Plan de Trabajo y Avance

Utiliza esta sección para rastrear el progreso de las tareas. Marca una tarea como completada al finalizarla.

### Fase 1: Fundación y Refactorización

* [ ] **Refactorizar Estrategia de Reintentos:**
  * Modificar `withRetries` para aceptar una función `retryOn` que decida si un error específico debe provocar un reintento.
  * Actualizar `MultiCaptchaSolver` para que solo reintente en errores de red/timeout.
  * Actualizar las pruebas unitarias en `src/__tests__/retry.helper.spec.ts`.
* [ ] **Mejorar Workflow de CI/CD:**
  * En `.github/workflows/build.yml`, separar los trabajos de `lint`, `test` y `build`.
  * Añadir un nuevo trabajo para pruebas de integración que se ejecute en PRs a `main` y utilice secretos.
* [ ] **Integrar Reportes de Cobertura:**
  * Añadir una herramienta como Codecov o Coveralls al pipeline de CI para monitorear la cobertura de pruebas.

### Fase 2: Expansión de Proveedores

* [ ] **Añadir Soporte para CapMonster Cloud:**
  * Crear `src/services/capmonster.service.ts` implementando `IMultiCaptchaSolver`.
  * Añadir `CapMonster` al enum `ECaptchaSolverService`.
  * Registrar el nuevo servicio en `solverServiceMap` en `src/main.ts`.
  * Crear `src/__tests__/capmonster.service.spec.ts` con mocks y pruebas unitarias completas.

### Fase 3: Funcionalidad Avanzada

* [ ] **Implementar Detector Automático de Captcha:**
  * Crear la clase `CaptchaDetector` en `src/utils/captcha-detector.ts`.
  * Implementar el método `detect(url: string, proxy?: ProxyOptions)` usando una librería HTTP (como `axios` o `node-fetch`) para analizar el DOM de la URL.
  * Definir un enum `CaptchaType` con los tipos de captcha detectables.
  * Crear `src/__tests__/captcha-detector.spec.ts` con pruebas unitarias basadas en fragmentos de HTML de ejemplo.

### Fase 4: Consolidación de la Calidad

* [ ] **Crear Suite de Pruebas de Integración:**
  * Desarrollar una nueva suite de pruebas (`*.integration.spec.ts`).
  * Realizar llamadas reales a las APIs de los servicios (usando claves de API de prueba o secretos de CI).
  * Validar el mapeo de parámetros y la interpretación de respuestas.
* [ ] **Implementar Pruebas E2E:**
  * Crear al menos un test E2E que utilice una página de demostración (ej. hCaptcha Demo).
  * Validar el flujo completo desde la solicitud hasta la resolución del captcha.

---

## 4. Normas y Reglas del Proyecto

Todo el código y las contribuciones deben adherirse a las siguientes normas para mantener la calidad y consistencia del proyecto.

* **Gestión de Código Fuente (Git):**
  * **Ramas:** Utilizar el formato `feature/<nombre-feature>` para nuevas funcionalidades y `fix/<descripcion-bug>` para correcciones.
  * **Commits:** Seguir la especificación de **Conventional Commits**. Ejemplo: `feat: Add support for CapMonster service`.
  * **Pull Requests (PRs):** Utilizar la plantilla definida en `.github/PULL_REQUEST_TEMPLATE.md`. Un PR debe resolver un único problema o añadir una única funcionalidad.

* **Calidad de Código:**
  * El código debe pasar el linter sin advertencias (`npm run lint`).
  * Formatear el código con Prettier (`npm run prettier`) antes de hacer commit.
  * La configuración se encuentra en `.eslintrc.json`.

* **Estrategia de Pruebas:**
  * Toda nueva funcionalidad o corrección de bug **debe** estar acompañada de sus correspondientes pruebas unitarias.
  * Funcionalidades complejas o que introducen nuevos flujos deben incluir pruebas de integración.
  * Se debe mantener o mejorar el umbral de cobertura de pruebas definido en `jest.config.js`.

* **Documentación:**
  * Toda API pública (clases, métodos, interfaces, enums) debe estar documentada usando TSDoc.
  * El `README.md` debe ser actualizado para reflejar cualquier nueva funcionalidad de cara al usuario.
  * La documentación se genera con `npm run docs:generate` a partir de los comentarios TSDoc.

---

## 5. Referencias y Recursos

* **Documentación de APIs:**
  * [Documentación de 2Captcha](https://2captcha.com/2captcha-api)
  * [Documentación de Anti-Captcha](https://anti-captcha.com/apidoc)
  * [Documentación de CapMonster Cloud](https://capmonster.cloud/docs)
* **Herramientas de Testing:**
  * [Jest: Pruebas de Integración](https://jestjs.io/docs/testing-frameworks)
* **CI/CD:**
  * [Gestión de Secretos en GitHub Actions](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
  * [Codecov GitHub Action](https://github.com/codecov/codecov-action)
