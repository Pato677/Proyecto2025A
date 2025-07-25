# 🚀 SISTEMA DE TRANSPORTE - MIGRACIÓN A ARQUITECTURA MULTI-ROL

## 📋 Resumen de Cambios

Se ha reestructurado completamente la base de datos para implementar una arquitectura multi-rol escalable que permite manejar usuarios finales, cooperativas y superusuarios de forma unificada.

## 🎯 Nueva Arquitectura

### Tabla Principal: `usuarios`
```sql
- id, email, password, telefono, rol, estado, email_verificado, fecha_ultimo_acceso
- Roles: 'usuario', 'cooperativa', 'superusuario'
```

### Tablas Específicas:
- **`usuarios_finales`**: Datos específicos de usuarios regulares
- **`usuarios_cooperativas`**: Datos específicos de cooperativas
- **`cooperativas`**: Información operativa de cooperativas

## 🛠️ INSTRUCCIONES DE INSTALACIÓN

### 1. Preparar Base de Datos

```bash
# 1. Ejecutar el script de configuración
cd server
node scripts/setup-database.js
```

### 2. Verificar Instalación

El script mostrará:
- ✅ Tablas creadas
- 👥 Usuarios superusuario creados
- 🏙️ Ciudades y terminales de ejemplo

### 3. Usuarios Predeterminados

**Superusuarios creados:**
- `admin@sistema.com` / `password`
- `superadmin@sistema.com` / `password`
- `soporte@sistema.com` / `password`

## 🔐 NUEVOS ENDPOINTS DE AUTENTICACIÓN

### Registro de Usuario Final
```http
POST /auth/registro/usuario
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "password123",
  "telefono": "0987654321",
  "nombres": "Juan Carlos",
  "apellidos": "Pérez Morales",
  "cedula": "1712345678",
  "fecha_nacimiento": "1990-05-15",
  "genero": "masculino",
  "direccion": "Av. República N34-377",
  "ciudad": "Quito"
}
```

### Registro de Cooperativa
```http
POST /auth/registro/cooperativa
Content-Type: application/json

{
  "email": "info@cooperativa.com",
  "password": "password123",
  "telefono": "0234567890",
  "nombre_cooperativa": "Transportes Unidos",
  "ruc": "1791234567001",
  "razon_social": "Cooperativa de Transporte Unidos S.A.",
  "representante_legal": "María González",
  "cedula_representante": "1712345679",
  "direccion_matriz": "Av. América N39-123",
  "ciudad_matriz": "Quito",
  "telefono_fijo": "023456789",
  "fecha_constitucion": "2010-03-15",
  "numero_socios": 25
}
```

### Login Universal
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@sistema.com",
  "password": "password"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "id": 1,
    "email": "admin@sistema.com",
    "rol": "superusuario",
    "estado": "activo"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 🔧 MIDDLEWARE Y PROTECCIÓN

### Autenticación
```javascript
// Todas las rutas protegidas requieren:
Authorization: Bearer <token>
```

### Roles y Permisos
- **`superusuario`**: Acceso completo al sistema
- **`cooperativa`**: Gestión de sus unidades, conductores, rutas
- **`usuario`**: Compra de boletos, gestión de perfil

## 📊 ENDPOINTS ACTUALIZADOS

### Gestión de Usuarios (Solo Superusuarios)
```http
GET /usuarios?rol=usuario&page=1&limit=10
GET /usuarios/:id
POST /usuarios
PUT /usuarios/:id
DELETE /usuarios/:id
```

### Perfil de Usuario
```http
GET /auth/perfil
PUT /auth/perfil
```

### Ciudades y Terminales (Sin cambios)
```http
GET /ciudades-terminales/plano
GET /ciudades
GET /terminales
POST /terminales
PUT /terminales/:id
DELETE /terminales/:id
```

## 🗄️ PROCEDIMIENTOS ALMACENADOS

### `sp_obtener_ciudades_terminales()`
Obtiene datos optimizados para la tabla del frontend:
```sql
CALL sp_obtener_ciudades_terminales();
```

## 🔄 MIGRACIÓN DE DATOS EXISTENTES

Si tienes datos previos, el script:
1. ✅ Crea nueva estructura
2. ✅ Inserta datos de ejemplo
3. ✅ Configura usuarios predeterminados
4. ✅ Mantiene integridad referencial

## 🧪 TESTING CON POSTMAN

### Variables de Entorno
```json
{
  "base_url": "http://localhost:3000",
  "auth_token": "{{token_from_login}}"
}
```

### Flujo de Prueba Sugerido
1. **Login** como superusuario
2. **Verificar** datos en `/ciudades-terminales/plano`
3. **Registrar** usuario de prueba
4. **Registrar** cooperativa de prueba
5. **Probar** endpoints protegidos

## 🚨 CAMBIOS IMPORTANTES

### ⚠️ Breaking Changes
- **URLs actualizadas**: Prefijos `/auth`, `/usuarios`, etc.
- **Estructura de respuesta**: Formato `{ success, data, message }`
- **Autenticación requerida**: JWT tokens obligatorios
- **Roles**: Sistema de permisos implementado

### ✅ Compatibilidad Mantenida
- **Ciudades y terminales**: Misma funcionalidad
- **Frontend actual**: Compatible con `/ciudades-terminales/plano`
- **Base de datos**: Procedimientos almacenados funcionando

## 🎉 BENEFICIOS DE LA NUEVA ARQUITECTURA

### 🔒 Seguridad
- Autenticación JWT robusta
- Sistema de roles granular
- Contraseñas encriptadas con bcrypt

### 📈 Escalabilidad
- Fácil agregar nuevos roles
- Datos específicos separados
- Índices optimizados

### 🧩 Mantenibilidad
- Código modular y limpio
- Middleware reutilizable
- Validaciones centralizadas

### 🔧 Extensibilidad
- Nuevos tipos de usuario fáciles
- API RESTful estándar
- Documentación completa

## 📝 PRÓXIMOS PASOS

1. **Ejecutar el script** de configuración
2. **Probar endpoints** con Postman
3. **Actualizar frontend** para usar nuevos endpoints de auth
4. **Implementar** funcionalidades específicas por rol
5. **Configurar** variables de entorno de producción

## 🆘 SOPORTE

Si encuentras problemas:

1. **Verificar** que MySQL esté corriendo
2. **Revisar** configuración de base de datos en el script
3. **Comprobar** logs del servidor
4. **Consultar** documentación de endpoints

---

**¡Tu sistema ahora tiene una arquitectura robusta y lista para escalar! 🚀**
