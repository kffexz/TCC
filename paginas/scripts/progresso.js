// =====================
// Config Firebase
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyAbVJUTwovjKHua6OWP_yIncKYytEEwPfo",
  authDomain: "tcc-994f7.firebaseapp.com",
  projectId: "tcc-994f7",
  storageBucket: "tcc-994f7.firebasestorage.app",
  messagingSenderId: "848443566233",
  appId: "1:848443566233:web:b9be3b2beccb027fa53008",
  measurementId: "G-SGB2LYMT17",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// =====================
// Variáveis globais
// =====================
let chart = null;
let pesos = [];

// =====================
// Função principal
// =====================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const uid = user.uid;
  const userRef = db.collection("usuarios").doc(uid);
  const pesosRef = userRef.collection("pesos");

  try {
    const snapshot = await pesosRef.orderBy("data", "asc").get();

    // Se não houver registros, cria o primeiro com base no peso cadastrado
    if (snapshot.empty) {
      const userDoc = await userRef.get();
      if (userDoc.exists && userDoc.data().peso) {
        const pesoInicial = parseFloat(userDoc.data().peso);
        await pesosRef.add({
          peso: pesoInicial,
          data: new Date(),
        });
        pesos.push({ peso: pesoInicial, data: new Date() });
      }
    } else {
      pesos = snapshot.docs.map((doc) => doc.data());
    }

    atualizarTela(pesos);
  } catch (error) {
    console.error("Erro ao carregar progresso:", error);
  }

  // Listener em tempo real
  pesosRef.orderBy("data", "asc").onSnapshot((snapshot) => {
    pesos = snapshot.docs.map((doc) => doc.data());
    atualizarTela(pesos);
  });

  // =====================
  // Modal Customizado
  // =====================
  const modal = document.getElementById("customAlert");
  const inputPeso = document.getElementById("inputPeso");
  const confirmPesoBtn = document.getElementById("confirmPesoBtn");
  const cancelPesoBtn = document.getElementById("cancelPesoBtn");

  // Abre modal
  document.getElementById("adicionarPesoBtn").addEventListener("click", () => {
    modal.style.display = "flex";
    inputPeso.value = "";
  });

  // Fecha modal
  cancelPesoBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Confirma peso
  confirmPesoBtn.addEventListener("click", async () => {
    const pesoAtual = parseFloat(inputPeso.value);

    if (isNaN(pesoAtual)) {
      alert("Digite um número válido!");
      return;
    }
    if (pesoAtual < 0 || pesoAtual > 650) {
      alert("O peso deve estar entre 0 e 650 kg!");
      return;
    }

    await pesosRef.add({
      peso: pesoAtual,
      data: new Date(),
    });

    await userRef.update({
      peso: pesoAtual,
    });

    modal.style.display = "none";
    inputPeso.value = "";
  });
});

 const input = document.getElementById('inputPeso');
  input.addEventListener('input', () => {
    if (input.value.length > 3) {
      input.value = input.value.slice(0, 3);
    }
  });

// =====================
// Atualiza tela e gráfico
// =====================
function atualizarTela(pesos) {
  if (!pesos.length) return;

  const pesoInicial = pesos[0].peso;
  const pesoAtual = pesos[pesos.length - 1].peso;

  document.getElementById("pesoInicial").textContent = pesoInicial.toFixed(1);
  document.getElementById("pesoAtual").textContent = pesoAtual.toFixed(1);

  // Calcula IMC se altura existir
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await db.collection("usuarios").doc(user.uid).get();
      if (userDoc.exists && userDoc.data().altura) {
        const altura = parseFloat(userDoc.data().altura) / 100;
        const imc = pesoAtual / (altura * altura);
        document.getElementById("imcValor").textContent = imc.toFixed(1);
        document.getElementById("imcClass").textContent = classificarIMC(imc);
      }
    }
  });

  renderizarGrafico(pesos);
}

// =====================
// Classificação do IMC
// =====================
function classificarIMC(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade grau I";
  if (imc < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

// =====================
// Monta o gráfico (últimos 5 registros)
// =====================
function renderizarGrafico(pesos) {
  const ctx = document.getElementById("graficoPeso").getContext("2d");

  // Pega os últimos 5 registros
  const ultimosPesos = pesos.slice(-5);

  // Formata data para "dd/mm"
  const labels = ultimosPesos.map((p) => {
    const data = new Date(p.data.toDate ? p.data.toDate() : p.data);
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  });

  const valores = ultimosPesos.map((p) => p.peso);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Peso (kg) — Últimos 5 registros",
          data: valores,
          borderColor: "#00ffcc",
          backgroundColor: "rgba(0, 255, 204, 0.2)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
          ticks: { color: "#fff" },
        },
        x: {
          ticks: { color: "#fff" },
        },
      },
      plugins: {
        legend: {
          labels: { color: "#fff" },
        },
      },
    },
  });
}


