const sql = require("mssql");

const config = {
  user: "appUser",
  password: "App12345*",
  server: "DESKTOP-FI5A9FK",
  database: "perfilapp",
  options: {
    instanceName: "SQLEXPRESS",
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Conectado a SQL Server Express");
    return pool;
  })
  .catch(err => console.log("❌ Error SQL Server:", err));
  
module.exports = {
  sql,
  poolPromise
};
