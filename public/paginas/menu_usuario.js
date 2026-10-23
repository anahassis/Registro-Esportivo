import { ObterDadosAluno, ObterInscricoesAluno } from "../../server/modulo.js";

document.addEventListener("DOMContentLoaded", async () => {
    const matriculaLogada = localStorage.getItem("usuarioLogado");
    const spanNome = document.getElementById("nomeUsuario");

    if (matriculaLogada && spanNome) {
        try {
            const aluno = await ObterDadosAluno(matriculaLogada);

            if (aluno && aluno.nome) {
                spanNome.textContent = aluno.nome;
            } else {
                spanNome.textContent = matriculaLogada;
            }

            const listaInscricoes = await ObterInscricoesAluno(matriculaLogada);

            listaInscricoes.forEach((inscricao) => {
                const idModalidade = inscricao.id_modalidade; 
                const liElement = document.getElementById(`li-modalidade-${idModalidade}`);

                if (liElement) {
                    liElement.removeAttribute("hidden"); 
                }
            });

        } catch (erro) {
            console.error("Erro ao carregar dados do usuário ou inscrições:", erro);
            spanNome.textContent = matriculaLogada;
        }
    } else if (spanNome) {
        spanNome.textContent = "Visitante";
    }

    const btnTrocarUsuario = document.getElementById("btnTrocarUsuario");

    if (btnTrocarUsuario) {
        btnTrocarUsuario.addEventListener("click", (e) => {
            e.preventDefault();

            const basePublica = window.location.pathname.includes('/public/') ? '/public' : ''
            const href = basePublica + '/index.html'

            const desejaSair = confirm("Tem certeza de que deseja trocar de usuário?");

            if (desejaSair) {
                localStorage.removeItem("usuarioLogado");
                window.location.href = window.location.origin + href; 
            }
        });
    }
})