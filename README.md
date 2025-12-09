# Simple Raid Tool

esto esta es diseñado con una interfaz gráfica (WPF) y un backend en Node.js pa raidear compadre

## 🚀 Características

### 🛠️ Generales
- **Interfaz Gráfica (GUI):** Fácil de usar, sin necesidad de comandos de consola.
- **Discord Rich Presence (RPC):** Muestra tu estado personalizado en Discord mientras usas la herramienta.
- **Personalización Total:** Define nombres de canales, roles y mensajes de spam a tu gusto.
- **Multihilo:** Ejecución de comandos en ventanas independientes para ver logs en tiempo real eeeeegh

### ⚡ Módulos de Ataque
- **Destrucción:**
  - `Raid Normal`: Crea canales masivos y spamea en todos los existentes
  - `Raid Clásico`: Método más lento pero constante
  - `Raid RTool`: Variante optimizada de raid
  - `Bypass Raid`: Intenta evadir protecciones básicas renombrando canales
  - `Nuke`: Elimina todos los canales y roles, y deja un mensaje de aviso
  - `ON (Full Destroy)`: La opción  mas good Cambia nombre/icono, borra todo y spamea

- **Creación / Spam:**
  - Creación masiva de Canales, Roles y Emojis
  - `Webhooks`: Creación y spam masivo a través de webhooks
  - `Renombrar`: Cambia el apodo de todos los usuarios o el nombre de todos los roles
  - `Admin`: Crea un rol de administrador (si el bot tiene permisos)

- **Moderación / Limpieza:**
  - `Banear Todos`: massban
  - `Kickear Todos`: masskick
  - `Silenciar Todos`: Aplica timeout a todos los usuarios
  - Limpieza de Canales, Roles, Stickers, Invitaciones y Webhooks

- **Token Tools (User Token):**
  - Herramientas para gestión de cuentas de usuario (Info, Leave Guilds, Block Friends, etc.).

## 📋 Requisitos e Instalación

### 1. Sistema Base
- **Sistema Operativo:** Windows 10 u 11.
- **.NET Desktop Runtime:** Necesario para abrir la interfaz gráfica. Asegúrate de tener instalado el runtime de .NET (versión 8.0 o superior recomendada).

### 2. Entorno Node.js
Es fundamental tener **Node.js** instalado para que la herramienta funcione.

1. **Descargar Node.js:** Ve a [nodejs.org](https://nodejs.org/) e instala la versión **LTS**.
2. **Instalar Dependencias:** 
   Abre una terminal (PowerShell o CMD) en la carpeta del proyecto y ejecuta el siguiente comando para instalar las librerías necesarias:

   ```bash
   npm install discord.js chalk@4.1.2 gradient-string node-fetch@2
   ```
   
   *Nota: Se recomiendan estas versiones específicas para compatibilidad.*

   O simplemente ejecuta:
   ```bash
   npm install
   ```
   (Si ya tienes el archivo `package.json` )

### Dependencias incluídas:
- `discord.js`: Para interactuar con la API de Discord.
- `chalk`: Para dar color a la consola.
- `gradient-string`: Para los gradientes de texto.
- `node-fetch`: Para realizar peticiones HTTP.

## 🔧 Configuración y Uso

1. **Ejecutar:** Abre `SimpleRaidTool.exe` desde la carpeta `bin`.
2. **Configurar Credenciales:**
   - **Token del Bot:** Introduce el token de tu bot de Discord
   - **ID del Servidor:** El ID del servidor objetivo
3. **Personalizar Ataque (Opcional):**
   - Define el nombre de los canales a crear
   - Define el nombre de los roles
   - Escribe el mensaje que se enviará en el spam
4. **Lanzar:** Haz clic en los botones de las pestañas para ejecutar las acciones. Se abrirá una ventana de comandos mostrando el progreso

### 🎮 Discord RPC

Para cambiar el estado de "Jugando a..." que aparece en tu perfil de Discord:
1. Edita el archivo `RpcConfig.cs` para cambiar los textos

2. Los valores por defecto son:
   - **Detalles:** Destruyendo Servidores
   - **Estado:** Usando Simple Raid Tool



**El creador no se hace responsable del mal uso que se le dé a este software.**
