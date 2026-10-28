import { Select, ObterTodos, InserirDado } from "../../../server/modulo.js";

document.addEventListener("DOMContentLoaded", async () => {
    const selectTreino = document.getElementById("selectTreinoEnvio");
    const tabelaDestinatarios = document.getElementById("tabelaDestinatarios");
    const formEnvio = document.getElementById("formEnvioMensagem");

    let alunosInscritosAtuais = [];

    try {
        // 1. Carrega todos os treinos cadastrados usando ObterTodos
        const treinos = await ObterTodos("Treino");

        treinos.forEach(treino => {
            const option = document.createElement("option");
            option.value = treino.id_treino;
            option.textContent = `${treino.titulo || 'Treino'} (Modalidade ID: ${treino.id_modalidade})`;
            selectTreino.appendChild(option);
        });

    } catch (erro) {
        console.error("Erro ao carregar treinos:", erro);
    }

    // 2. Quando o professor seleciona um treino, busca os alunos inscritos via Select
    selectTreino.addEventListener("change", async (e) => {
        const idTreinoSelecionado = parseInt(e.target.value, 10);

        if (isNaN(idTreinoSelecionado)) {
            tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum treino selecionado.</td></tr>`;
            alunosInscritosAtuais = [];
            return;
        }

        tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">A carregar alunos inscritos...</td></tr>`;

        try {
            // Busca o treino correspondente
            const treinosCadastrados = await Select("Treino", "id_treino", idTreinoSelecionado);
            if (treinosCadastrados.length === 0) return;
            const treinoObj = treinosCadastrados[0];

            // Busca as inscrições feitas nesta modalidade
            const inscricoes = await Select("Inscricao", "id_modalidade", treinoObj.id_modalidade);

            if (inscricoes.length === 0) {
                tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum aluno inscrito nesta modalidade.</td></tr>`;
                alunosInscritosAtuais = [];
                return;
            }

            tabelaDestinatarios.innerHTML = "";
            alunosInscritosAtuais = [];

            for (const inscricao of inscricoes) {
                const matriculaAluno = inscricao.matricula_aluno;
                if (!matriculaAluno) continue;

                // Busca os dados detalhados do aluno
                const alunos = await Select("Aluno", "matricula", matriculaAluno);
                if (alunos.length > 0) {
                    const aluno = alunos[0];
                    alunosInscritosAtuais.push(aluno);

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><input type="checkbox" class="check-aluno" value="${aluno.matricula}" checked></td>
                        <td><b>${aluno.matricula}</b></td>
                        <td>${aluno.nome || 'Sem Nome'}</td>
                        <td>Turma ID: ${aluno.id_turma ?? '-'}</td>
                    `;
                    tabelaDestinatarios.appendChild(tr);
                }
            }

            if (alunosInscritosAtuais.length === 0) {
                tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum aluno encontrado para estas inscrições.</td></tr>`;
            }

        } catch (erro) {
            console.error("Erro ao buscar destinatários:", erro);
            tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar destinatários.</td></tr>`;
        }
    });

    // 3. Envio da mensagem em massa integrada com o módulo
    if (formEnvio) {
        formEnvio.addEventListener("submit", async (e) => {
            e.preventDefault();

            const titulo = document.getElementById("tituloMensagem").value.trim();
            const conteudo = document.getElementById("conteudoMensagem").value.trim();
            const idTreino = parseInt(selectTreino.value, 10);

            if (isNaN(idTreino)) {
                alert("Por favor, selecione um treino.");
                return;
            }

            const checkboxesSelecionados = document.querySelectorAll(".check-aluno:checked");
            if (checkboxesSelecionados.length === 0) {
                alert("Selecione pelo menos um aluno destinatário.");
                return;
            }

            try {
                // Salva a mensagem unificada usando a função InserirDado do módulo
                const novaMensagem = await InserirDado("Mensagem", {
                    id_mensagem: Date.now(),
                    titulo: titulo,
                    conteudo: conteudo
                });

                // Cria as notificações correspondentes para cada aluno seleccionado
                for (const checkbox of checkboxesSelecionados) {
                    const matricula = checkbox.value;
                    const alunoEncontrado = alunosInscritosAtuais.find(a => a.matricula === matricula);
                    const idAlunoNum = alunoEncontrado ? alunoEncontrado.id_aluno : 0;

                    await InserirDado("Notificacao", {
                        id_notificacao: Date.now() + Math.floor(Math.random() * 10000),
                        id_mensagem: novaMensagem.id_documento,
                        id_treino: idTreino,
                        id_aluno: idAlunoNum,
                        matricula_aluno: matricula,
                        data: new Date()
                    });
                }

                alert("Mensagem enviada com sucesso para todos os alunos inscritos!");
                formEnvio.reset();
                selectTreino.value = "";
                tabelaDestinatarios.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum treino selecionado.</td></tr>`;

            } catch (erro) {
                console.error("Erro ao enviar mensagens:", erro);
                alert("Ocorreu um erro ao enviar as mensagens. Verifique a consola.");
            }
        });
    }
});