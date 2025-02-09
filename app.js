const express = require("express");

const cacheRoutes = require("./routes/cacheRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json());

app.use("/api/v1/cache", cacheRoutes);

app.use(globalErrorHandler);

module.exports = app;
