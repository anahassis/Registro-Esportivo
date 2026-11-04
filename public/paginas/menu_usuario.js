import { Select } from "../../server/modulo.js";

document.addEventListener("DOMContentLoaded", async () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    const nivelAcesso = localStorage.getItem("nivelAcesso");
    const spanNome = document.getElementById("nomeUsuario");
    const elementosMudarCor = document.querySelectorAll("#mudar_cor, [id='mudar_cor']");

    if (usuarioLogado && spanNome) {
        try {
            let dadosUsuario = null;

            // Compara o nível de acesso para definir a tabela e o campo de busca corretos[cite: 2]
            if (nivelAcesso === "1") {
                // Nível 1: Professor (busca na tabela "Professor" pelo "email")[cite: 2]
                const resultadoProf = await Select("Professor", "email", usuarioLogado);
                if (resultadoProf && resultadoProf.length > 0) {
                    dadosUsuario = resultadoProf[0];
                }

                // Altera a cor dos elementos com id="mudar_cor" para professores[cite: 2]
                elementosMudarCor.forEach(el => {
                    el.style.backgroundColor = "#569fe7"; 
                    el.style.color = "#0e0d0d";
                });

            } else {
                // Nível 0 (ou padrão): Aluno (busca na tabela "Aluno" pela "matricula")[cite: 2]
                const resultadoAluno = await Select("Aluno", "matricula", usuarioLogado);
                if (resultadoAluno && resultadoAluno.length > 0) {
                    dadosUsuario = resultadoAluno[0];
                }

                // Altera a cor dos elementos com id="mudar_cor" para alunos[cite: 2]
                elementosMudarCor.forEach(el => {
                    el.style.backgroundColor = "#79ade2"; 
                    el.style.color = "#ffffff";
                });
            }

            // Define o nome na interface[cite: 2]
            if (dadosUsuario && dadosUsuario.nome) {
                spanNome.textContent = dadosUsuario.nome;
            } else {
                spanNome.textContent = usuarioLogado;
            }

            // Se for aluno (nível 0), carrega e exibe as inscrições[cite: 2]
            if (nivelAcesso !== "1") {
                const elInscrever = document.getElementById('Inscrever');
                if (elInscrever) elInscrever.removeAttribute("hidden");

                const listaInscricoes = await Select("Inscricao", "matricula_aluno", usuarioLogado);

                if (listaInscricoes && Array.isArray(listaInscricoes)) {
                    listaInscricoes.forEach((inscricao) => {
                        const idModalidade = inscricao.id_modalidade; 
                        const liElement = document.getElementById(`li-modalidade-${idModalidade}`);

                        if (liElement) {
                            liElement.removeAttribute("hidden"); 
                        }
                    });
                }
            } else {
                // Se for professor, exibe os links exclusivos de professor[cite: 2]
                const elProf1 = document.getElementById('prof-1');
                const elProf2 = document.getElementById('prof-2');
                const elProf3 = document.getElementById('prof-3');
                
                if (elProf1) elProf1.removeAttribute("hidden");
                if (elProf2) elProf2.removeAttribute("hidden");
                if (elProf3) elProf3.removeAttribute("hidden");
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