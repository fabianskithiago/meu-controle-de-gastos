const express = require("express");
const cors = require("cors");

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
    res.json(despesas);
});

app.post("/despesas", function(req, res) {
    const novaDespesa = req.body;

    novaDespesa.id = despesas.length + 1;

    despesas.push(novaDespesa);

    res.json(novaDespesa);
});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});

app.delete("/despesas/:id", function(req, res) {
    const id = Number(req.params.id);

    const indice = despesas.findIndex(function(despesa) {
        return despesa.id === id;
    });

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Despesa não encontrada."
        });
    }

    const despesaExcluida = despesas.splice(indice, 1);

    res.json(despesaExcluida[0]);
});