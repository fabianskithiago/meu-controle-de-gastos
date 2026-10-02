const formulario = document.querySelector("form");
const campoDescricao = document.querySelector("#descricao");
const campoValor = document.querySelector("#valor");
const campoCategoria = document.querySelector("#categoria");

const listaDespesas = document.querySelector(".despesas");
const totalGasto = document.querySelector(".total p");

let despesas = [];
let total = 0;

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

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

    mostrarDespesa(despesa);

    atualizarTotal();

    formulario.reset();
});

function mostrarDespesa(despesa) {
    const novaDespesa = document.createElement("div");

    const informacoes = document.createElement("span");

    informacoes.textContent =
        `${despesa.descricao} - ${formatarMoeda(despesa.valor)} - ${despesa.categoria}`;

    const areaBotoes = document.createElement("div");

    const botaoEditar = document.createElement("button");

    botaoEditar.textContent = "Editar";

    botaoEditar.addEventListener("click", function() {
        const novaDescricao = prompt(
            "Digite a nova descrição:",
            despesa.descricao
        );

        const novoValor = prompt(
            "Digite o novo valor:",
            despesa.valor
        );

        const novaCategoria = prompt(
            "Digite a nova categoria:",
            despesa.categoria
        );

        if (
            novaDescricao === null ||
            novoValor === null ||
            novaCategoria === null
        ) {
            return;
        }

        const valorNumerico = Number(novoValor);

        if (
            novaDescricao.trim() === "" ||
            isNaN(valorNumerico) ||
            valorNumerico <= 0 ||
            novaCategoria.trim() === ""
        ) {
            alert("Preencha todos os campos corretamente.");
            return;
        }

        total -= despesa.valor;

        despesa.descricao = novaDescricao;
        despesa.valor = valorNumerico;
        despesa.categoria = novaCategoria;

        total += despesa.valor;

        informacoes.textContent =
            `${despesa.descricao} - ${formatarMoeda(despesa.valor)} - ${despesa.categoria}`;

        atualizarTotal();
    });

    const botaoExcluir = document.createElement("button");

    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function() {
        const confirmar = confirm(
            "Tem certeza que deseja excluir esta despesa?"
        );

        if (confirmar) {
            novaDespesa.remove();

            total -= despesa.valor;

            atualizarTotal();
        }
    });

    areaBotoes.appendChild(botaoEditar);
    areaBotoes.appendChild(botaoExcluir);

    novaDespesa.appendChild(informacoes);
    novaDespesa.appendChild(areaBotoes);

    listaDespesas.appendChild(novaDespesa);
}

function atualizarTotal() {
    totalGasto.textContent = formatarMoeda(total);
}