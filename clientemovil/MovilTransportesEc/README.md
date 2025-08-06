# TransportesEC - Aplicación Móvil

Esta es la aplicación móvil desarrollada con React Native y Expo para el sistema de transporte TransportesEC.

## Características

- 🏠 **Pantalla de Inicio**: Búsqueda de viajes con origen, destino, fecha y número de pasajeros
- 🔐 **Login Modal**: Inicio de sesión con validación de credenciales
- 📝 **Registro Modal**: Formulario completo de registro de usuarios
- 🎨 **Diseño Responsive**: Interfaz adaptada para dispositivos móviles
- 🌐 **Integración API**: Conecta con el backend del sistema TransportesEC

## Componentes Principales

### Pantallas
- `HomeScreen.js`: Pantalla principal con formulario de búsqueda

### Componentes
- `LoginModal.js`: Modal de inicio de sesión
- `RegisterModal.js`: Modal de registro de usuarios

### Servicios
- `api.js`: Servicios para conectar con el backend (autenticación, viajes, ubicaciones)

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Dispositivo móvil con la app Expo Go instalada (o emulador)

### Pasos de Instalación

1. **Navegar al directorio del proyecto móvil**:
   ```bash
   cd clientemovil/MovilTransportesEc
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm start
   # o
   expo start
   ```

4. **Ejecutar en dispositivo**:
   - Escanea el código QR con la app Expo Go (Android/iOS)
   - O presiona `a` para Android emulator
   - O presiona `i` para iOS simulator

## Configuración del Backend

Asegúrate de que el servidor backend esté ejecutándose en `http://localhost:8000`. Si necesitas cambiar la URL, modifica el archivo `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://tu-servidor:puerto';
```

## Dependencias Principales

- **React Native**: Framework para desarrollo móvil
- **Expo**: Herramientas y servicios para React Native
- **React Navigation**: Navegación entre pantallas
- **Axios**: Cliente HTTP para llamadas a API
- **React Native Vector Icons**: Iconos para la interfaz

## Estructura del Proyecto

```
src/
├── components/
│   ├── LoginModal.js      # Modal de inicio de sesión
│   └── RegisterModal.js   # Modal de registro
├── screens/
│   └── HomeScreen.js      # Pantalla principal
└── services/
    └── api.js             # Servicios de API
```

## Funcionalidades Implementadas

### ✅ Pantalla de Inicio
- Formulario de búsqueda de viajes
- Selección de origen y destino
- Selector de fecha
- Contador de pasajeros
- Sección promocional
- Header con opción de login

### ✅ Modal de Login
- Campos de correo y contraseña
- Validación de campos obligatorios
- Integración con API de autenticación
- Manejo de errores
- Transición a modal de registro

### ✅ Modal de Registro
- Formulario completo con todos los campos requeridos
- Validación de datos en tiempo real
- Verificación de correo y cédula únicos
- Confirmación de contraseña
- Integración con API de registro

### ✅ Servicios de API
- Servicio de autenticación (login/registro)
- Verificación de datos únicos
- Manejo de errores HTTP
- Configuración centralizada

## Próximas Funcionalidades

- 🚌 Pantalla de resultados de búsqueda
- 🎫 Selección de asientos
- 💳 Proceso de pago
- 📱 Perfil de usuario
- 🔍 Rastreo de boletos

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo Expo
- `npm run android`: Ejecuta en emulador Android
- `npm run ios`: Ejecuta en simulador iOS
- `npm run web`: Ejecuta en navegador web

## Troubleshooting

### Error de conexión con el backend
- Verifica que el servidor backend esté ejecutándose
- Asegúrate de que la URL en `api.js` sea correcta
- En dispositivos físicos, usa la IP de tu computadora en lugar de `localhost`

### Problemas con iconos
- Los iconos requieren configuración adicional en dispositivos físicos
- En desarrollo con Expo, deberían funcionar automáticamente

### Error de navegación
- Asegúrate de que todas las dependencias de navegación estén instaladas
- Verifica que `NavigationContainer` esté envolviendo la aplicación

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Contacto

Para soporte técnico o preguntas sobre el desarrollo, contacta al equipo de desarrollo.
