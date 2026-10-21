document.addEventListener("DOMContentLoaded", () => {
    // Detecta se o projeto está rodando com /public/ na URL ou direto na raiz
    const basePublica = window.location.pathname.includes('/public/') ? '/public' : '';

    const paginasDoSistema = [
        { titulo: "Página Principal", url: basePublica + "/paginas/principal.html" },
        { titulo: "Inscrever", url: basePublica + "/paginas/paginaInscricao/PaginaInscricao.html" },
        { titulo: "Dados Gerais do Aluno", url: basePublica + "/paginas/pagina area-todos/dados_gerais.html" }
    ];

    const inputBusca = document.getElementById("inputBuscaPaginas");
    const listaResultados = document.getElementById("listaResultados");

    if (inputBusca && listaResultados) {
        inputBusca.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase().trim();
            listaResultados.innerHTML = "";

            if (termo === "") {
                listaResultados.style.display = "none";
                return;
            }

            const resultadosFiltrados = paginasDoSistema.filter(pagina => 
                pagina.titulo.toLowerCase().includes(termo)
            );

            if (resultadosFiltrados.length > 0) {
                listaResultados.style.display = "block";

                resultadosFiltrados.forEach(pagina => {
                    const li = document.createElement("li");
                    const a = document.createElement("a");
                    
                    a.href = window.location.origin + pagina.url;
                    a.textContent = pagina.titulo;
                    
                    li.appendChild(a);
                    listaResultados.appendChild(li);
                });
            } else {
                listaResultados.style.display = "block";
                const li = document.createElement("li");
                li.textContent = "Nenhuma página encontrada";
                li.style.color = "#888";
                li.style.padding = "10px 15px";
                listaResultados.appendChild(li);
            }
        });

        document.addEventListener("click", (e) => {
            if (!e.target.closest(".caixa-pesquisa-paginas")) {
                listaResultados.style.display = "none";
            }
        });
    }
});