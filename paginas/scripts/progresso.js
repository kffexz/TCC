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
// Converter datas (seguro)
// =====================
function converterData(valor) {
  if (!valor) return new Date();

  if (valor.toDate && typeof valor.toDate === "function") return valor.toDate();

  if (typeof valor.seconds === "number") return new Date(valor.seconds * 1000);

  return new Date(valor);
}

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
        const registro = { peso: pesoInicial, data: new Date() };

        await pesosRef.add(registro);
        pesos = [registro];
      } else {
        pesos = [];
      }
    } else {
      pesos = snapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => converterData(a.data) - converterData(b.data));
    }

    atualizarTela(pesos);
  } catch (error) {
    console.error("Erro ao carregar progresso:", error);
  }

  // Listener em tempo real (apenas 1)
  pesosRef.orderBy("data", "asc").onSnapshot((snapshot) => {
    pesos = snapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => converterData(a.data) - converterData(b.data));

    atualizarTela(pesos);
  });

  // Modal e botões — garante que os elementos existam antes de adicionar listeners
  const modal = document.getElementById("customAlert");
  const inputPeso = document.getElementById("inputPeso");
  const confirmPesoBtn = document.getElementById("confirmPesoBtn");
  const cancelPesoBtn = document.getElementById("cancelPesoBtn");
  const adicionarPesoBtn = document.getElementById("adicionarPesoBtn");

  if (adicionarPesoBtn) {
    adicionarPesoBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "flex";
      if (inputPeso) inputPeso.value = "";
    });
  }

  if (cancelPesoBtn) {
    cancelPesoBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }

  if (confirmPesoBtn) {
    confirmPesoBtn.addEventListener("click", async () => {
      if (!inputPeso) return;
      const novoPeso = parseFloat(inputPeso.value);

      if (isNaN(novoPeso)) {
        alert("Digite um número válido!");
        return;
      }
      if (novoPeso < 0 || novoPeso > 650) {
        alert("O peso deve estar entre 0 e 650 kg!");
        return;
      }

      const registro = {
        peso: novoPeso,
        data: new Date(),
      };

      try {
        // salva no histórico
        await pesosRef.add(registro);

        // atualiza o campo 'peso' do documento do usuário (número)
        await userRef.update({ peso: novoPeso });

        if (modal) modal.style.display = "none";
        inputPeso.value = "";
      } catch (e) {
        console.error("Erro ao salvar peso:", e);
        alert("Erro ao salvar. Tente novamente.");
      }
    });
  }

  carregarTreinosRealizados(uid);
});

// =====================
// Atualiza Tela / IMC / Gráfico
// =====================
async function atualizarTela(pesosLocal) {
  // garante que os elementos existam
  const elemPesoInicial = document.getElementById("pesoInicial");
  const elemPesoAtual = document.getElementById("pesoAtual"); // <--- corrigido para id do HTML
  const elemImcValor = document.getElementById("imcValor");
  const elemImcClass = document.getElementById("imcClass");

  if (!pesosLocal || !pesosLocal.length) {
    // limpa se vazio
    if (elemPesoInicial) elemPesoInicial.textContent = "--";
    if (elemPesoAtual) elemPesoAtual.textContent = "--";
    if (elemImcValor) elemImcValor.textContent = "--";
    if (elemImcClass) elemImcClass.textContent = "--";
    if (chart) {
      chart.destroy();
      chart = null;
    }
    return;
  }

  // garantir ordenação
  pesosLocal.sort((a, b) => converterData(a.data) - converterData(b.data));

  const pesoInicial = parseFloat(pesosLocal[0].peso);
  const pesoAtual = parseFloat(pesosLocal[pesosLocal.length - 1].peso);

  if (elemPesoInicial) elemPesoInicial.textContent = isNaN(pesoInicial) ? "--" : pesoInicial.toFixed(1);
  if (elemPesoAtual) elemPesoAtual.textContent = isNaN(pesoAtual) ? "--" : pesoAtual.toFixed(1);

  // Calcular IMC a partir da altura do usuário
  const user = auth.currentUser;
  if (user && (elemImcValor || elemImcClass)) {
    try {
      const doc = await db.collection("usuarios").doc(user.uid).get();
      if (doc.exists && doc.data().altura) {
        const altura = parseFloat(doc.data().altura) / 100;
        if (altura > 0 && !isNaN(pesoAtual)) {
          const imc = pesoAtual / (altura * altura);
          if (elemImcValor) elemImcValor.textContent = imc.toFixed(1);
          if (elemImcClass) elemImcClass.textContent = classificarIMC(imc);
        }
      }
    } catch (e) {
      console.error("Erro ao calcular IMC:", e);
    }
  }

  renderizarGrafico(pesosLocal);
}

// =====================
// IMC
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
function renderizarGrafico(pesosLocal) {
  const canvas = document.getElementById("graficoPeso");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const ultimos = pesosLocal.slice(-5);

  const labels = ultimos.map((p) => {
    const d = converterData(p.data);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  });

  const valores = ultimos.map((p) => parseFloat(p.peso));

  if (chart) {
    try { chart.destroy(); } catch (e) { /* ignora */ }
    chart = null;
  }

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
      responsive: true,
      maintainAspectRatio: false,
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
// Treinos Realizados
// ================================
async function carregarTreinosRealizados(userId) {
  try {
    const ref = db.collection("usuarios").doc(userId).collection("progresso");
    const snap = await ref.get();
    const container = document.getElementById("treinosRealizados");

    if (!container) return;

    if (snap.empty) {
      container.innerHTML = `
        <h3>Treinos Realizados</h3>
        <p>Nenhum treino registrado ainda.</p>
      `;
      return;
    }

    const grupos = {};
    snap.forEach((doc) => {
      const dado = doc.data();
      const grupo = (dado.grupo || "Desconhecido").toLowerCase();
      grupos[grupo] = (grupos[grupo] || 0) + 1;
    });

    const total = Object.values(grupos).reduce((a, b) => a + b, 0);

    const lista = Object.entries(grupos)
      .map(([g, q]) => `<li><strong>${g.charAt(0).toUpperCase() + g.slice(1)}:</strong> ${q}</li>`)
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
          ${lista}
        </ul>
      </div>
    `;
  } catch (e) {
    console.error("Erro ao carregar treinos realizados:", e);
  }
}
