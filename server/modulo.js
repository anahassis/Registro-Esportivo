// js/modulo.js

// Importações dos SDKs do Firebase necessários
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configurações do seu projeto no Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "registro-esportivo-dbae3.firebaseapp.com",
    projectId: "registro-esportivo-dbae3",
    storageBucket: "registro-esportivo-dbae3.firebasestorage.app",
    messagingSenderId: "151624137744",
    appId: "1:151624137744:web:1b58008d71176d82259e95"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

/**
 * Função para verificar se o usuário existe no Firestore e salvá-lo/atualizá-lo.
 * @param {string} usuarioId - O identificador do usuário (ex: login do suap)
 * @returns {Promise<boolean>} - Retorna true se deu tudo certo
 */

export async function VerificarUsuario(matriculaInput) {
    try {
        // Cria uma referência para a coleção "Aluno"
        const alunosRef = collection(db, "Aluno");

        // Cria a consulta buscando onde o campo "matricula" é igual ao input do usuário
        const q = query(alunosRef, where("matricula", "==", matriculaInput));

        // Executa a busca no banco
        const querySnapshot = await getDocs(q);

        // Se a consulta retornar algum documento, significa que a matrícula existe!
        if (!querySnapshot.empty) {
            console.log("Matrícula encontrada!");

            // Pegamos o ID exato do documento retornado (ex: "1")
            const docAluno = querySnapshot.docs[0];
            const alunoRef = doc(db, "Aluno", docAluno.id);
            
            await updateDoc(alunoRef, {
                ultimo_acesso: new Date()
            });

            return true;
        } else {
            alert("Matrícula não encontrada. Por favor, verifique os dados.");
            return false;
        }

    } catch (erro) {
        console.error("Erro no módulo de banco de dados:", erro);
        throw erro;
    }
}

/**
 * @param {string} matriculaInput - matrícula 
 * @returns {Promise<Object|null>} - Retorna objeto com os dados do aluno ou null se não encontrar
 */
export async function ObterDadosAluno(matriculaInput) {
    try {
        const alunosRef = collection(db, "Aluno");
        const q = query(alunosRef, where("matricula", "==", matriculaInput));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docAluno = querySnapshot.docs[0];
        
            return {
                id_documento: docAluno.id,
                ...docAluno.data()        
            };
        } else {
            console.warn("Nenhum aluno encontrado para esta matrícula.");
            return null;
        }
    } catch (erro) {
        console.error("Erro ao buscar dados do aluno:", erro);
        throw erro;
    }
}

export async function ObterInscricoesAluno(id_aluno) {
    try {
        const inscricoesRef = collection(db, "Inscricao");
        const q = query(inscricoesRef, where("matricula_aluno", "==", id_aluno));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const listaInscricoes = querySnapshot.docs.map(doc => ({
                id_documento: doc.id, 
                ...doc.data()       
            }));

            return listaInscricoes; 
        } else {
            console.warn("Nenhuma inscrição encontrada para este ID.");
            return []; 
        }
    } catch (erro) {
        console.error("Erro ao buscar inscrições do aluno:", erro);
        throw erro;
    }
}