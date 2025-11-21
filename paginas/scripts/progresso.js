// =====================
// Config Firebase
// =====================
const firebaseConfig = {
  apiKey: "AIzaSyCUD-MKVkhBge2I1cTlxUCgPKLnv_rkJAs",
  authDomain: "tccgymwarriors.firebaseapp.com",
  projectId: "tccgymwarriors",
  storageBucket: "tccgymwarriors.firebasestorage.app",
  messagingSenderId: "990564612699",
  appId: "1:990564612699:web:eb109997deaeac5cf59d7e",
  measurementId: "G-E1P7LCT3EN",
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

  // 🔹 Botão de registrar peso (SEM MODAL)
  document.getElementById("adicionarPesoBtn").addEventListener("click", async () => {
    const novoPeso = Number(prompt("Digite seu peso atual (kg):"));

    if (isNaN(novoPeso) || novoPeso <= 0 || novoPeso > 650) {
      alert("Peso inválido!");
      return;
    }

    await pesosRef.add({
      peso: novoPeso,
      data: new Date(),
    });

    await userRef.update({
      peso: novoPeso,
    });
  });

  // 🔹 Carrega treinos realizados
  carregarTreinosRealizados(uid);
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
// Gráfico
// =====================
function renderizarGrafico(pesos) {
  const ctx = document.getElementById("graficoPeso").getContext("2d");

  const ultimosPesos = pesos.slice(-5);
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
        y: { ticks: { color: "#fff" } },
        x: { ticks: { color: "#fff" } },
      },
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
    },
  });
}

// ================================
// 🔹 Treinos Realizados
// ================================
async function carregarTreinosRealizados(userId) {
  try {
    const treinosRef = db
      .collection("usuarios")
      .doc(userId)
      .collection("progresso");

    const snapshot = await treinosRef.get();
    const container = document.getElementById("treinosRealizados");
    if (!container) return;

    if (snapshot.empty) {
      container.innerHTML = `
        <h3>Treinos Realizados</h3>
        <p>Nenhum treino registrado ainda.</p>
      `;
      return;
    }

    const grupos = {};
    snapshot.forEach((doc) => {
      const dados = doc.data();
      const grupo = (dados.grupo || "Desconhecido").toLowerCase();
      grupos[grupo] = (grupos[grupo] || 0) + 1;
    });

    const total = Object.values(grupos).reduce((a, b) => a + b, 0);

    const listaGrupos = Object.entries(grupos)
      .map(
        ([grupo, qtd]) =>
          `<li><strong>${grupo.charAt(0).toUpperCase() + grupo.slice(1)}:</strong> ${qtd}</li>`
      )
      .join("");

    container.innerHTML = `
      <div style="text-align: center;">
        <h3 style="margin-bottom: 8px;">Treinos Realizados</h3>
        <p><strong style="color: #00aea8;">Total:</strong> ${total} treinos</p>
        <ul style="
          list-style: none;
          padding-left: 0;
          margin-top: 10px;
          color: #fff;
          display: inline-block;
          text-align: left;
        ">
          ${listaGrupos}
        </ul>
      </div>
    `;
  } catch (erro) {
    console.error("Erro ao carregar treinos realizados:", erro);
  }
}
