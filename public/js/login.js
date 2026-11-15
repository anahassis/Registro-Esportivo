
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const campoSenha = document.getElementById("senha");
    const botaoMostrarSenha = document.getElementById("mostrarSenha");

botaoMostrarSenha.addEventListener("click", () => {
    if (campoSenha.type === "password") {
        campoSenha.type = "text";
        botaoMostrarSenha.textContent = "Ocultar";
    } else {
        campoSenha.type = "password";
        botaoMostrarSenha.textContent = "Mostrar";
    }
});
    if (!formulario) return;

    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const matricula = document.getElementById("usuario").value.trim();
        const senha = document.getElementById("senha").value;

        if (!matricula || !senha) {
            alert("Preencha a matrícula e a senha.");
            return;
        }

        // Teto: Transformar matrícula no e-mail interno do Firebase
        const email = `aluno.${matricula}@registroesportivo.com`;

        try {
            const resultadoLogin = await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

            const uid = resultadoLogin.user.uid;

            // Teto: Buscar os dados do aluno no Firestore
            const referenciaUsuario = doc(db, "usuarios", uid);
            const documentoUsuario = await getDoc(referenciaUsuario);

            if (!documentoUsuario.exists()) {
                await signOut(auth);
                alert("Perfil de usuário não encontrado.");
                return;
            }

            const dadosUsuario = documentoUsuario.data();

            if (dadosUsuario.ativo !== true) {
                await signOut(auth);
                alert("Esta conta está desativada.");
                return;
            }

            console.log("Login realizado com sucesso!");
            console.log("Aluno:", dadosUsuario.nome);
            console.log("Matrícula:", dadosUsuario.matricula);

            localStorage.setItem("usuarioLogado", uid);
            localStorage.setItem("nomeUsuario", dadosUsuario.nome);

            window.location.href = "paginas/principal.html";

        } catch (erro) {
            console.error("Erro no login:", erro);

            alert("Matrícula ou senha incorretas.");
            document.getElementById("senha").value = "";
        }
    });
});
