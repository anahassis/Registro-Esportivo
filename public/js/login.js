import { VerificarUsuario } from "../../server/modulo.js";

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");

    if (formulario) {
        formulario.addEventListener("submit", async (e) => {
            e.preventDefault(); 

            const usuarioInput = document.getElementById("usuario").value.trim();
            const senhaInput = document.getElementById("senha").value;

            if (!usuarioInput || !senhaInput) {
                alert("Por favor, preencha o usuário e a senha.");
                return;
            }

            try {
                console.log("Processando login para:", usuarioInput);

                const resultadoLogin = await VerificarUsuario(usuarioInput);

                if (resultadoLogin) {
                    console.log("Login autorizado! Nível de acesso:", resultadoLogin.nivel);
                    
                    // (matrícula para aluno, e-mail completo para professor)
                    localStorage.setItem("usuarioLogado", resultadoLogin.identificador);
                    
                    // nível de acesso (0 = Aluno, 1 = Professor)
                    localStorage.setItem("nivelAcesso", resultadoLogin.nivel);
                    
                    document.getElementById("usuario").value = "";
                    document.getElementById("senha").value = "";

                    window.location.href = "paginas/principal.html";
                } else {
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