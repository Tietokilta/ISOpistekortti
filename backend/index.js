const config = require('./utils/config')
const app = require('./app') // The Express app

app.listen(config.PORT, config.BIND_ADDRESS, () => {
  console.log((`Server running on port ${config.PORT}`))
})
