const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const despesas = [
    {
        id: 1,
        descricao: "Almoço",
        valor: 25,
        data: "2026-10-05",
        categoria: "Alimentação"
    },
    {
        id: 2,
        descricao: "Gasolina",
        valor: 100,
        data: "2026-10-04",
        categoria: "Transporte"
    }
];

app.get("/", function(req, res) {
    res.send("Meu backend está funcionando!");
});

app.get("/despesas", function(req, res) {
    const despesas = db.prepare("SELECT * FROM despesas").all();

    res.json(despesas);
});

app.post("/despesas", function(req, res) {
    const novaDespesa = req.body;

    const resultado = db.prepare(`
        INSERT INTO despesas (descricao, valor, data, categoria)
        VALUES (?, ?, ?, ?)
    `).run(
        novaDespesa.descricao,
        novaDespesa.valor,
        novaDespesa.data,
        novaDespesa.categoria
    );

    novaDespesa.id = resultado.lastInsertRowid;

    res.json(novaDespesa);
});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});

app.delete("/despesas/:id", function(req, res) {
    const id = Number(req.params.id);

    const despesa = db.prepare(
        "SELECT * FROM despesas WHERE id = ?"
    ).get(id);

    if (!despesa) {
        return res.status(404).json({
            mensagem: "Despesa não encontrada."
        });
    }

    db.prepare(
        "DELETE FROM despesas WHERE id = ?"
    ).run(id);

    res.json(despesa);
});


app.put("/despesas/:id", function(req, res) {
    const id = Number(req.params.id);

    const despesa = db.prepare(
        "SELECT * FROM despesas WHERE id = ?"
    ).get(id);

    if (!despesa) {
        return res.status(404).json({
            mensagem: "Despesa não encontrada."
        });
    }

    db.prepare(`
        UPDATE despesas
        SET descricao = ?, valor = ?, data = ?, categoria = ?
        WHERE id = ?
    `).run(
        req.body.descricao,
        req.body.valor,
        req.body.data,
        req.body.categoria,
        id
    );

    const despesaAtualizada = db.prepare(
        "SELECT * FROM despesas WHERE id = ?"
    ).get(id);

    res.json(despesaAtualizada);
});