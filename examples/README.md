# Ejemplos de Uso

Este directorio contiene ejemplos de cómo usar la librería `multi-captcha-solver-adapter`.

## Archivos de Ejemplo

### `example.ts`

Ejemplo básico de uso de la librería para resolver diferentes tipos de captcha:

- Imagen captcha (base64)
- reCAPTCHA v2
- hCaptcha  
- reCAPTCHA v3

### `proxy-example.ts`

Ejemplo de uso de la librería con configuración de proxy para casos donde necesitas enrutar el tráfico a través de un servidor proxy.

## Cómo Ejecutar los Ejemplos

1. **Compila el proyecto:**

   ```bash
   yarn build
   ```

2. **Ejecuta el ejemplo básico:**

   ```bash
   node build/examples/example.js
   ```

3. **Ejecuta el ejemplo con proxy:**

   ```bash
   node build/examples/proxy-example.js
   ```

## Configuración Requerida

Antes de ejecutar los ejemplos, asegúrate de:

1. **Reemplazar las API keys** con tus claves reales de los servicios de captcha (2Captcha, AntiCaptcha, etc.)
2. **Configurar los parámetros de proxy** apropiados si usas el ejemplo con proxy
3. **Verificar que tienes saldo** suficiente en tu cuenta del servicio de captcha

## Nota

Los ejemplos están excluidos de:

- Las pruebas de cobertura
- El linting automático
- La compilación de tipos

Esto mantiene limpia la estructura del proyecto principal mientras proporciona ejemplos funcionales.
