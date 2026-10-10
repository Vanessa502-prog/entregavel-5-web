
# Entregável 5 - Objetos, Dados e Assincronismo

## Descrição

Este projeto foi desenvolvido para praticar a manipulação de objetos e arrays, o uso de Promises, async/await e o consumo de APIs com JavaScript. Ele contém um exercício de validação de pedidos, um buscador de CEP e uma Mini Pokédex.

## Parte 1 - Manipulação e validação de dados

Os pedidos são armazenados em um array de objetos. O método `filter` é utilizado para selecionar pedidos válidos e depois filtrar os que possuem status "pago".

O método `reduce` calcula o total faturado, enquanto `map` gera textos com os nomes dos clientes e os valores formatados com `toFixed(2)`. O `forEach` imprime os resultados no Console.

## Parte 2 - Buscador de CEP

O buscador consulta a API ViaCEP usando `fetch` com `async/await`. O CEP precisa conter exatamente oito dígitos.

A tela apresenta os estados de carregamento, erro, CEP não encontrado e sucesso. No resultado, os elementos são criados com `createElement` e preenchidos com `textContent`. O histórico guarda os CEPs pesquisados e suas cidades.

## Parte 3 - Mini Pokédex

A Pokédex consulta a PokéAPI pelo nome do Pokémon. O nome é convertido para minúsculo antes da busca.

Quando a consulta é bem-sucedida, são exibidos o nome, a imagem e os tipos do Pokémon. Também são tratados erros de conexão, tempo limite e Pokémon não encontrado.

## Parte 4 - Por que Promise.all pode ser mais rápido que vários await seguidos?

Quando usamos vários `await` seguidos, cada operação espera a anterior terminar antes de começar a próxima. Com `Promise.all`, podemos iniciar várias requisições independentes ao mesmo tempo e esperar que todas terminem. Isso pode reduzir o tempo total, principalmente quando as operações dependem da rede.

O `Promise.all` rejeita se uma das Promises rejeitar, por isso também é importante pensar no tratamento de erros.

## Event Loop

O JavaScript executa primeiro o código síncrono. Depois, processa as microtarefas, como continuações de Promises e `await`, antes de avançar para tarefas como callbacks de `setTimeout`, conforme a fila de tarefas e o funcionamento do navegador.

## Como executar

1. Abra o arquivo `index.html` no navegador, preferencialmente usando o Live Server.
2. Pressione F12 e abra a aba Console.
3. Pesquise um CEP válido, como `01001000`.
4. Teste um CEP inválido e um CEP inexistente.
5. Pesquise Pokémon como `pikachu` e teste um nome inexistente.
6. Confira as mensagens de carregamento, os resultados e os erros.

As consultas dependem de conexão com a internet e da disponibilidade das APIs.
