const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerSpec = YAML.load(path.join(__dirname, "../../docs/swagger.yaml"));

module.exports = {
  swaggerUi,
  swaggerSpec,
};
