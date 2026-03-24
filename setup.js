const db = require('./database');

db.serialize(() => {
    console.log("🛠️ Iniciando atualização do banco de dados...");

    // Adiciona a coluna de Telefone
    db.run(`ALTER TABLE users ADD COLUMN phone TEXT`, (err) => {
        if (err) console.log("ℹ️ Coluna 'phone' já existe ou não pôde ser criada.");
        else console.log("✅ Coluna 'phone' adicionada.");
    });

    // Adiciona a coluna de Nickname (Apelido)
    db.run(`ALTER TABLE users ADD COLUMN nickname TEXT`, (err) => {
        if (err) console.log("ℹ️ Coluna 'nickname' já existe.");
        else console.log("✅ Coluna 'nickname' adicionada.");
    });

    // Adiciona a coluna de Foto de Perfil (Base64)
    db.run(`ALTER TABLE users ADD COLUMN profile_img TEXT`, (err) => {
        if (err) console.log("ℹ️ Coluna 'profile_img' já existe.");
        else console.log("✅ Coluna 'profile_img' adicionada.");
    });

    console.log("🚀 Setup finalizado! Agora você pode salvar fotos e dados extras.");
})