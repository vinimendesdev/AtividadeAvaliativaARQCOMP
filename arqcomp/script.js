// Palavras do jogo: linha e coluna começam em 0 (canto superior esquerdo)
let palavras = [
    { num: 1,  dir: `V`, resposta: `MEMORIADEMASSA`, linha: 0,  coluna: 2,  pista: `Guarda arquivos e programas em grande volume, de forma permanente, como HD e SSD.` },
    { num: 2,  dir: `V`, resposta: `REGISTRADORES`, linha: 0,  coluna: 6,  pista: `Pequenas posições internas da CPU, as mais rápidas de todas, que guardam valores em uso.` },
    { num: 3,  dir: `V`, resposta: `DMA`,            linha: 0,  coluna: 10, pista: `Controlador que move blocos entre periféricos e a RAM sem passar pela CPU.` },
    { num: 4,  dir: `V`, resposta: `DATABUS`,        linha: 1,  coluna: 0,  pista: `Via bidirecional que leva a informação entre CPU, memória e periféricos.` },
    { num: 5,  dir: `H`, resposta: `EEPROM`,         linha: 1,  coluna: 5,  pista: `Memória não volátil regravável em pequenos trechos, comum em microcontroladores para guardar configurações.` },
    { num: 6,  dir: `V`, resposta: `ROM`,            linha: 1,  coluna: 8,  pista: `Memória de conteúdo fixo gravado na fabricação, guarda o código de inicialização.` },
    { num: 7,  dir: `V`, resposta: `ADDRESSBUS`,     linha: 3,  coluna: 11, pista: `Via de mão única em que a CPU informa qual posição da memória quer acessar.` },
    { num: 8,  dir: `H`, resposta: `RAM`,            linha: 4,  coluna: 2,  pista: `Memória principal, rápida e volátil, onde ficam os softwares em execução.` },
    { num: 9,  dir: `H`, resposta: `ULA`,            linha: 6,  coluna: 0,  pista: `Circuito da CPU que executa somas, subtrações e comparações entre valores.` },
    { num: 10, dir: `H`, resposta: `QUADCORE`,       linha: 7,  coluna: 4,  pista: `Processador que reúne quatro unidades de processamento independentes em um só chip.` },
    { num: 11, dir: `V`, resposta: `CPU`,            linha: 7,  coluna: 8,  pista: `Componente que executa as instruções dos programas; reúne UC, ULA e registradores.` },
    { num: 12, dir: `H`, resposta: `UC`,             linha: 9,  coluna: 8,  pista: `Parte da CPU que decodifica instruções e comanda os demais componentes.` },
    { num: 13, dir: `V`, resposta: `CACHE`,          linha: 9,  coluna: 9,  pista: `Memória pequena e muito rápida entre CPU e RAM, guarda dados usados com frequência.` },
    { num: 14, dir: `H`, resposta: `DUALCORE`,       linha: 10, coluna: 0,  pista: `Processador que reúne duas unidades de processamento independentes em um só chip.` },
    { num: 15, dir: `H`, resposta: `FLASH`,          linha: 13, coluna: 0,  pista: `Memória não volátil regravável em blocos, usada em pendrives e cartões SD.` }
];

// Dicas rápidas que aparecem enquanto a pessoa escreve (nunca entregam a resposta)
let dicas = {
    MEMORIADEMASSA: `Não perde nada ao desligar o computador.`,
    REGISTRADORES: `Ficam dentro da CPU e são ultrarrápidos.`,
    DMA: `Conversa direto com a RAM, sem incomodar a CPU.`,
    DATABUS: `A informação vai e volta por ele.`,
    EEPROM: `Apaga e regrava byte a byte.`,
    ROM: `Já vem gravada de fábrica.`,
    ADDRESSBUS: `Só vai da CPU para a memória, nunca volta.`,
    RAM: `Perde tudo quando o computador desliga.`,
    ULA: `Faz as contas dentro da CPU.`,
    QUADCORE: `Quatro de uma vez só.`,
    CPU: `É o chip principal do computador.`,
    UC: `Só duas letras: é quem comanda.`,
    CACHE: `Atalho rápido para a CPU não esperar.`,
    DUALCORE: `Dois de uma vez só.`,
    FLASH: `Mesma tecnologia dos SSDs.`
};

let LINHAS = 14;
let COLUNAS = 12;
let matriz = [];    // inputs de cada casa (null = sem casa)
let mapa = [];      // índice da palavra horizontal (H) e vertical (V) de cada casa
let solucao = [];   // letra certa de cada casa
let numeros = {};   // número da pista que começa em cada casa
let direcao = `H`;
let ultimaChave = ``;

function posicao(w, i) {
    let l = w.linha;
    let c = w.coluna;
    if (w.dir === `H`) {
        c = c + i;
    } else {
        l = l + i;
    }
    return { l: l, c: c };
}

function criarTabuleiro() {
    let tabuleiro = document.getElementById(`tabuleiro`);
    tabuleiro.style.gridTemplateColumns = `repeat(${COLUNAS}, var(--cel))`;

    for (let l = 0; l < LINHAS; l++) {
        matriz.push([]);
        mapa.push([]);
        solucao.push([]);
        for (let c = 0; c < COLUNAS; c++) {
            matriz[l].push(null);
            mapa[l].push({ H: -1, V: -1 });
            solucao[l].push(``);
        }
    }

    for (let p = 0; p < palavras.length; p++) {
        let w = palavras[p];
        numeros[`${w.linha}_${w.coluna}`] = w.num;
        for (let i = 0; i < w.resposta.length; i++) {
            let pos = posicao(w, i);
            mapa[pos.l][pos.c][w.dir] = p;
            solucao[pos.l][pos.c] = w.resposta.charAt(i);
        }
    }

    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (mapa[l][c].H === -1 && mapa[l][c].V === -1) {
                let vazia = document.createElement(`div`);
                vazia.className = `vazia`;
                tabuleiro.appendChild(vazia);
            } else {
                criarCasa(tabuleiro, l, c);
            }
        }
    }
}

function criarCasa(tabuleiro, l, c) {
    let div = document.createElement(`div`);
    div.className = `celula`;
    div.id = `celula${l}_${c}`;

    let chave = `${l}_${c}`;
    if (numeros[chave] !== undefined) {
        let span = document.createElement(`span`);
        span.className = `numero`;
        span.textContent = `${numeros[chave]}`;
        div.appendChild(span);
    }

    let input = document.createElement(`input`);
    input.type = `text`;
    input.maxLength = 1;
    input.autocomplete = `off`;
    input.id = `iCelula${l}_${c}`;
    input.setAttribute(`aria-label`, `Linha ${l + 1}, coluna ${c + 1}`);

    input.addEventListener(`focus`, function () {
        aoFocar(l, c);
    });
    input.addEventListener(`click`, function () {
        aoClicar(l, c);
    });
    input.addEventListener(`input`, function () {
        aoDigitar(l, c);
    });
    input.addEventListener(`keydown`, function (evento) {
        aoTeclar(evento, l, c);
    });

    div.appendChild(input);
    tabuleiro.appendChild(div);
    matriz[l][c] = input;
}

function criarPistas() {
    for (let p = 0; p < palavras.length; p++) {
        let w = palavras[p];
        let li = document.createElement(`li`);
        li.id = `pista${p}`;
        li.innerHTML = `<span class="n">${w.num}.</span><span class="texto">${w.pista}</span><span class="status"></span>`;
        li.addEventListener(`click`, function () {
            direcao = w.dir;
            matriz[w.linha][w.coluna].focus();
            destacar(w.linha, w.coluna);
        });

        if (w.dir === `H`) {
            document.getElementById(`listaH`).appendChild(li);
        } else {
            document.getElementById(`listaV`).appendChild(li);
        }
    }
    document.getElementById(`contador`).textContent = `0 de ${palavras.length} palavras`;
}

function aoFocar(l, c) {
    if (mapa[l][c][direcao] === -1) {
        if (direcao === `H`) {
            direcao = `V`;
        } else {
            direcao = `H`;
        }
    }
    destacar(l, c);
}

function aoClicar(l, c) {
    let chave = `${l}_${c}`;
    if (chave === ultimaChave && mapa[l][c].H !== -1 && mapa[l][c].V !== -1) {
        if (direcao === `H`) {
            direcao = `V`;
        } else {
            direcao = `H`;
        }
        destacar(l, c);
    }
    ultimaChave = chave;
}

function destacar(l, c) {
    let marcadas = document.querySelectorAll(`.palavra-ativa, .ativa, .pista-ativa`);
    for (let i = 0; i < marcadas.length; i++) {
        marcadas[i].classList.remove(`palavra-ativa`, `ativa`, `pista-ativa`);
    }

    let p = mapa[l][c][direcao];
    if (p !== -1) {
        let w = palavras[p];
        for (let i = 0; i < w.resposta.length; i++) {
            let pos = posicao(w, i);
            document.getElementById(`celula${pos.l}_${pos.c}`).classList.add(`palavra-ativa`);
        }
        document.getElementById(`pista${p}`).classList.add(`pista-ativa`);
    }
    document.getElementById(`celula${l}_${c}`).classList.add(`ativa`);

    let caixa = document.getElementById(`dica`);
    if (p !== -1) {
        let w = palavras[p];
        caixa.textContent = `💡 Dica (${w.resposta.length} letras): ${dicas[w.resposta]}`;
        caixa.classList.add(`visivel`);
    } else {
        caixa.textContent = ``;
        caixa.classList.remove(`visivel`);
    }
}

// Move dentro da mesma palavra (passo 1 = frente, -1 = trás)
function moverNaPalavra(l, c, passo) {
    let nl = l;
    let nc = c;
    if (direcao === `H`) {
        nc = c + passo;
    } else {
        nl = l + passo;
    }

    if (nl >= 0 && nl < LINHAS && nc >= 0 && nc < COLUNAS) {
        if (matriz[nl][nc] !== null && mapa[nl][nc][direcao] === mapa[l][c][direcao]) {
            matriz[nl][nc].focus();
        }
    }
}

function aoDigitar(l, c) {
    let input = matriz[l][c];
    let letra = input.value.normalize(`NFD`).replace(/[^a-zA-Z]/g, ``).toUpperCase();
    input.value = letra;

    let div = document.getElementById(`celula${l}_${c}`);
    div.classList.remove(`certa`, `errada`, `revelada`);

    if (letra !== ``) {
        moverNaPalavra(l, c, 1);
    }
}

function aoTeclar(evento, l, c) {
    let tecla = evento.key;
    let dl = 0;
    let dc = 0;

    if (tecla === `ArrowRight`) {
        dc = 1;
    } else if (tecla === `ArrowLeft`) {
        dc = -1;
    } else if (tecla === `ArrowDown`) {
        dl = 1;
    } else if (tecla === `ArrowUp`) {
        dl = -1;
    }

    if (dl !== 0 || dc !== 0) {
        evento.preventDefault();
        let nl = l + dl;
        let nc = c + dc;
        // pula espaços vazios até achar a próxima casa
        while (nl >= 0 && nl < LINHAS && nc >= 0 && nc < COLUNAS && matriz[nl][nc] === null) {
            nl = nl + dl;
            nc = nc + dc;
        }
        if (nl >= 0 && nl < LINHAS && nc >= 0 && nc < COLUNAS) {
            if (dc !== 0 && mapa[nl][nc].H !== -1) {
                direcao = `H`;
            } else if (dl !== 0 && mapa[nl][nc].V !== -1) {
                direcao = `V`;
            }
            matriz[nl][nc].focus();
        }
    } else if (tecla === `Backspace` && matriz[l][c].value === ``) {
        evento.preventDefault();
        moverNaPalavra(l, c, -1);
    } else if (tecla === `Enter`) {
        conferir();
    }
}

function conferir() {
    let acertos = 0;

    for (let p = 0; p < palavras.length; p++) {
        let w = palavras[p];
        let certa = true;
        for (let i = 0; i < w.resposta.length; i++) {
            let pos = posicao(w, i);
            let casa = document.getElementById(`celula${pos.l}_${pos.c}`);
            if (matriz[pos.l][pos.c].value !== w.resposta.charAt(i) || casa.classList.contains(`revelada`)) {
                certa = false;
            }
        }

        let li = document.getElementById(`pista${p}`);
        let status = li.querySelector(`.status`);
        li.classList.remove(`certa`, `errada`);
        if (certa) {
            acertos++;
            li.classList.add(`certa`);
            status.textContent = `✓ certa`;
        } else {
            li.classList.add(`errada`);
            status.textContent = `✗ errada`;
        }
    }

    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (matriz[l][c] !== null) {
                let div = document.getElementById(`celula${l}_${c}`);
                let letra = matriz[l][c].value;
                if (!div.classList.contains(`revelada`)) {
                    div.classList.remove(`certa`, `errada`);
                    if (letra !== `` && letra === solucao[l][c]) {
                        div.classList.add(`certa`);
                    } else if (letra !== ``) {
                        div.classList.add(`errada`);
                    }
                }
            }
        }
    }

    for (let p = 0; p < palavras.length; p++) {
        if (document.getElementById(`pista${p}`).classList.contains(`errada`)) {
            let w = palavras[p];
            for (let i = 0; i < w.resposta.length; i++) {
                let pos = posicao(w, i);
                let casa = document.getElementById(`celula${pos.l}_${pos.c}`);
                if (matriz[pos.l][pos.c].value !== solucao[pos.l][pos.c]) {
                    matriz[pos.l][pos.c].value = solucao[pos.l][pos.c];
                    casa.classList.remove(`certa`, `errada`);
                    casa.classList.add(`revelada`);
                }
            }
        }
    }

    let total = palavras.length;
    document.getElementById(`contador`).textContent = `${acertos} de ${total} palavras`;

    let msg = document.getElementById(`msg`);
    if (acertos === total) {
        msg.textContent = `Parabéns! Você acertou as ${total} palavras.`;
    } else if (acertos === 0) {
        msg.textContent = `Nenhuma palavra certa ainda. As respostas apareceram em azul; clique em Reiniciar para tentar de novo.`;
    } else {
        msg.textContent = `Faltam ${total - acertos} palavras. As erradas foram completadas em azul para mostrar a resposta certa.`;
    }
}

function reiniciar() {
    for (let l = 0; l < LINHAS; l++) {
        for (let c = 0; c < COLUNAS; c++) {
            if (matriz[l][c] !== null) {
                matriz[l][c].value = ``;
                document.getElementById(`celula${l}_${c}`).classList.remove(`certa`, `errada`, `revelada`, `ativa`, `palavra-ativa`);
            }
        }
    }

    for (let p = 0; p < palavras.length; p++) {
        let li = document.getElementById(`pista${p}`);
        li.classList.remove(`certa`, `errada`, `pista-ativa`);
        li.querySelector(`.status`).textContent = ``;
    }

    direcao = `H`;
    ultimaChave = ``;
    document.getElementById(`dica`).textContent = ``;
    document.getElementById(`dica`).classList.remove(`visivel`);
    document.getElementById(`contador`).textContent = `0 de ${palavras.length} palavras`;
    document.getElementById(`msg`).textContent = `Tabuleiro reiniciado. Boa sorte!`;
}

criarTabuleiro();
criarPistas();
document.getElementById(`btnConferir`).addEventListener(`click`, conferir);
document.getElementById(`btnReiniciar`).addEventListener(`click`, reiniciar);