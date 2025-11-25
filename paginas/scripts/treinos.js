// ================================
// 🔹 FIREBASE CONFIG
// ================================
const firebaseConfig = {
  apiKey: "AIzaSyCUD-MKVkhBge2I1cTlxUCgPKLnv_rkJAs",
  authDomain: "tccgymwarriors.firebaseapp.com",
  projectId: "tccgymwarriors",
  storageBucket: "tccgymwarriors.firebasestorage.app",
  messagingSenderId: "990564612699",
  appId: "1:990564612699:web:eb109997deaeac5cf59d7e",
  measurementId: "G-E1P7LCT3EN"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ================================
// 🔹 VARIÁVEIS GLOBAIS
// ================================
let usuario = null;
let equipamentosUsuario = [];
let objetivoUsuario = "";

const treinoElem = document.getElementById("treinoDoDia");
const btnProximo = document.getElementById("btnProximo");
const container = document.getElementById("exerciciosContainer");

// 🆕 GEMINI IA: Variáveis para o novo botão e URL do backend
const btnGerarIA = document.getElementById("btnGerarIA"); 
const apiUrl = 'http://localhost:3001/api/gerar-treino'; // 🚨 URL DO SEU BACKEND NODE.JS

const mapaTreinos = {
  "Peito e Triceps": ["peito", "triceps"],
  "Costas e Biceps": ["costas", "biceps"],
  "Pernas e Ombros": ["pernas", "ombros"]
};

// ================================
// 🔹 EXERCÍCIOS (resumidos) - MANTIDOS PARA O TREINO PADRÃO
// ================================
const exercicios = {
 pernas: [
    { equipamento: "Halteres", exercicio: "Agachamento leve", foco: ["Resistência", "Funcional"] },
    { equipamento: "Halteres", exercicio: "Passada (avanço)", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Agachamento livre pesado", foco: ["Força", "Crescimento"] },
    { equipamento: "Kettlebell", exercicio: "Goblet squat", foco: ["Funcional", "Mobilidade"] },
    { equipamento: "Elástico", exercicio: "Agachamento com elástico", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Esteira", exercicio: "Caminhada inclinada", foco: ["Aeróbico", "Resistência"] },
    
    { equipamento: "Esteira", exercicio: "Corrida leve", foco: ["Aeróbico", "Resistência"] },
    { equipamento: "Corda", exercicio: "Saltos simples", foco: ["Coordenação", "Resistência"] },
    { equipamento: "Corda", exercicio: "Double unders", foco: ["Coordenação", ] },
    { equipamento: "Corpo", exercicio: "Pistol squat", foco: ["Força", , "Equilíbrio"] },
    { equipamento: "Corda naval", exercicio: "Ondas com agachamento", foco: ["Força", , "Resistência"] },
    { equipamento: "Barra", exercicio: "Stiff", foco: ["Crescimento", "Força"] },
    { equipamento: "Halteres", exercicio: "Afundo búlgaro", foco: ["Força", "Equilíbrio"] },
    { equipamento: "Kettlebell", exercicio: "Deadlift unilateral", foco: ["Funcional", "Mobilidade", "Força"] },
    { equipamento: "Corpo", exercicio: "Ponte de glúteo", foco: ["Resistência", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Cadeira extensora com elástico", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Corda naval", exercicio: "Saltos laterais com corda", foco: ["Aeróbico", ] },
    { equipamento: "Halteres", exercicio: "Agachamento sumô", foco: ["Força", "Crescimento"] },
    { equipamento: "Kettlebell", exercicio: "Swing", foco: [, "Funcional"] },
    { equipamento: "Corpo", exercicio: "Subida no banco", foco: ["Resistência", "Força"] }
  ],

  ombros: [
    { equipamento: "Halteres", exercicio: "Elevação lateral sentada", foco: ["Resistência", "Crescimento"] },
    { equipamento: "Halteres", exercicio: "Desenvolvimento militar", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Desenvolvimento em pé", foco: ["Força", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Elevação frontal", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Kettlebell", exercicio: "Press alternado", foco: ["Funcional", "Força"] },
    { equipamento: "Kettlebell", exercicio: "Turkish get-up", foco: ["Mobilidade", , "Funcional"] },
    { equipamento: "Corpo", exercicio: "Pike push-up", foco: ["Força", "Resistência"] },
    { equipamento: "Corpo", exercicio: "Handstand push-up", foco: ["Força", , ] },
    { equipamento: "Corda naval", exercicio: "Golpes laterais", foco: ["Funcional", "Resistência"] },
    { equipamento: "Halteres", exercicio: "Elevação posterior", foco: ["Crescimento", ] },
    { equipamento: "Barra", exercicio: "Push press", foco: ["Força", ] },
    { equipamento: "Elástico", exercicio: "Rotação externa", foco: ["Mobilidade", ] },
    { equipamento: "Corpo", exercicio: "Planche lean", foco: [, "Força"] },
    { equipamento: "Corda naval", exercicio: "Golpes diagonais", foco: ["Funcional", ] },
    { equipamento: "Halteres", exercicio: "Arnold press", foco: ["Força", "Crescimento"] },
    { equipamento: "Kettlebell", exercicio: "Clean and press", foco: [, "Funcional"] },
    { equipamento: "Corpo", exercicio: "Dive bomber push-up", foco: [, "Força"] },
    { equipamento: "Elástico", exercicio: "Face pull com elástico", foco: ["Mobilidade", ] }
  ],

  costas: [
    { equipamento: "Halteres", exercicio: "Remada unilateral apoiada", foco: ["Crescimento", "Força"] },
    { equipamento: "Halteres", exercicio: "Remada curvada", foco: ["Força", "Crescimento"] },
    { equipamento: "Barra", exercicio: "Barra fixa pronada", foco: ["Força", "Resistência"] },
    { equipamento: "Elástico", exercicio: "Remada sentada", foco: ["Resistência", "Mobilidade"] },
    { equipamento: "Elástico", exercicio: "Puxada alta", foco: ["Funcional", "Mobilidade"] },
    { equipamento: "Kettlebell", exercicio: "Remada com kettlebell", foco: ["Funcional", "Força"] },
    { equipamento: "Corpo", exercicio: "Muscle-up", foco: ["Força", , ] },
    { equipamento: "Corda naval", exercicio: "Ondas alternadas", foco: ["Resistência", "Força"] },
    { equipamento: "Barra", exercicio: "Levantamento terra", foco: ["Força", "Crescimento", ] },
    { equipamento: "Halteres", exercicio: "Pullover", foco: ["Crescimento", "Resistência"] },
    { equipamento: "Elástico", exercicio: "Face pull", foco: ["Mobilidade", ] },
    { equipamento: "Corpo", exercicio: "Superman", foco: ["Resistência", "Mobilidade"] },
    { equipamento: "Kettlebell", exercicio: "High pull", foco: ["Funcional", ] },
    { equipamento: "Halteres", exercicio: "Remada invertida", foco: ["Força", ] },
    { equipamento: "Corpo", exercicio: "Prancha com puxada", foco: ["Resistência", ] },
    { equipamento: "Corda naval", exercicio: "Ondas laterais", foco: [, "Funcional"] },
    { equipamento: "Corpo", exercicio: "Superman", foco: [, "Força, Crescimento"] }
  ],

  peito: [
    { equipamento: "Halteres", exercicio: "Supino reto leve", foco: ["Crescimento", "Força"] },
    { equipamento: "Halteres", exercicio: "Supino inclinado", foco: ["Força", "Crescimento"] },
    { equipamento: "Barra", exercicio: "Supino pesado", foco: ["Crescimento", "Força", ] },
    { equipamento: "Elástico", exercicio: "Crucifixo com elástico", foco: ["Mobilidade", ] },
    { equipamento: "Kettlebell", exercicio: "Supino no chão", foco: ["Funcional", "Força"] },
    { equipamento: "Corpo", exercicio: "Flexão inclinada", foco: ["Resistência", "Funcional"] },
    { equipamento: "Corpo", exercicio: "Flexão tradicional", foco: ["Força", "Crescimento"] },
    { equipamento: "Corpo", exercicio: "Flexão com palmas", foco: [, "Coordenação"] },
    { equipamento: "Corda naval", exercicio: "Golpes cruzados", foco: ["Funcional", "Resistência"] },
    { equipamento: "Halteres", exercicio: "Crucifixo reto", foco: ["Crescimento", ] },
    { equipamento: "Barra", exercicio: "Supino declinado", foco: ["Força", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Press de peito", foco: ["Resistência", "Mobilidade"] },
    { equipamento: "Corpo", exercicio: "Flexão arqueada", foco: ["Mobilidade", ] },
    { equipamento: "Kettlebell", exercicio: "Floor press", foco: ["Funcional", "Força"] },
    { equipamento: "Corpo", exercicio: "Flexão diamante", foco: [, "Força"] },
    { equipamento: "Halteres", exercicio: "Pullover com halteres", foco: ["Mobilidade", "Crescimento"] },
    { equipamento: "Corda", exercicio: "Saltos explosivos", foco: ["Aeróbico", ] }
  ],

  biceps: [
    { equipamento: "Halteres", exercicio: "Rosca alternada", foco: ["Resistência", "Crescimento"] },
    { equipamento: "Halteres", exercicio: "Rosca martelo", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Rosca direta pesada", foco: ["Força", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Rosca com elástico", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Kettlebell", exercicio: "Rosca neutra", foco: ["Funcional", "Força"] },
    { equipamento: "Corpo", exercicio: "Chin-up", foco: ["Crescimento", "Força"] },
    { equipamento: "Halteres", exercicio: "Rosca concentrada", foco: ["Crescimento", ] },
    { equipamento: "Barra", exercicio: "Rosca 21", foco: ["Resistência", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Rosca inversa", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Kettlebell", exercicio: "Rosca unilateral", foco: ["Funcional", "Resistência"] },
    { equipamento: "Corpo", exercicio: "Isometria de bíceps", foco: ["Força", ] },
    { equipamento: "Halteres", exercicio: "Rosca inclinada", foco: ["Crescimento", ] }
  ],

  triceps: [
    { equipamento: "Halteres", exercicio: "Coice de tríceps", foco: ["Resistência", ] },
    { equipamento: "Halteres", exercicio: "Tríceps francês", foco: ["Crescimento", "Força"] },
    { equipamento: "Barra", exercicio: "Tríceps testa", foco: ["Força", "Crescimento"] },
    { equipamento: "Elástico", exercicio: "Extensão com elástico", foco: ["Mobilidade", "Resistência"] },
    { equipamento: "Kettlebell", exercicio: "Extensão acima da cabeça", foco: ["Funcional", "Força"] },
    { equipamento: "Corpo", exercicio: "Paralelas (dips)", foco: ["Força", "Crescimento", ] },
    { equipamento: "Corda naval", exercicio: "Ondas curtas", foco: ["Resistência", ] },
    { equipamento: "Halteres", exercicio: "Kickback unilateral", foco: ["Resistência", ] },
    { equipamento: "Barra", exercicio: "Fechamento de supino", foco: ["Força", "Crescimento"] },
    { equipamento: "Corpo", exercicio: "Flexão diamante", foco: ["Crescimento", "Resistência"] },
    { equipamento: "Elástico", exercicio: "Tríceps pull-down", foco: ["Resistência", "Mobilidade"] },
    { equipamento: "Corpo", exercicio: "Extensão em banco", foco: ["Força", ] },
    { equipamento: "Kettlebell", exercicio: "Tríceps kickback com kettlebell", foco: ["Funcional", "Força"] }
  ]
};

// ================================
// 🔹 CALCULAR SÉRIES E REPETIÇÕES (Para treino Padrão)
// ================================
function calcularTreino(usuario, foco) {
  const { idade, peso, sexo, objetivo } = usuario;
  let series = 3, repeticoes = 10;

  if (objetivo !== "Força") {
    if (idade < 20) repeticoes += 2;
    if (idade > 40) repeticoes -= 2;
    if (peso > 85) series += 1;
    if (peso < 60) repeticoes += 2;
    if (sexo === "masculino") series += 1;
    else repeticoes += 2;
  }

  switch (objetivo) {
    case "Força": series = 2; repeticoes -= 2; break;
    case "Crescimento": series += 1; repeticoes = 10; break;
    case "Resistência": repeticoes += 6; break;
    case "Funcional": repeticoes += 2; break;
    case "Mobilidade": series -= 1; repeticoes += 6; break;
    case "Aeróbico": series -= 1; repeticoes += 8; break;
  }

  if (foco.includes(objetivo)) {
    if (objetivo === "Força" || objetivo === "Crescimento") series += 1;
    if (objetivo === "Resistência" || objetivo === "Aeróbico") repeticoes += 2;
  }

  series = Math.max(2, Math.min(series, 6));
  repeticoes = Math.max(4, Math.min(repeticoes, 20));
  return { series, repeticoes };
}

// ================================
// 🔹 AUTENTICAÇÃO E CARREGAMENTO DE DADOS
// ================================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    treinoElem.textContent = "Faça login para ver seus treinos.";
    return;
  }

  const doc = await db.collection("usuarios").doc(user.uid).get();
  if (!doc.exists) {
    treinoElem.textContent = "Usuário não encontrado.";
    return;
  }

  usuario = doc.data();
  equipamentosUsuario = usuario.equipamentos || [];
  objetivoUsuario = usuario.objetivo || "";
  
  // 🚨 Adicionei a verificação de 'nivel' aqui. Garanta que ela existe no seu Firestore.
  usuario.nivel = usuario.nivel || "iniciante"; 

  treinoElem.textContent = `Clique no botão para gerar seu treino (Objetivo: ${objetivoUsuario}).`;
  btnProximo.disabled = false;
  btnGerarIA.disabled = false; // 🆕 GEMINI IA: Habilita o novo botão IA
});

// ================================
// 🔹 LÓGICA DO TREINO PADRÃO (EXISTENTE)
// ================================
btnProximo.addEventListener("click", () => {
  const treinos = Object.keys(mapaTreinos);
  const ultimo = localStorage.getItem("ultimoTreino");
  let proximo = treinos[0];

  if (ultimo && treinos.includes(ultimo)) {
    const idx = treinos.indexOf(ultimo);
    proximo = treinos[(idx + 1) % treinos.length];
  }

  localStorage.setItem("ultimoTreino", proximo);
  treinoElem.textContent = `Treino Padrão: ${proximo} (${objetivoUsuario})`;
  mostrarExercicios(proximo);
});

function mostrarExercicios(treinoDoDia) {
  container.innerHTML = "";
  const grupos = mapaTreinos[treinoDoDia];
  let encontrados = 0;

  grupos.forEach(grupo => {
    const lista = exercicios[grupo].filter(ex =>
      equipamentosUsuario.includes(ex.equipamento) &&
      ex.foco.includes(objetivoUsuario)
    );
    const listaFinal = lista.length > 0 ? lista : exercicios[grupo];
    const selecionados = listaFinal.sort(() => 0.5 - Math.random()).slice(0, 4);

    if (selecionados.length > 0) {
      const grupoDiv = document.createElement("div");
      grupoDiv.innerHTML = `<h3>${grupo.toUpperCase()}</h3>`;

      selecionados.forEach(ex => {
        const item = document.createElement("div");
        item.classList.add("exercicio-item");
        item.innerHTML = `<p><strong>${ex.exercicio}</strong> (${ex.equipamento})</p>`;
        // Note: A função mostrarDetalhes aqui é a que recalcula séries (padrão)
        item.addEventListener("click", () => mostrarDetalhes(ex, grupo)); 
        grupoDiv.appendChild(item);
      });

      container.appendChild(grupoDiv);
      encontrados += selecionados.length;
    }
  });

  if (encontrados === 0) {
    container.innerHTML = "<p>Nenhum exercício compatível com seu objetivo e equipamentos.</p>";
  }
}

// ================================
// 🔹 MODAL DE ALERTA PERSONALIZADO (MANTIDO)
// ================================
function showCustomAlert(message, onConfirm = null) {
  const modal = document.getElementById("customAlert");
  const msg = document.getElementById("customAlertMessage");
  
  msg.textContent = message;
  modal.style.display = "flex";

  const button = modal.querySelector("button");
  button.onclick = () => {
    closeCustomAlert();
    if (typeof onConfirm === "function") onConfirm();
  };
}

function closeCustomAlert() {
  document.getElementById("customAlert").style.display = "none";
}

// ================================
// 🔹 DETALHES DO EXERCÍCIO + SALVAR TREINO (PADRÃO)
// ================================
function mostrarDetalhes(ex, grupoMuscular) {
  const { series, repeticoes } = calcularTreino(usuario, ex.foco);
  container.innerHTML = `
    <h2>${ex.exercicio}</h2>
    <p>Equipamento: ${ex.equipamento}</p>
    <p>Foco: ${ex.foco.join(", ")}</p>
    <p><strong>${series} séries de ${repeticoes} repetições</strong></p>
    <button id="btnRealizar">Finalizar Exercício</button>
    <button id="btnVoltar">Voltar</button>
  `;

  document.getElementById("btnRealizar").addEventListener("click", async () => {
    // ... CÓDIGO DE REGISTRO NO FIREBASE (MANTIDO)
    const registro = {
      exercicio: ex.exercicio,
      grupo: grupoMuscular,
      equipamento: ex.equipamento,
      series,
      repeticoes,
      objetivo: usuario.objetivo,
      data: new Date().toISOString()
    };

    const user = auth.currentUser;
    if (!user) return;

    await db.collection("usuarios").doc(user.uid)
      .collection("progresso")
      .add(registro);

    // 🔹 Atualiza contador de treinos
    const contadoresRef = db.collection("usuarios").doc(user.uid).collection("estatisticas").doc("contadores");
    await db.runTransaction(async (t) => {
      const doc = await t.get(contadoresRef);
      const data = doc.exists ? doc.data() : {};
      data[grupoMuscular] = (data[grupoMuscular] || 0) + 1;
      data.total = (data.total || 0) + 1;
      t.set(contadoresRef, data);
    });

    showCustomAlert("✅ Exercício registrado com sucesso!");
    btnProximo.click();
  });

  document.getElementById("btnVoltar").addEventListener("click", () => {
    const ultimo = localStorage.getItem("ultimoTreino");
    mostrarExercicios(ultimo);
  });
}


// =================================================================
// 🆕 GEMINI IA: LÓGICA DE GERAÇÃO E EXIBIÇÃO DE TREINO PELA IA (CORRIGIDA)
// =================================================================

btnGerarIA.addEventListener("click", async () => {
  if (!usuario || !usuario.objetivo) {
    showCustomAlert("Por favor, complete seu perfil para usar a IA.");
    return;
  }
  
  // 1. Prepara os dados para o backend (AGORA INCLUINDO IDADE, PESO E ALTURA)
  const dadosParaIA = {
    objetivo: usuario.objetivo,
    equipamentos: equipamentosUsuario,
    // 🚨 CORREÇÃO: Passando os dados obrigatórios que o backend espera
    peso: usuario.peso, 
    altura: usuario.altura, 
    idade: usuario.idade // Presume que estes campos estão salvos no Firestore
  };
    
    // 🚨 VALIDAÇÃO: Verifica se os dados necessários estão presentes antes de enviar
    if (!dadosParaIA.peso || !dadosParaIA.altura || !dadosParaIA.idade) {
        console.error("Dados Físicos Faltando:", dadosParaIA);
        showCustomAlert("Erro: Peso, Altura ou Idade não foram encontrados no seu perfil. Certifique-se de que eles estão salvos no Firebase/Firestore.");
        return;
    }
  
  treinoElem.textContent = "Gerando treino com Inteligência Artificial...";
  container.innerHTML = ""; // Limpa a tela
  
  try {
    // 2. Chama o backend (Node.js)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosParaIA)
    });

    const treinoGerado = await response.json();

    if (response.ok) {
      // 3. Exibe o treino da IA
      exibirTreinoDaIA(treinoGerado); 
    } else {
      console.error("Erro do backend:", treinoGerado);
      showCustomAlert(`Erro ao gerar treino IA: ${treinoGerado.error || 'Erro desconhecido'}`);
    }

  } catch (error) {
    console.error("Erro de conexão com o backend:", error);
    showCustomAlert("Falha na comunicação com o servidor de IA. Verifique se o servidor Node.js está rodando na porta 3001.");
  }
});

function exibirTreinoDaIA(treino) {
  container.innerHTML = "";
  // Usa o nome do treino gerado pela IA (ex: "Treino de Peito e Tríceps")
  treinoElem.textContent = `Treino de IA: ${treino.treinoDoDia}`; 
  
  const grupoDiv = document.createElement("div");
  grupoDiv.innerHTML = `<h3>${treino.treinoDoDia.toUpperCase()}</h3>`;

  treino.exercicios.forEach(ex => {
    const item = document.createElement("div");
    item.classList.add("exercicio-item");
    // Exibe o exercício, séries e repetições sugeridas pela IA
    item.innerHTML = `<p><strong>${ex.nome}</strong> (${ex.equipamento}) - ${ex.series}x${ex.repeticoes}</p>`;
    
    // Mapeia para a nova função de detalhe que usa os dados da IA
    item.addEventListener("click", () => mostrarDetalhesIA(ex, treino.treinoDoDia));
    grupoDiv.appendChild(item);
  });

  container.appendChild(grupoDiv);
}

function mostrarDetalhesIA(ex, grupoMuscular) {
  // A IA já forneceu series e repeticoes no objeto 'ex'
  const series = ex.series; 
  const repeticoes = ex.repeticoes; 
  
  container.innerHTML = `
    <h2>${ex.nome}</h2>
    <p>Equipamento: ${ex.equipamento}</p>
    <p><strong>${series} séries de ${repeticoes} repetições</strong></p>
    <button id="btnRealizar">Finalizar Exercício</button>
    <button id="btnVoltarIA">Voltar (Treino IA)</button>
  `;

  document.getElementById("btnRealizar").addEventListener("click", async () => {
    // 1. Prepara o registro (usando dados da IA)
    const registro = {
      exercicio: ex.nome, 
      grupo: grupoMuscular,
      equipamento: ex.equipamento,
      series,
      repeticoes,
      objetivo: usuario.objetivo,
      data: new Date().toISOString()
    };

    const user = auth.currentUser;
    if (!user) return;

    // 2. Salva no Firestore
    await db.collection("usuarios").doc(user.uid)
      .collection("progresso")
      .add(registro);

    // 3. Atualiza contador de treinos
    const contadoresRef = db.collection("usuarios").doc(user.uid).collection("estatisticas").doc("contadores");
    await db.runTransaction(async (t) => {
      const doc = await t.get(contadoresRef);
      const data = doc.exists ? doc.data() : {};
      // Atualiza o contador com base no grupo muscular gerado pela IA
      data[grupoMuscular] = (data[grupoMuscular] || 0) + 1; 
      data.total = (data.total || 0) + 1;
      t.set(contadoresRef, data);
    });

    showCustomAlert("✅ Exercício registrado com sucesso!");
    // Tenta recarregar o treino da IA
    btnGerarIA.click();
  });

  document.getElementById("btnVoltarIA").addEventListener("click", () => {
    // Quando volta, chama a IA novamente para gerar um novo treino
    btnGerarIA.click();
  });
}