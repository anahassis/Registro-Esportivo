import { ObterDadosAluno } from "../../server/modulo.js"; 

document.addEventListener("DOMContentLoaded", async () => {
    const matriculaLogada = localStorage.getItem("usuarioLogado");
    const spanNome = document.getElementById("nomeUsuario");

    if (matriculaLogada && spanNome) {
        try {
            // Usa o getter para buscar as informações do banco
            const aluno = await ObterDadosAluno(matriculaLogada);

            if (aluno && aluno.nome) {
                // Exibe o nome completo do aluno no menu lateral!
                spanNome.textContent = aluno.nome;
            } else {
                console.warn(aluno.nome);
                console.warn("Nome do aluno não encontrado para a matrícula:", matriculaLogada);
                spanNome.textContent = matriculaLogada; // Fallback para a matrícula se não achar o nome
            }
        } catch (erro) {
            console.error("Erro ao carregar o nome do usuário:", erro);
            spanNome.textContent = matriculaLogada;
        }
    } else if (spanNome) {
        spanNome.textContent = "Visitante";
    }

    const btnTrocarUsuario = document.getElementById("btnTrocarUsuario");

    if (btnTrocarUsuario) {
        btnTrocarUsuario.addEventListener("click", (e) => {
            e.preventDefault();

            const desejaSair = confirm("Tem certeza de que deseja trocar de usuário?");

            if (desejaSair) {
                localStorage.removeItem("usuarioLogado");

                console.log("Sessão encerrada. Redirecionando para o login...");

                window.location.href = "../index.html"; 
            } else {
                console.log("Troca de usuário cancelada.");
            }
        });
    }

    
});