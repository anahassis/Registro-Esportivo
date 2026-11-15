
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");


const serviceAccount = require("./keyfirebase_admin.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();

// Teto: Gerar uma senha aleatória
function gerarSenha() {
    const caracteres =
        "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

    let senha = "";

    for (let i = 0; i < 10; i++) {
        const indice = crypto.randomInt(0, caracteres.length);
        senha += caracteres[indice];
    }

    return senha;
}

// Teto: Criar as contas dos alunos
async function criarContas() {
    try {
        const alunos = await db.collection("alunos").get();

        const credenciais = [];

        for (const documento of alunos.docs) {
            const dados = documento.data();

            const matricula = String(dados.matricula || documento.id);
            const nome = dados.nome || "Aluno";

            // Teto: E-mail interno usado somente pelo Firebase (O firebase não aceita login apenas pelo RA do aluno, precisei criar um email interno, o aluno não terá acesso a esse email)
            const email = `aluno.${matricula}@registroesportivo.com`;

            try {
                const senha = gerarSenha();

                const usuario = await auth.createUser({
                    email: email,
                    password: senha,
                    displayName: nome
                });

                // Teto: Criar o perfil do usuário no Firestore
                await db.collection("usuarios").doc(usuario.uid).set({
                    matricula: matricula,
                    nome: nome,
                    tipo: "aluno",
                    ativo: true,
                    senhaAlterada: false
                });

                credenciais.push({
                    matricula: matricula,
                    nome: nome,
                    senha: senha
                });

                console.log(`Conta criada: ${matricula}`);

            } catch (erro) {
                if (erro.code === "auth/email-already-exists") {
                    console.log(`Conta já existente: ${matricula}`);
                } else {
                    console.error(
                        `Erro na matrícula ${matricula}:`,
                        erro.message
                    );
                }
            }
        }

        // Teto: Salvar as senhas em um arquivo CSV
        const cabecalho = "Matricula,Nome,Senha\n";

        const linhas = credenciais.map(aluno => {
            const nome = `"${aluno.nome.replace(/"/g, '""')}"`;

            return `${aluno.matricula},${nome},${aluno.senha}`;
        });

        const conteudo = cabecalho + linhas.join("\n");

        const caminho = path.join(__dirname, "senhas_iniciais.csv");

        fs.writeFileSync(caminho, "\uFEFF" + conteudo, "utf8");

        console.log("\nProcesso concluído!");
        console.log(`Contas criadas: ${credenciais.length}`);
        console.log(`Arquivo de senhas: ${caminho}`);

    } catch (erro) {
        console.error("Erro ao criar contas:", erro);
    }
}

criarContas();
