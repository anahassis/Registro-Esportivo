import { Select } from "../../server/modulo.js";

document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const nivelAcesso = localStorage.getItem("nivelAcesso");
    const spanNome = document.getElementById("nomeUsuario");
    const elementosMudarCor = document.querySelectorAll("#mudar_cor, [id='mudar_cor']");

    if (usuarioLogado && spanNome) {
        try {
            let dadosUsuario = null;

            // Compara o nível de acesso para definir a tabela e o campo de busca corretos
            if (nivelAcesso === "1") {
                // Nível 1: Professor (busca na tabela "Professor" pelo "email")
                const resultadoProf = await Select("Professor", "email", usuarioLogado);
                if (resultadoProf.length > 0) {
                    dadosUsuario = resultadoProf[0];
                }

                // Exemplo visual: Altera a cor dos elementos com id="mudar_cor" para professores (ex: Tom de destaque/admin)
                elementosMudarCor.forEach(el => {
                    el.style.backgroundColor = "#257261"; // Cor para professor
                    el.style.color = "#0e0d0d";
                });

            } else {
                // Nível 0 (ou padrão): Aluno (busca na tabela "Aluno" pela "matricula")
                const resultadoAluno = await Select("Aluno", "matricula", usuarioLogado);
                if (resultadoAluno.length > 0) {
                    dadosUsuario = resultadoAluno[0];
                }

                // Altera a cor dos elementos com id="mudar_cor" para alunos
                elementosMudarCor.forEach(el => {
                    el.style.backgroundColor = "#569fe7"; // Cor para aluno
                    el.style.color = "#ffffff";
                });
            }

            // Define o nome na interface
            if (dadosUsuario && dadosUsuario.nome) {
                spanNome.textContent = dadosUsuario.nome;
            } else {
                spanNome.textContent = usuarioLogado;
            }

            // Se for aluno (nível 0), carrega e exibe as inscrições nas modalidades correspondentes
            if (nivelAcesso !== "1") {
                const listaInscricoes = await Select("Inscricao", "matricula_aluno", usuarioLogado);

                listaInscricoes.forEach((inscricao) => {
                    const idModalidade = inscricao.id_modalidade; 
                    const liElement = document.getElementById(`li-modalidade-${idModalidade}`);

                    if (liElement) {
                        liElement.removeAttribute("hidden"); 
                    }
                });
            } else {
                // Se for professor, pode optar por revelar todos os menus de check-in ou gereniamento
                const todosLinksCheckin = document.querySelectorAll("[id^='li-modalidade-']");
                todosLinksCheckin.forEach(el => el.removeAttribute("hidden"));
            }

        } catch (erro) {
            console.error("Erro ao carregar dados do usuário ou inscrições:", erro);
            spanNome.textContent = usuarioLogado;
        }
    } else if (spanNome) {
        spanNome.textContent = "Visitante";
    }

    const btnTrocarUsuario = document.getElementById("btnTrocarUsuario");

    if (btnTrocarUsuario) {
        btnTrocarUsuario.addEventListener("click", (e) => {
            e.preventDefault();

            const basePublica = window.location.pathname.includes('/public/') ? '/public' : '';
            const href = basePublica + '/index.html';

            const desejaSair = confirm("Tem certeza de que deseja trocar de usuário?");

            if (desejaSair) {
                localStorage.removeItem("usuarioLogado");
                localStorage.removeItem("nivelAcesso");
                window.location.href = window.location.origin + href; 
            }
        });
    }
});