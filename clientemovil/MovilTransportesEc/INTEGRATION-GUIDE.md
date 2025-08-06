# Guía de Integración - Cliente Móvil con Servidor

## 🚀 Resumen de la Implementación

He creado una aplicación móvil con React Native/Expo que se integra con tu servidor backend usando la IP `192.168.247.115:8000`. La aplicación incluye:

### ✅ Funcionalidades Implementadas

1. **Pantalla de Inicio (HomeScreen)**
   - Formulario de búsqueda de viajes
   - Header dinámico que muestra el nombre del usuario logueado
   - Integración con base de datos para cargar ciudades y terminales

2. **Sistema de Autenticación**
   - Modal de Login que se conecta al endpoint `/auth/login`
   - Modal de Registro que se conecta al endpoint `/auth/registro/usuario`
   - Contexto de autenticación con persistencia local (AsyncStorage)
   - Restricción para usuarios finales únicamente (no cooperativas/admin)

3. **Integración con API**
   - Servicios configurados para IP `192.168.247.115:8000`
   - Endpoints de autenticación, ubicaciones y viajes
   - Manejo de errores HTTP

## 📁 Estructura de Archivos Creados/Modificados

```
clientemovil/MovilTransportesEc/
├── App.js                              # ✅ Modificado - AuthProvider integrado
├── src/
│   ├── components/
│   │   ├── LoginModal.js               # ✅ Creado - Modal de inicio de sesión
│   │   └── RegisterModal.js            # ✅ Creado - Modal de registro
│   ├── context/
│   │   └── AuthContext.js              # ✅ Creado - Contexto de autenticación
│   ├── screens/
│   │   └── HomeScreen.js               # ✅ Creado - Pantalla principal
│   └── services/
│       └── api.js                      # ✅ Creado - Servicios de API
├── README.md                           # ✅ Creado - Documentación
└── test-connection.js                  # ✅ Creado - Test de conectividad
```

## 🔧 Pasos para Ejecutar

### 1. Asegurar que el Servidor esté Ejecutándose
```bash
# En el directorio server/
node server.js
```
**Debe mostrar:** `🚀 SERVIDOR BACKEND INICIADO` en `http://localhost:8000`

### 2. Instalar Dependencias Móviles
```bash
# En el directorio clientemovil/MovilTransportesEc/
npm install
```

### 3. Ejecutar la Aplicación Móvil
```bash
npx expo start
```

### 4. Probar en Dispositivo
- Escanea el código QR con la app Expo Go
- O usa emulador Android/iOS

## 🔐 Funcionalidades de Autenticación

### Login
- **Endpoint:** `POST /auth/login`
- **Restricción:** Solo usuarios finales (dashboard: 'usuario')
- **Resultado:** Al hacer login exitoso, el header cambia de "Iniciar Sesión" a "Hola, [Nombre]"

### Registro
- **Endpoint:** `POST /auth/registro/usuario`
- **Campos:** nombres, apellidos, fecha_nacimiento, cedula, correo, telefono, contrasena
- **Validación:** Formulario completo con validaciones en tiempo real

### Persistencia
- Los datos del usuario se guardan en AsyncStorage
- La sesión persiste entre reinicios de la app

## 🌐 Configuración de Red

### IP del Servidor
```javascript
// src/services/api.js
const API_BASE_URL = 'http://192.168.247.115:8000';
```

### Endpoints Utilizados
- `POST /auth/login` - Inicio de sesión
- `POST /auth/registro/usuario` - Registro de usuarios
- `GET /ciudades` - Listado de ciudades
- `GET /terminales/ciudad/:id` - Terminales por ciudad
- `GET /viajes/fecha/:fecha` - Viajes por fecha

## 🎯 Comportamiento Específico Móvil

### Restricciones Implementadas
1. **Solo Usuarios Finales:** La app rechaza login de cooperativas y admins
2. **No Modificaciones en Server:** Toda la lógica se maneja en el cliente móvil
3. **IP Específica:** Configurado para tu red local `192.168.247.115`

### Estados del Header
- **Sin autenticar:** "Iniciar Sesión" (abre modal de login)
- **Autenticado:** "Hola, [Nombre del Usuario]" (permite logout)

## 🧪 Pruebas de Conectividad

Ejecuta el test de conexión:
```bash
node test-connection.js
```

Esto probará:
- Conexión con el servidor
- Endpoint de ciudades
- Endpoint de autenticación

## 🐛 Troubleshooting

### Error de Conexión
1. Verificar que el servidor esté ejecutándose en puerto 8000
2. Confirmar que la IP `192.168.247.115` sea accesible desde el dispositivo móvil
3. En dispositivos físicos, asegurar que estén en la misma red WiFi

### Error de Autenticación
1. Verificar que existan usuarios en la base de datos
2. Confirmar que los endpoints `/auth/login` y `/auth/registro/usuario` respondan
3. Revisar que el usuario tenga rol 'final' para acceso móvil

### Error de Carga de Datos
1. Verificar endpoint `/ciudades` en el navegador: `http://192.168.247.115:8000/ciudades`
2. Confirmar que la base de datos tenga datos de ciudades y terminales

## 📱 Flujo de Usuario

1. **Inicio:** Usuario ve pantalla con formulario de búsqueda
2. **Registro:** Click en "Iniciar Sesión" > "click aquí" > Llenar formulario > Registro exitoso
3. **Login:** Ingresar credenciales > Login exitoso > Header muestra nombre
4. **Búsqueda:** Usar formulario para buscar viajes (próximamente)
5. **Logout:** Click en nombre del usuario > Confirmar logout

## 🔄 Próximas Implementaciones

Para completar la funcionalidad:
1. Pantalla de resultados de búsqueda de viajes
2. Selección de asientos
3. Proceso de compra
4. Historial de viajes
5. Perfil de usuario

## 📞 Soporte

La aplicación está configurada específicamente para:
- **Red:** 192.168.247.115:8000
- **Usuarios:** Solo tipo 'final'
- **Plataforma:** React Native con Expo
- **Persistencia:** AsyncStorage local

Todas las modificaciones están únicamente en el cliente móvil, sin afectar el servidor ni el cliente web.
