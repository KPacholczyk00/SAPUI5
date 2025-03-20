const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;
const DATA_PATH = path.join(__dirname, 'webapp', 'model', 'Orders.json');

// Middleware do obsługi statycznych plików
app.use(express.static("webapp", {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    }
}));

app.use(cors());
app.use(express.json());

// Endpoint testowy
app.get('/api', (req, res) => res.send({ message: "API działa!" }));

// Sprawdzenie i inicjalizacja pliku Orders.json
if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({ orders: [] }, null, 2));
    console.log("✅ Utworzono plik Orders.json");
}

// Pobieranie zamówień
app.get('/orders', (req, res) => {
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error("❌ Błąd odczytu pliku Orders.json", err);
            return res.status(500).json({ error: "Błąd odczytu pliku" });
        }
        try {
            const orders = JSON.parse(data);
            res.json(orders);
        } catch (parseErr) {
            console.error("❌ Błąd parsowania Orders.json", parseErr);
            res.status(500).json({ error: "Błąd parsowania danych" });
        }
    });
});

// Dodawanie zamówienia
app.post('/orders', (req, res) => {
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        let orders = [];
        if (!err && data) {
            try {
                orders = JSON.parse(data).orders || [];
            } catch (parseErr) {
                return res.status(500).json({ error: "Błąd parsowania danych" });
            }
        }

        const newId = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
        const newOrder = { id: newId, ...req.body, status: "Nowe", date: new Date().toLocaleString() };

        orders.push(newOrder);
        fs.writeFile(DATA_PATH, JSON.stringify({ orders }, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Błąd zapisu pliku" });
            res.status(201).json(newOrder);
        });
    });
});

// Usuwanie zamówienia
app.delete('/orders/:id', (req, res) => {
    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Błąd odczytu pliku" });

        let orders = JSON.parse(data).orders;
        const newOrders = orders.filter(o => o.id !== parseInt(req.params.id));

        if (orders.length === newOrders.length) {
            return res.status(404).json({ error: "Zamówienie nie znalezione" });
        }

        fs.writeFile(DATA_PATH, JSON.stringify({ orders: newOrders }, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: "Błąd zapisu pliku" });
            res.json({ message: "Usunięto zamówienie" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`✅ Serwer API działa na http://127.0.0.1:${PORT}`);
});
