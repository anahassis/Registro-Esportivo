// js/login.js
import { VerificarUsuario } from "../../server/modulo.js";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault(); // Impede a página de recarregar sozinha

            const usuarioInput = document.getElementById("usuario").value.trim();
            const senhaInput = document.getElementById("senha").value;

            if (!usuarioInput || !senhaInput) {
                alert("Por favor, preencha o usuário e a senha.");
                return;
            }

            try {
                console.log("Processando login para a matrícula:", usuarioInput);

                // modulo.js para verificar no Firestore
                const usuarioExiste = await VerificarUsuario(usuarioInput);

                if (usuarioExiste) {
                    console.log("Login autorizado!");
                    localStorage.setItem("usuarioLogado", usuarioInput);
                    
                    // Limpa os inputs
                    document.getElementById("usuario").value = "";
                    document.getElementById("senha").value = "";

                    // Redireciona para a página principal
                    window.location.href = "paginas/principal.html";
                } else {
                    // Limpa os campos se falhar
                    document.getElementById("usuario").value = "";
                    document.getElementById("senha").value = "";
                }

            } catch (erro) {
                console.error("Erro ao realizar o login:", erro);
                alert("Ocorreu um erro ao conectar com o banco de dados.");
            }
        });
    }
});