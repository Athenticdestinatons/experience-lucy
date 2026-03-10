const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const DATA_FILE = path.join(__dirname, '../data/lucy_memory.json');
const TOKEN = process.env.CEO_TOKEN || 'default-dev-token';

if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({ interactions: [] }));

const checkToken = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '') || req.query.token;
    if (token !== TOKEN) return res.status(403).json({ error: 'Unauthorized' });
    next();
};

app.post('/api/omega', checkToken, (req, res) => {
    const { command, args } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    data.interactions.push({ timestamp: new Date().toISOString(), command, args });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ status: 'logged', id: data.interactions.length });
});

app.get('/health', (req, res) => res.send('OK'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Lucy Omega running on port ${PORT}`));
