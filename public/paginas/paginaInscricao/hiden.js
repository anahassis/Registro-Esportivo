import { ObterDadosAluno, ObterInscricoesAluno } from "../../../server/modulo.js";
document.addEventListener("DOMContentLoaded", async () => {
    const matriculaLogada = localStorage.getItem("usuarioLogado");

    if (matriculaLogada) {
        try {

            const listaInscricoes = await ObterInscricoesAluno(matriculaLogada);

            listaInscricoes.forEach((inscricao) => {
                const idModalidade = inscricao.id_modalidade; 
                const liElement = document.getElementById(`li-modalidade-${idModalidade}`);

                if (liElement) {
                    liElement.setAttribute("hidden", "true");
                }
            });

        } catch (erro) {
            console.error("Erro ao carregar dados do usuário ou inscrições:", erro);
        }
    }
})