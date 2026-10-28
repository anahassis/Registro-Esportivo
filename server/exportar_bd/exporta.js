// Importa a sua configuração do Firebase do seu modulo.js existente
import { db } from "../modulo.js"; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const btnExportar = document.getElementById("btnExportar");

    if (btnExportar) {
        btnExportar.addEventListener("click", async () => {
            try {
                alert("A exportar dados do Firestore... Por favor, aguarde.");
                
                // Como o Firestore no cliente não tem um comando nativo para listar todas as coleções,
                // definimos aqui a lista exata das coleções (tabelas) que você tem no seu banco:
                const nomesColecoes = ["Aluno", "Inscricao", "Professor", "Treino", "Check-in", "Modalidade", "Notificacao", "Turma"]; 
                const bancoDeDadosCompleto = {};

                for (const nomeColecao of nomesColecoes) {
                    const querySnapshot = await getDocs(collection(db, nomeColecao));
                    const documentos = {};

                    querySnapshot.forEach((doc) => {
                        documentos[doc.id] = doc.data();
                    });

                    bancoDeDadosCompleto[nomeColecao] = documentos;
                }

                // Converte o objeto completo para uma string JSON bem formatada
                const jsonString = JSON.stringify(bancoDeDadosCompleto, null, 2);
                
                // Cria um link invisível no navegador para forçar o download do arquivo .json
                const blob = new Blob([jsonString], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement("a");
                link.href = url;
                link.download = "banco_de_dados_completo.json";
                document.body.appendChild(link);
                link.click();
                
                // Limpa o link após o download
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                alert("Exportação concluída com sucesso! O arquivo JSON foi descarregado.");

            } catch (erro) {
                console.error("Erro ao exportar dados:", erro);
                alert("Ocorreu um erro ao exportar. Verifique a consola (F12).");
            }
        });
    }
});