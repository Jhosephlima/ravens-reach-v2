const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Mudança para bcryptjs (mais compatível)
const db = require('./database'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Porta dinâmica para o Render (ou 3000 para local)
const PORT = process.env.PORT || 3000;

// Configuração do Multer (Avatares)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/avatars';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// --- ROTA DE CADASTRO ---
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        
        db.run(sql, [username, email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ message: "Usuário ou E-mail já existe!" });
                }
                return res.status(500).json({ message: "Erro ao criar conta." });
            }
            res.status(201).json({ message: "Conta criada com sucesso!" });
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao processar senha." });
    }
});

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err) return res.status(500).json({ message: "Erro no banco." });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado!" });
        
        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({ status: "sucesso", username: user.username });
            } else {
                res.status(401).json({ message: "Senha incorreta!" });
            }
        } catch (error) {
            res.status(500).json({ message: "Erro interno na verificação." });
        }
    });
});

// --- BUSCAR PERFIL ---
app.get('/get-profile/:username', (req, res) => {
    const username = req.params.username;
    db.get(`SELECT email, phone, nickname, profile_img FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return res.status(500).json({ message: "Erro no banco." });
        res.json(row || {});
    });
});

// --- ATUALIZAR PERFIL ---
app.post('/update-profile', upload.single('profile_img'), (req, res) => {
    const { username, email, phone, nickname } = req.body;
    let foto_final = req.body.profile_img; 

    if (req.file) {
        const protocol = req.protocol;
        const host = req.get('host');
        foto_final = `${protocol}://${host}/uploads/avatars/${req.file.filename}`;
    }

    const sql = `UPDATE users SET email = ?, phone = ?, nickname = ?, profile_img = ? WHERE username = ?`;
    db.run(sql, [email, phone, nickname, foto_final, username], function (err) {
        if (err) return res.status(500).json({ message: "Erro ao salvar: " + err.message });
        res.json({ message: "Sucesso!", profile_img: foto_final });
    });
});

// --- DELETAR CONTA ---
app.delete('/deletar-conta', (req, res) => {
    const { username, senha } = req.body;
    db.get("SELECT password FROM users WHERE username = ?", [username], async (err, user) => {
        if (err) return res.status(500).json({ message: "Erro ao localizar usuário." });
        if (!user) return res.status(404).json({ message: "Usuário não encontrado." });
        try {
            const match = await bcrypt.compare(senha, user.password);
            if (!match) return res.status(401).json({ message: "Senha incorreta!" });

            db.run("DELETE FROM users WHERE username = ?", [username], function(err) {
                if (err) return res.status(500).json({ message: "Erro ao apagar do banco." });
                res.json({ success: true, message: "Conta apagada com sucesso." });
            });
        } catch (error) {
            res.status(500).json({ message: "Erro interno." });
        }
    });
});
const util = require('mc-server-utilities');

// Rota para o seu site saber se o Minecraft está aberto
app.get('/status-mine', (req, res) => {
    const serverIP = 'fat-development.gl.joinmc.link'; 
    const serverPort = 25565; 

    util.status(serverIP, serverPort)
        .then((result) => {
            res.json({
                online: true,
                players: result.players.online,
                maxPlayers: result.players.max,
                version: result.version.name
            });
        })
        .catch((error) => {
            res.json({ online: false, message: "Offline" });
        });
});

app.listen(PORT, () => console.log(`🔥 Servidor Online na porta ${PORT}`));
