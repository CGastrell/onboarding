const env = process.env['NODE_ENV']

let config = {}

switch (env) {
  case 'production':
    config = {
      apiUrl: 'https://api-development.webgis.frontec.net'
    }
    break
  default:
    config = {
      apiUrl: 'http://localhost:3001'
    }
}

export default config
