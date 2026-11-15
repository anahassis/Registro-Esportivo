// Teto: Criei essa parte para registrar os alunos a partir do txt sem precisar fazer um por um, até agora apenas RA e nome/sobrenome

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Teto: conecta o Firebase
const serviceAccount = require("./keyfirebase_admin.json");

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const caminhoArquivo = path.join(__dirname, "alunos.txt");
const conteudo = fs.readFileSync(caminhoArquivo, "utf8");

const linhas = conteudo.split(/\r?\n/);

const alunos = new Map();
const erros = [];

for (const linha of linhas) {
    if (!linha.trim()) continue;

    // Teto: Ignorar cabeçalhos
    if (/matrícula|destinatário/i.test(linha)) continue;

    // Teto: Separar matrícula e nome
    const resultado = linha.trim().match(/^(\d{6,})\s+(.+)$/);

    if (!resultado) {
        erros.push(linha);
        continue;
    }

    const matricula = resultado[1];
    const nome = resultado[2].trim();

    // Teto: Verificar matrículas repetidas
    if (alunos.has(matricula)) {
        if (alunos.get(matricula) !== nome) {
            console.error(`Matrícula duplicada com nomes diferentes: ${matricula}`);
            process.exit(1);
        }

        continue;
    }

    alunos.set(matricula, nome);
}

console.log("\n===== PRÉVIA DA IMPORTAÇÃO =====");
console.log("Projeto Firebase:", serviceAccount.project_id);
console.log("Alunos encontrados:", alunos.size);
console.log("Linhas não reconhecidas:", erros.length);

console.log("\nPrimeiros alunos:");

let contador = 0;

for (const [matricula, nome] of alunos) {
    console.log(`${matricula} - ${nome}`);

    contador++;
    if (contador === 5) break;
}

if (erros.length > 0) {
    console.log("\nLinhas que precisam ser verificadas:");
    erros.slice(0, 10).forEach(linha => console.log(linha));
}

if (alunos.size === 0 || erros.length > 0) {
    console.log("\nImportação cancelada. Verifique o arquivo.");
    process.exit(1);
}

// Teto: Pedir confirmação antes de cadastrar
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("\nDigite IMPORTAR para cadastrar os alunos: ", async (resposta) => {
    if (resposta !== "IMPORTAR") {
        console.log("Importação cancelada.");
        rl.close();
        process.exit(0);
    }

    try {
        const escritor = db.bulkWriter();

        for (const [matricula, nome] of alunos) {
            const referencia = db.collection("alunos").doc(matricula);

            escritor.set(referencia, {
                matricula: matricula,
                nome: nome,
                importadoEm: FieldValue.serverTimestamp()
            }, { merge: true });
        }

        await escritor.close();

        console.log(`\nImportação concluída! ${alunos.size} alunos processados.`);
    } catch (erro) {
        console.error("Erro durante a importação:", erro);
    } finally {
        rl.close();
    }
});
