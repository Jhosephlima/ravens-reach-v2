const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./usuarios.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        phone TEXT,
        nickname TEXT,
        profile_img TEXT
    )`, (err) => {
        if (err) console.error("Erro ao criar tabela:", err.message);
        else console.log("✅ Tabela 'users' pronta e atualizada!");
    });
});

module.exports = db;