"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
(0, db_1.connectDB)();
app_1.app.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT}`);
});
