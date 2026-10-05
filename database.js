const Database = require("better-sqlite3");

const db = new Database("despesas.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS despesas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        data TEXT NOT NULL,
        categoria TEXT NOT NULL
    )
`).run();

console.log("Banco de dados conectado!");
console.log("Tabela despesas pronta!");

module.exports = db;