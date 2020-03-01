module.exports = {
  launch: {
    headless: false, // для отображения в клиенте
  },
  server: {
    command: 'npm start',
    port: 3000,
    launchTimeout: 10000,
    debug: true,
  },
}
