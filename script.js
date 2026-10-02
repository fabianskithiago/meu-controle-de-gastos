const formulario = document.querySelector("form");
const campoDescricao = document.querySelector("#descricao");
const campoValor = document.querySelector("#valor");
const campoCategoria = document.querySelector("#categoria");

const listaDespesas = document.querySelector(".despesas");
const totalGasto = document.querySelector(".total p");

let despesas = [];
let total = 0;

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const descricao = campoDescricao.value;
    const valor = Number(campoValor.value);
    const categoria = campoCategoria.value;

    if (descricao === "" || valor <= 0 || categoria === "") {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const despesa = {
        descricao: descricao,
        valor: valor,
        categoria: categoria
    };

    despesas.push(despesa);

    total += valor;

    const novaDespesa = document.createElement("p");

    novaDespesa.textContent =
        `${descricao} - R$ ${valor.toFixed(2)} - ${categoria}`;

    listaDespesas.appendChild(novaDespesa);

    totalGasto.textContent = `R$ ${total.toFixed(2)}`;

    formulario.reset();
});