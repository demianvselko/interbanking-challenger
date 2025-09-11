Interbanking Challenger
🚀 Project setup
  npm install

▶️ Run the project

# development

  npm run start

# watch mode

  npm run start:dev

🧪 Run tests

# unit tests (92% coverage)

  npm run test

# e2e tests (52% coverage)

  npm run test:e2e

🔑 Authentication

Para testear los endpoints:
  Obtener un token JWT en el endpoint de login.
  Usar ese token como Bearer Token en la cabecera Authorization de las requests.

📌 Decisiones:
Al hacer el npm i, la base de datos se creara sola y se populara.
Si deciden cambiar el repositorio para usar Json, este tambien se cargara automaticamente al levantar el servidor, para poder tener datos de pruebas.

Transferencias
  No pueden ser negativas.
  Se pueden programar a futuro.

Entidades
  Modeladas para asemejarse a escenarios reales.
  La fecha de adhesión se asigna automáticamente al crear la empresa.

Búsqueda por fechas (todas se manejaran con el huso horario de UTF-0, ya que me parece lo mas conveniente a la hora de manejar las fechas):
  Endpoint genérico con parámetros de rango de fechas.
  Por defecto trae el último mes, pero puede personalizarse.

Company ID
  No se usa el CUIT como identificador único.
  Esto evita problemas en casos donde una empresa cambia de CUIT sin cambiar razón social (situación real que suele causar errores en producción).

Entiendo que esto cubre los detalles que me han pedido, antes cualquier dudas sobre el codigo podemos hablar por meet.

 Si necesitan mas cambios, pueden solicitarlos.
