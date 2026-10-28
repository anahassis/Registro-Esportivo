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

export async function VerificarUsuario(usuarioInput) {
    try {
        // 1. Tenta buscar na coleção "Aluno" pela matrícula
        const alunosRef = collection(db, "Aluno");
        const qAluno = query(alunosRef, where("matricula", "==", usuarioInput));
        const querySnapshotAluno = await getDocs(qAluno);

        if (!querySnapshotAluno.empty) {
            console.log("Matrícula de aluno encontrada!");
            const docAluno = querySnapshotAluno.docs[0];
            const alunoRef = doc(db, "Aluno", docAluno.id);
            
            await updateDoc(alunoRef, {
                ultimo_acesso: new Date()
            });

            // Retorna o nível 0 para aluno e a matrícula como identificador
            return { nivel: 0, identificador: usuarioInput };
        }

        // 2. Se não for aluno, tenta buscar na coleção "Professor" pelo e-mail
        // Se o usuário digitou apenas "camila.silva", completamos com "@ifmg.edu.br"
        const emailBusca = usuarioInput.includes("@") ? usuarioInput : usuarioInput + "@ifmg.edu.br";
        
        const professoresRef = collection(db, "Professor");
        const qProf = query(professoresRef, where("email", "==", emailBusca));
        const querySnapshotProf = await getDocs(qProf);

        if (!querySnapshotProf.empty) {
            console.log("E-mail de professor encontrado!");
            const docProf = querySnapshotProf.docs[0];
            const dadosProf = docProf.data();

            // Retorna o nível 1 para professor e o e-mail completo como identificador
            return { nivel: 1, identificador: dadosProf.email };
        }

        alert("Usuário não encontrado. Por favor, verifique os dados.");
        return null;

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

export async function Select(Tabela, campoFiltro, valorFiltro) {
    try {
        const tabelaRef = collection(db, Tabela);
        // Agora usamos a função 'where' do Firebase corretamente, recebendo o campo e o valor
        const q = query(tabelaRef, where(campoFiltro, "==", valorFiltro));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const listaResultados = querySnapshot.docs.map(doc => ({
                id_documento: doc.id, 
                ...doc.data()       
            }));

            return listaResultados; 
        } else {
            console.warn("Nenhum registo encontrado na tabela:", Tabela);
            return []; 
        }
    } catch (erro) {
        console.error("Erro ao buscar tabela:", erro);
        throw erro;
    }
}