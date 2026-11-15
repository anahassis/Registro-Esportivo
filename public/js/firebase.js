import { initializeApp } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.3.0/firebase-firestore.js";

const firebaseConfig = {apiKey: "AIzaSyAdStxRRfZTT7VeMyrp_kJTaVvMhs3CtKI",
                        authDomain: "registro-esportivo-ifmg.firebaseapp.com",
                        projectId: "registro-esportivo-ifmg",
                        storageBucket: "registro-esportivo-ifmg.firebasestorage.app",
                        messagingSenderId: "187120696843",
                        appId: "1:187120696843:web:8418df420e6acd5728110e"};
// Teto: initializeApp()	Inicializa a conexão com o projeto Firebase
const app = initializeApp(firebaseConfig);
// Teto: getAuth()	Inicializa o serviço de autenticação
export const auth = getAuth(app);
// Teto: getFirestore()	Inicializa nosso banco de dados
// Teto: "export"  Permite utilizar os serviços em outros arquivos js
export const db = getFirestore(app);

console.log("Firebase conectado!");