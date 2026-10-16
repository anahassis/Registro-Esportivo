// js/trocar_usuario.js

document.addEventListener("DOMContentLoaded", () => {
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