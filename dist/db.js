"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = require("./config/config");
const pool = new pg_1.Pool({
    host: config_1.DB_HOST,
    user: config_1.DB_USER,
    password: config_1.DB_PASSWORD,
    database: config_1.DB_DATABASE,
    port: config_1.DB_PORT,
});
exports.default = pool;
//# sourceMappingURL=db.js.map