# Sistema de Recuperación de Contraseña 🔐

## Descripción
Se ha implementado un sistema completo de recuperación de contraseña con:

### ✅ Características Implementadas

1. **Generación de Tokens de Recuperación**
   - Token único y aleatorio generado cuando el usuario solicita recuperación
   - Válido por 15 minutos (se auto-expira)
   - Se guarda en `auth.recoveryTokens`

2. **Simulación de Email**
   - Se genera un token único para cada solicitud de recuperación
   - El sistema muestra un botón "Cambiar contraseña" en lugar de enviar email real
   - En producción, aquí se enviaría un email con el enlace

3. **Modal de Cambio de Contraseña**
   - Modal dedicado (`resetPasswordModal`) para cambiar la contraseña
   - Validación en tiempo real de la nueva contraseña
   - Indicador visual de fuerza de contraseña
   - Validación de coincidencia entre las dos contraseñas

4. **Validaciones de Seguridad**
   - La nueva contraseña debe cumplir todas las reglas de seguridad:
     - Mínimo 8 caracteres
     - Una mayúscula (A–Z)
     - Un número (0–9)
     - Un carácter especial (!@#$%)
   - Las dos contraseñas deben coincidir
   - Token debe ser válido y no expirado
   - El token solo puede usarse una vez

5. **Feedback Visual**
   - Borde verde para contraseñas coincidentes
   - Borde rojo para contraseñas no coincidentes
   - Indicador de fuerza (0-100%) con colores
   - Mensajes de error específicos

## Flujo de Uso

### Paso 1: Solicitar Recuperación
```
1. Click en "¿Olvidaste tu contraseña?" en el login
2. Ingresa tu email
3. Recibe confirmación y botón "Cambiar contraseña"
```

### Paso 2: Cambiar Contraseña
```
1. Click en "Cambiar contraseña"
2. Se abre el modal de reset password
3. Ingresa nueva contraseña (validación en tiempo real)
4. Confirma contraseña
5. Click en "Cambiar contraseña"
6. Éxito: vuelve al login
```

### Paso 3: Login con Nueva Contraseña
```
1. Login con el email y la nueva contraseña
2. ¡Sesión iniciada!
```

## Métodos de AuthManager

### `recoverPassword(email)`
- **Entrada:** email del usuario
- **Salida:** { ok, token, message } o { ok: false, error }
- **Función:** Genera token y simula envío de email

### `validateRecoveryToken(token)`
- **Entrada:** token de recuperación
- **Salida:** { valid, email } o { valid: false, error }
- **Función:** Valida que el token sea válido, no expirado y no usado

### `resetPassword(token, newPassword)`
- **Entrada:** token válido y nueva contraseña
- **Salida:** { ok, message } o { ok: false, error }
- **Función:** Cambia la contraseña y marca token como usado

## Funciones de UI

### `openResetPasswordModal(token)`
- Abre el modal de cambio de contraseña
- Limpia formularios previos
- Guarda token en `window._resetPasswordToken`

### `closeResetPasswordModal()`
- Cierra el modal de reset password
- Limpia token temporal

### `handleResetPassword()`
- Handler principal del formulario de reset
- Valida coincidencia de contraseñas
- Llama a `auth.resetPassword()`
- Muestra feedback de éxito/error

### `checkResetPasswordStrength(pwd)`
- Valida fuerza de contraseña en tiempo real
- Actualiza indicador visual
- Llama a `validateResetPasswordMatch()`

### `validateResetPasswordMatch()`
- Compara las dos contraseñas
- Añade/quita clases `.match` / `.mismatch`
- Feedback visual instantáneo

## Estilos CSS

```css
.reset-password-overlay      → Fondo oscuro del modal
.reset-password-modal        → Contenedor del modal
.reset-password-header       → Encabezado
.reset-password-title        → Título
.reset-password-body         → Contenedor de formulario
.reset-password-footer       → Botones de acción
.reset-password-cancel-btn   → Botón cancelar
.reset-password-confirm-btn  → Botón confirmar

input.match                  → Borde verde para contraseñas iguales
input.mismatch               → Borde rojo para contraseñas diferentes
```

## Validación de Datos Almacenados

La información se guarda en `sessionStorage`:
```javascript
{
  recoveryTokens: {
    "abc123xyz789": {
      email: "usuario@email.com",
      expiresAt: 1719331652000,
      usedAt: null  // Se actualiza cuando se usa el token
    }
  },
  users: {
    "usuario@email.com": {
      username: "GamerPro",
      passwordHash: "hash_de_nueva_contraseña",
      email: "usuario@email.com"
    }
  }
}
```

## Notas de Seguridad

⚠️ **Para Demostración:**
- Los tokens se almacenan en memoria (no en DB real)
- Se pierden al cerrar el navegador
- No se envía email real

✅ **Para Producción:**
- Usar hash SHA-256 o bcrypt para contraseñas
- Guardar tokens en base de datos con tiempos de expiración
- Enviar email real con enlace seguro
- Usar HTTPS para toda comunicación
- Validar token en backend (no en cliente)

## Prueba de Ejemplo

1. Crea una cuenta con email `test@test.com` y contraseña `Test123!@`
2. Cierra sesión
3. Click en "¿Olvidaste tu contraseña?"
4. Ingresa `test@test.com`
5. Click en "Cambiar contraseña"
6. Ingresa nueva contraseña: `NewTest456!@`
7. Confirma: `NewTest456!@`
8. Click en "Cambiar contraseña"
9. Login con `test@test.com` y `NewTest456!@`

¡Listo! ✅
