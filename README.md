Interbanking Challenger
🚀 Project setup
  npm install

▶️ Run the project

# development

  npm run start

# watch mode

  npm run start:dev

🧪 Run tests

# unit tests

  npm run test

🔑 Authentication

Para testear los endpoints:
  Obtener un token JWT en el endpoint de login.
  Usar ese token como Bearer Token en la cabecera Authorization de las requests.

📌 Decisiones:

Transferencias
  No pueden ser negativas.
  Se pueden programar a futuro.

Entidades
  Modeladas para asemejarse a escenarios reales.
  La fecha de adhesión se asigna automáticamente al crear la empresa.

Búsqueda por fechas (todas se manejaran con el huso horario de UTF-0):
  Endpoint genérico con parámetros de rango de fechas.
  Por defecto trae el último mes, pero puede personalizarse.

Company ID
  No se usa el CUIT como identificador único.
  Esto evita problemas en casos donde una empresa cambia de CUIT sin cambiar razón social (situación real que suele causar errores en producción).
