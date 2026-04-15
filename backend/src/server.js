const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = require("./app");
const connectDb = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
};

startServer();
