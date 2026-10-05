const formulario = document.querySelector("form");
const campoDescricao = document.querySelector("#descricao");
const campoValor = document.querySelector("#valor");
const campoCategoria = document.querySelector("#categoria");
const campoData = document.querySelector("#data");

const listaDespesas = document.querySelector(".lista-despesas");
const mensagemVazia = document.querySelector(".mensagem-vazia");
const totalGasto = document.querySelector(".total p");

let despesas = [];

function mostrarMensagemVazia() {
    if (despesas.length === 0) {
        mensagemVazia.style.display = "block";
    } else {
        mensagemVazia.style.display = "none";
    }
}

function calcularTotal() {
    let soma = 0;

    despesas.forEach(function (despesa) {
        soma += despesa.valor;
    });

    return soma;
}

function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

/*
function salvarDespesas() {
    localStorage.setItem("despesas", JSON.stringify(despesas));
}
*/

/*
function carregarDespesas() {
    const dadosSalvos = localStorage.getItem("despesas");

    if (dadosSalvos !== null) {
        despesas = JSON.parse(dadosSalvos);

        despesas.forEach(function(despesa) {
            mostrarDespesa(despesa);
        });

        atualizarTotal();

    }

    mostrarMensagemVazia();
}
*/

async function adicionarDespesa() {

    const descricao = campoDescricao.value;
    const valor = Number(campoValor.value);
    const categoria = campoCategoria.value;
    const data = campoData.value;


    if (descricao === "" || valor <= 0 || categoria === "") {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const despesa = {
        descricao: descricao,
        valor: valor,
        categoria: categoria,
        data: data
    };

    try {
        await salvarDespesaNoBackend(despesa);

        despesas.push(despesa);

        mostrarMensagemVazia();

        mostrarDespesa(despesa);

        atualizarTotal();

        formulario.reset();
    } catch (erro) {
        alert("Não foi possível salvar a despesa.");
        console.error(erro);
    }
}

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    adicionarDespesa();
});


async function editarDespesa(despesa, informacoes) {
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

    const novaData = prompt(
        "Digite a nova data:",
        despesa.data
    );

    if (
        novaDescricao === null ||
        novoValor === null ||
        novaData === null ||
        novaCategoria === null

    ) {
        return;
    }

    const valorNumerico = Number(novoValor);

    if (
        novaDescricao.trim() === "" ||
        isNaN(valorNumerico) ||
        valorNumerico <= 0 ||
        novaCategoria.trim() === "" ||
        novaData.trim() === ""
    ) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    despesa.descricao = novaDescricao;
    despesa.valor = valorNumerico;
    despesa.data = novaData;
    despesa.categoria = novaCategoria;

    try {
        const resposta = await fetch(
            `http://localhost:3000/despesas/${despesa.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    descricao: novaDescricao,
                    valor: valorNumerico,
                    data: novaData,
                    categoria: novaCategoria
                })
            }
        );

        informacoes.textContent =
            `${despesa.descricao} - ${formatarMoeda(despesa.valor)} - ${despesa.categoria} - ${formatarData(despesa.data)}`;

        atualizarTotal();

        //salvarDespesas();
    } catch (erro) {
        alert("Não foi possível editar a despesa.");
        console.error(erro);
    }
}

    async function excluirDespesa(despesa, elementoDespesa) {
        const confirmar = confirm(
            "Tem certeza que deseja excluir esta despesa?"
        );

        if (confirmar) {

            const resposta = await fetch(
                `http://localhost:3000/despesas/${despesa.id}`,
                {
                    method: "DELETE"
                }
            );

            const dados = await resposta.json();

            console.log(dados);

            elementoDespesa.remove();

            despesas = despesas.filter(function (item) {
                return item !== despesa;
            });

            mostrarMensagemVazia();

            atualizarTotal();

            //salvarDespesas();
        }
    }

    function formatarData(data) {
        const partesData = data.split("-");
        const ano = partesData[0];
        const mes = partesData[1];
        const dia = partesData[2];
        return `${dia}/${mes}/${ano}`;
    }

    function mostrarDespesa(despesa) {
        const novaDespesa = document.createElement("div");

        const informacoes = document.createElement("span");

        informacoes.textContent =
            `${despesa.descricao} - ${formatarMoeda(despesa.valor)} - ${despesa.categoria} - ${formatarData(despesa.data)}`;

        const areaBotoes = document.createElement("div");

        const botaoEditar = document.createElement("button");

        botaoEditar.textContent = "Editar";

        botaoEditar.addEventListener("click", function () {
            editarDespesa(despesa, informacoes);
        });

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function () {
            excluirDespesa(despesa, novaDespesa);
        });

        areaBotoes.appendChild(botaoEditar);
        areaBotoes.appendChild(botaoExcluir);

        novaDespesa.appendChild(informacoes);
        novaDespesa.appendChild(areaBotoes);

        listaDespesas.appendChild(novaDespesa);
    }

    function atualizarTotal() {
        const total = calcularTotal();

        totalGasto.textContent = formatarMoeda(total);
    }

    async function carregarDespesasDoBackend() {
        const resposta = await fetch("http://localhost:3000/despesas");
        const dados = await resposta.json();

        despesas = dados;

        dados.forEach(function (despesa) {
            mostrarDespesa(despesa);
        });

        console.log(dados);
    }

    async function salvarDespesaNoBackend(despesa) {
        const resposta = await fetch("http://localhost:3000/despesas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(despesa)
        });

        const dados = await resposta.json();

        despesa.id = dados.id;
    }


    carregarDespesasDoBackend();