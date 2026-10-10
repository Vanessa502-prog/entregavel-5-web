
console.log("===== PARTE 1 - VALIDAÇÃO DE PEDIDOS =====");

const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 80, status: "pendente" },
    { cliente: "Ana", valor: 50, status: "pago" },
    { cliente: "   ", valor: 40, status: "pago" },
    { cliente: "Pedro", valor: -10, status: "pago" },
    { cliente: "Mariana", valor: "abc", status: "pago" }
];

// Validar os pedidos
const pedidosValidos = pedidos.filter(pedido => {
    return typeof pedido.cliente === "string" &&
        pedido.cliente.trim() !== "" &&
        typeof pedido.valor === "number" &&
        Number.isFinite(pedido.valor) &&
        pedido.valor > 0;
});

console.log("Pedidos válidos:", pedidosValidos);

// Filtrar apenas os pedidos pagos
const pedidosPagos = pedidosValidos.filter(pedido => {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:", pedidosPagos);

// Calcular o total faturado
const totalFaturado = pedidosPagos.reduce((total, pedido) => {
    return total + pedido.valor;
}, 0);

console.log("Total faturado: R$", totalFaturado.toFixed(2));

// Gerar os textos dos pedidos pagos
const textosPedidos = pedidosPagos.map(pedido => {
    return `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`;
});

textosPedidos.forEach(texto => console.log(texto));


console.log("===== PARTE 2 - BUSCADOR DE CEP =====");

const formularioCep = document.querySelector("#formularioCep");
const campoCep = document.querySelector("#cep");
const botaoCep = document.querySelector("#botaoCep");
const statusCep = document.querySelector("#statusCep");
const resultadoCep = document.querySelector("#resultadoCep");
const historicoCep = document.querySelector("#historicoCep");

const historico = [];

formularioCep.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Limpar espaços e validar os oito dígitos
    const cep = campoCep.value.trim();

    if (!/^\d{8}$/.test(cep)) {
        statusCep.textContent = "Digite um CEP válido com 8 dígitos.";
        resultadoCep.replaceChildren();
        return;
    }

    botaoCep.disabled = true;
    statusCep.textContent = "Buscando...";
    resultadoCep.replaceChildren();

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`,
            { signal: AbortSignal.timeout(5000) }
        );

        if (!resposta.ok) {
            throw new Error("Falha na conexão.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            statusCep.textContent = "CEP não encontrado.";
            return;
        }

        // Mostrar o endereço encontrado
        resultadoCep.replaceChildren();

        const campos = [
            ["Rua", dados.logradouro],
            ["Bairro", dados.bairro],
            ["Cidade", dados.localidade],
            ["UF", dados.uf]
        ];

        campos.forEach(([rotulo, valor]) => {
            const dt = document.createElement("dt");
            const dd = document.createElement("dd");

            dt.textContent = rotulo;
            dd.textContent = valor || "Não informado";

            resultadoCep.append(dt, dd);
        });

        statusCep.textContent = "";

        // Guardar o CEP no histórico
        historico.push({
            cep: cep,
            cidade: dados.localidade || "Não informada",
            uf: dados.uf || "--"
        });

        historicoCep.replaceChildren();

        historico.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `${item.cep} — ${item.cidade}/${item.uf}`;
            historicoCep.append(li);
        });

    } catch (erro) {
        if (erro.name === "TimeoutError") {
            statusCep.textContent = "A busca demorou demais. Tente novamente.";
        } else {
            statusCep.textContent = "Falha na conexão. Verifique sua internet e tente novamente.";
        }

        resultadoCep.replaceChildren();

    } finally {
        botaoCep.disabled = false;
    }
});


console.log("===== PARTE 3 - MINI POKÉDEX =====");

const formularioPokemon = document.querySelector("#formularioPokemon");
const campoPokemon = document.querySelector("#nomePokemon");
const botaoPokemon = document.querySelector("#botaoPokemon");
const statusPokemon = document.querySelector("#statusPokemon");
const resultadoPokemon = document.querySelector("#resultadoPokemon");

formularioPokemon.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = campoPokemon.value.trim().toLowerCase();

    if (nome === "") {
        statusPokemon.textContent = "Digite o nome de um Pokémon.";
        resultadoPokemon.replaceChildren();
        return;
    }

    botaoPokemon.disabled = true;
    statusPokemon.textContent = "Buscando Pokémon...";
    resultadoPokemon.replaceChildren();

    try {
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`,
            { signal: AbortSignal.timeout(5000) }
        );

        if (resposta.status === 404) {
            throw new Error("NOT_FOUND");
        }

        if (!resposta.ok) {
            throw new Error("CONNECTION");
        }

        const pokemon = await resposta.json();

        // Criar os elementos com os dados do Pokémon
        const tituloPokemon = document.createElement("h3");
        tituloPokemon.textContent =
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

        resultadoPokemon.append(tituloPokemon);

        if (pokemon.sprites.front_default) {
            const imagem = document.createElement("img");
            imagem.src = pokemon.sprites.front_default;
            imagem.alt = `Imagem de ${pokemon.name}`;
            resultadoPokemon.append(imagem);
        } else {
            const avisoImagem = document.createElement("p");
            avisoImagem.textContent = "Imagem não disponível.";
            resultadoPokemon.append(avisoImagem);
        }

        const tituloTipos = document.createElement("p");
        tituloTipos.textContent = "Tipos:";
        resultadoPokemon.append(tituloTipos);

        const listaTipos = document.createElement("ul");

        pokemon.types.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item.type.name;
            listaTipos.append(li);
        });

        resultadoPokemon.append(listaTipos);
        statusPokemon.textContent = "";

    } catch (erro) {
        resultadoPokemon.replaceChildren();

        if (erro.message === "NOT_FOUND") {
            statusPokemon.textContent = "Pokémon não encontrado.";
        } else if (erro.name === "TimeoutError") {
            statusPokemon.textContent = "A busca demorou demais. Tente novamente.";
        } else {
            statusPokemon.textContent = "Falha na conexão. Verifique sua internet e tente novamente.";
        }

    } finally {
        botaoPokemon.disabled = false;
    }
});
