// calendario.js
// Calendário dinâmico: troca de mês + caixinha com informações do dia.

(function () {
    const MESES = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const eventos = {
        "2026-10-20": [
            { hora: "14:00", titulo: "Treino de Vôlei", local: "Ginasio" },
            { hora: "16:00", titulo: "Treino de Futsal", local: "Ginasio" }
        ],
        "2026-10-22": [
            { hora: "15:30", titulo: "Treino de Atletismo", local: "Ginasio" }
        ]
    };

    const titulo = document.getElementById("cal-titulo");
    const corpo = document.getElementById("cal-corpo");
    const btnAnterior = document.getElementById("mes-anterior");
    const btnProximo = document.getElementById("mes-proximo");
    const modal = document.getElementById("cal-modal");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalConteudo = document.getElementById("modal-conteudo");
    const modalFechar = document.getElementById("modal-fechar");

    if (!titulo || !corpo) return;

    const hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth(); 

    function chaveDaData(a, m, d) {
        return a + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    }

    function desenhar() {
        titulo.textContent = MESES[mes] + " " + ano;
        corpo.innerHTML = "";

        const diaSemanaDoPrimeiro = new Date(ano, mes, 1).getDay(); 
        const totalDias = new Date(ano, mes + 1, 0).getDate();   

        let dia = 1;
        while (dia <= totalDias) {
            const linha = document.createElement("tr");

            for (let coluna = 0; coluna < 7; coluna++) {
                const celula = document.createElement("td");
                const antesDoPrimeiro = corpo.children.length === 0 && coluna < diaSemanaDoPrimeiro;

                if (antesDoPrimeiro || dia > totalDias) {
                    celula.className = "vazio";
                } else {
                    const diaAtual = dia;
                    const botao = document.createElement("button");
                    botao.type = "button";
                    botao.className = "dia";
                    botao.textContent = diaAtual;

                    const ehHoje =
                        diaAtual === hoje.getDate() &&
                        mes === hoje.getMonth() &&
                        ano === hoje.getFullYear();
                    if (ehHoje) botao.classList.add("hoje");

                    if (eventos[chaveDaData(ano, mes, diaAtual)]) {
                        botao.classList.add("com-evento");
                    }

                    botao.addEventListener("click", function () {
                        abrirDia(diaAtual);
                    });

                    celula.appendChild(botao);
                    dia++;
                }
                linha.appendChild(celula);
            }
            corpo.appendChild(linha);
        }
    }

    function abrirDia(dia) {
        const data = new Date(ano, mes, dia);
        modalTitulo.textContent = data.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const lista = eventos[chaveDaData(ano, mes, dia)];
        modalConteudo.innerHTML = "";

        if (!lista || lista.length === 0) {
            const p = document.createElement("p");
            p.className = "sem-eventos";
            p.textContent = "Nenhuma atividade neste dia.";
            modalConteudo.appendChild(p);
        } else {
            lista.forEach(function (ev) {
                const item = document.createElement("div");
                item.className = "evento";

                const hora = document.createElement("span");
                hora.className = "evento-hora";
                hora.textContent = ev.hora;

                const info = document.createElement("div");
                const nome = document.createElement("strong");
                nome.textContent = ev.titulo;
                const local = document.createElement("small");
                local.textContent = ev.local;
                info.appendChild(nome);
                info.appendChild(local);

                item.appendChild(hora);
                item.appendChild(info);
                modalConteudo.appendChild(item);
            });
        }

        modal.hidden = false;
        modalFechar.focus();
    }

    function fecharModal() {
        modal.hidden = true;
    }

    btnAnterior.addEventListener("click", function () {
        mes--;
        if (mes < 0) { mes = 11; ano--; }
        desenhar();
    });

    btnProximo.addEventListener("click", function () {
        mes++;
        if (mes > 11) { mes = 0; ano++; }
        desenhar();
    });

    modalFechar.addEventListener("click", fecharModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) fecharModal();
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !modal.hidden) fecharModal();
    });

    desenhar();
})();
