const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const router = express.Router();

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'R00tMySql24!',
    database: 'mind_care'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Por favor, preencha todos os campos');
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    db.query(sql, [name, email, passwordHash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('Email já cadastrado');
            }
            return res.status(500).send('Erro no servidor');
        }
        res.redirect('/login.html');
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Por favor, preencha todos os campos');
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send('Erro no servidor');

        if (results.length === 0) {
            return res.status(400).send('Email ou senha incorretos');
        }

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password_hash)) {
            return res.status(400).send('Email ou senha incorretos');
        }

         // Verificar se req.session está definido
        if (!req.session) {
            return res.status(500).send('Sessão não inicializada');
        }

        // Adicionar o nome do usuário à sessão
        req.session.user = { name: user.name };

        res.redirect('/findPsycho.html');
    });
});

router.get('/checkLoginStatus', (req, res) => {
    const isLoggedIn = !!req.session.user;
    const userName = isLoggedIn ? req.session.user.name : null;
    res.json({ isLoggedIn, userName });
});

// Endpoint de logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).send('Erro ao fazer logout');
        }
        res.clearCookie('connect.sid'); // Nome do cookie de sessão pode variar
        res.sendStatus(200); // Responde com status 200 (OK)
    });
});

router.post('/registerPsychologist', (req, res) => {
    const { name, email, phone, crp, specialty } = req.body;

    const sql = 'INSERT INTO Psicologos (name, email, phone, crp, specialty) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, crp, specialty], (error, results) => {
        if (error) {
            console.error('Erro ao registrar psicólogo:', error);
            return res.status(500).send('Erro ao registrar psicólogo');
        }
        console.log('Psicólogo registrado com sucesso!');
    });
});

router.get('/psychologists', (req, res) => {
    const sql = 'SELECT * FROM Psicologos';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao buscar psicólogos:', error);
            return res.status(500).send('Erro ao buscar psicólogos');
        }
        res.json(results);
    });
});


module.exports = router;
