import { ObterDadosAluno, db } from "../../../server/modulo.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const formInscricao = document.getElementById("formInscricao");
    const checkboxTermos = document.getElementById("aceiteTermos");

    if (formInscricao) {
        formInscricao.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!checkboxTermos.checked) {
                alert("Você precisa ler e concordar com os Termos do PIEL para se inscrever!");
                return;
            }

            try {
                const caminhoAtual = window.location.pathname.toLowerCase();

                const paginaModalidadeId = {
                    2: "atletismo",
                    1: "volei",
                    4: "handball",
                    3: "basquete",
                    0: "futsal"
                };

                let idModalidade = 0; 
                for (const [id, modalidade] of Object.entries(paginaModalidadeId)) {
                    if (caminhoAtual.includes(modalidade)) {
                        idModalidade = parseInt(id, 10);
                        break;
                    }
                }
                
                const matriculaStr = localStorage.getItem("usuarioLogado");
                
                if (!matriculaStr) {
                    alert("Erro: Nenhum usuário logado encontrado. Faça login novamente.");
                    window.location.href = "../index.html";
                    return;
                }

                const idInscricaoInt = Math.floor(Date.now() / 1000); 

                const novaInscricao = {
                    matricula_aluno: matriculaStr,       
                    id_inscricao: idInscricaoInt, // Salva como int
                    id_modalidade: idModalidade   // Salva como int
                };

                await addDoc(collection(db, "Inscricao"), novaInscricao);

                alert("Inscrição realizada para " + paginaModalidadeId[idModalidade] + " com sucesso!");
                window.location.href = "../principal.html";

            } catch (error) {
                console.error("Erro ao realizar inscrição: ", error);
                alert("Ocorreu um erro ao salvar a inscrição. Tente novamente.");
            }
        });
    }
});