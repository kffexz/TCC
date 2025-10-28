 //DICAS

    // =============================
// 🔹 DICAS DO DIA (aleatórias)
// =============================
const dicas = [
  "Mantenha boa postura durante os exercícios e hidrate-se!",
  "Faça alongamentos antes e depois do treino.",
  "Durma bem — o descanso é essencial para o crescimento muscular.",
  "A constância é mais importante que a intensidade!",
  "Evite treinar o mesmo grupo muscular dois dias seguidos.",
  "Controle a respiração: inspire ao descer e expire ao subir.",
  "Aumente as cargas gradualmente para evitar lesões.",
  "A alimentação representa 70% dos seus resultados.",
  "Treine com foco na execução, não apenas no peso.",
  "Não pule o aquecimento — ele prepara seu corpo e evita lesões.",
  "Mantenha-se hidratado durante todo o treino.",
  "O progresso vem com paciência — não desista!"
];

// Seleciona uma dica com base na data (assim muda a cada dia)
const indiceDia = new Date().getDate() % dicas.length;
document.getElementById("dicaDia").textContent = dicas[indiceDia];


    // =============================
    // 🔹 CONFIGURAÇÃO FIREBASE
    // =============================
    const firebaseConfig = {
      apiKey: "AIzaSyAbVJUTwovjKHua6OWP_yIncKYytEEwPfo",
      authDomain: "tcc-994f7.firebaseapp.com",
      projectId: "tcc-994f7",
      storageBucket: "tcc-994f7.appspot.com",
      messagingSenderId: "848443566233",
      appId: "1:848443566233:web:b9be3b2beccb027fa53008",
      measurementId: "G-SGB2LYMT17"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // =============================
    // 🔹 AUTENTICAÇÃO
    // =============================
    auth.onAuthStateChanged(async user => {
      if (!user) return window.location.href = 'login.html';

      document.getElementById('userName').textContent = user.displayName || "Sem nome";

      // Exemplo de progresso
      const progresso = await db.collection("usuarios").doc(user.uid)
        .collection("progresso").get();
      const completados = progresso.size;
      document.getElementById('exerciciosFeitos').textContent = completados;
      document.getElementById('progressFill').style.width = `${Math.min(completados * 10, 100)}%`;
    });
